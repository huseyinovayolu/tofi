# Terraform configuration for tofi.ch Swiss Flowers Marketplace
# Infrastructure as Code for production deployment

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Backend configuration for state management
  backend "gcs" {
    bucket = "tofi-terraform-state"
    prefix = "terraform/state"
  }
}

# Configure providers
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Local variables
locals {
  name_prefix = "tofi-${var.environment}"
  
  # Swiss-specific labels
  labels = {
    environment = var.environment
    project     = "tofi-marketplace"
    region      = "switzerland"
    managed_by  = "terraform"
  }

  # Swiss availability zones (using europe-west6 for Zurich)
  zones = [
    "europe-west6-a",
    "europe-west6-b",
    "europe-west6-c"
  ]
}

# Data sources
data "google_client_config" "default" {}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "${local.name_prefix}-network"
  auto_create_subnetworks = false
  mtu                     = 1460
}

# Subnet for GKE cluster (Swiss region)
resource "google_compute_subnetwork" "gke" {
  name          = "${local.name_prefix}-gke-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id

  secondary_ip_range {
    range_name    = "gke-pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "gke-services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

# Cloud NAT for outbound internet access
resource "google_compute_router" "main" {
  name    = "${local.name_prefix}-router"
  region  = var.region
  network = google_compute_network.main.id
}

resource "google_compute_router_nat" "main" {
  name   = "${local.name_prefix}-nat"
  router = google_compute_router.main.name
  region = var.region

  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# GKE Cluster (Swiss region optimized)
resource "google_container_cluster" "main" {
  name     = "${local.name_prefix}-gke"
  location = var.region

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.main.name
  subnetwork = google_compute_subnetwork.gke.name

  # IP allocation for pods and services
  ip_allocation_policy {
    cluster_secondary_range_name  = "gke-pods"
    services_secondary_range_name = "gke-services"
  }

  # Network policy
  network_policy {
    enabled = true
  }

  # Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Private cluster configuration
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  # Master authorized networks (restrict access)
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "0.0.0.0/0"
      display_name = "All networks (restrict in production)"
    }
  }

  # Addons
  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }
    network_policy_config {
      disabled = false
    }
    dns_cache_config {
      enabled = true
    }
  }

  # Release channel for automatic updates
  release_channel {
    channel = "STABLE"
  }

  # Enable shielded nodes
  enable_shielded_nodes = true

  # Maintenance policy
  maintenance_policy {
    daily_maintenance_window {
      start_time = "02:00" # 2 AM Swiss time
    }
  }

  # Logging and monitoring
  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"

  resource_labels = local.labels
}

# Primary node pool
resource "google_container_node_pool" "primary" {
  name       = "${local.name_prefix}-primary-pool"
  location   = var.region
  cluster    = google_container_cluster.main.name
  node_count = var.node_count

  node_config {
    preemptible  = var.environment != "production"
    machine_type = var.machine_type

    # Service account
    service_account = google_service_account.gke_nodes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    # Enable workload identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    # Shielded instance configuration
    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    labels = local.labels

    tags = ["tofi-gke-node"]
  }

  # Auto-scaling
  autoscaling {
    min_node_count = var.min_node_count
    max_node_count = var.max_node_count
  }

  # Auto-upgrade and auto-repair
  management {
    auto_repair  = true
    auto_upgrade = true
  }
}

# Service account for GKE nodes
resource "google_service_account" "gke_nodes" {
  account_id   = "${local.name_prefix}-gke-nodes"
  display_name = "GKE Nodes Service Account"
}

resource "google_project_iam_member" "gke_nodes" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/stackdriver.resourceMetadata.writer"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

# Cloud SQL (PostgreSQL with PostGIS)
resource "google_sql_database_instance" "main" {
  name             = "${local.name_prefix}-postgres"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier                        = var.db_tier
    availability_type           = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_type                   = "PD_SSD"
    disk_size                   = var.db_disk_size
    disk_autoresize             = true
    disk_autoresize_limit       = var.db_max_disk_size
    deletion_protection_enabled = var.environment == "production"

    # Backup and maintenance
    backup_configuration {
      enabled                        = true
      start_time                     = "01:00" # 1 AM Swiss time
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 30
      }
    }

    maintenance_window {
      day  = 7 # Sunday
      hour = 2 # 2 AM Swiss time
    }

    # IP configuration
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
      require_ssl     = true
    }

    # Database flags for PostGIS
    database_flags {
      name  = "shared_preload_libraries"
      value = "postgis"
    }

    # Swiss locale
    database_flags {
      name  = "lc_collate"
      value = "de_CH.UTF-8"
    }

    database_flags {
      name  = "lc_ctype"
      value = "de_CH.UTF-8"
    }

    user_labels = local.labels
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

# Database
resource "google_sql_database" "main" {
  name     = "tofi_${var.environment}"
  instance = google_sql_database_instance.main.name
}

# Database user
resource "google_sql_user" "main" {
  name     = "tofi"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# Private service connection for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "${local.name_prefix}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# Redis (Memorystore)
resource "google_redis_instance" "main" {
  name           = "${local.name_prefix}-redis"
  memory_size_gb = var.redis_memory_size
  region         = var.region

  tier                    = var.environment == "production" ? "STANDARD_HA" : "BASIC"
  redis_version           = "REDIS_7_0"
  display_name            = "tofi Redis Instance"
  authorized_network      = google_compute_network.main.id
  connect_mode            = "PRIVATE_SERVICE_ACCESS"
  transit_encryption_mode = "SERVER_MANAGED"
  auth_enabled            = true

  labels = local.labels
}

# Load Balancer IP
resource "google_compute_global_address" "main" {
  name = "${local.name_prefix}-ip"
}

# Cloud Storage buckets
resource "google_storage_bucket" "uploads" {
  name          = "${local.name_prefix}-uploads"
  location      = "EUROPE-WEST6" # Zurich
  force_destroy = var.environment != "production"

  uniform_bucket_level_access = true

  cors {
    origin          = ["https://${var.domain_name}"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  versioning {
    enabled = var.environment == "production"
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  labels = local.labels
}

# Outputs
output "cluster_name" {
  description = "GKE cluster name"
  value       = google_container_cluster.main.name
}

output "cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = google_container_cluster.main.endpoint
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "GKE cluster CA certificate"
  value       = google_container_cluster.main.master_auth[0].cluster_ca_certificate
  sensitive   = true
}

output "database_connection_name" {
  description = "Database connection name"
  value       = google_sql_database_instance.main.connection_name
}

output "database_private_ip" {
  description = "Database private IP"
  value       = google_sql_database_instance.main.private_ip_address
  sensitive   = true
}

output "redis_host" {
  description = "Redis host"
  value       = google_redis_instance.main.host
  sensitive   = true
}

output "load_balancer_ip" {
  description = "Load balancer IP address"
  value       = google_compute_global_address.main.address
}