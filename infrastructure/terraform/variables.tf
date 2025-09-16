# Variables for Terraform configuration

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region (Swiss region preferred)"
  type        = string
  default     = "europe-west6" # Zurich
}

variable "zone" {
  description = "Google Cloud zone"
  type        = string
  default     = "europe-west6-a"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "tofi.ch"
}

# GKE variables
variable "machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-standard-2"
}

variable "node_count" {
  description = "Initial number of nodes in the GKE cluster"
  type        = number
  default     = 3
}

variable "min_node_count" {
  description = "Minimum number of nodes in the GKE cluster"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum number of nodes in the GKE cluster"
  type        = number
  default     = 10
}

# Database variables
variable "db_tier" {
  description = "Database tier for Cloud SQL"
  type        = string
  default     = "db-g1-small"
}

variable "db_disk_size" {
  description = "Database disk size in GB"
  type        = number
  default     = 20
}

variable "db_max_disk_size" {
  description = "Maximum database disk size in GB"
  type        = number
  default     = 100
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Redis variables
variable "redis_memory_size" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1
}

# Cloudflare variables
variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain"
  type        = string
}

# Application variables
variable "nextauth_secret" {
  description = "NextAuth.js secret"
  type        = string
  sensitive   = true
}

variable "google_oauth_client_id" {
  description = "Google OAuth client ID"
  type        = string
  sensitive   = true
}

variable "google_oauth_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
}

# Swiss-specific variables
variable "swiss_post_api_key" {
  description = "Swiss Post API key for address validation"
  type        = string
  sensitive   = true
  default     = ""
}

variable "twint_merchant_id" {
  description = "TWINT merchant ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "twint_api_key" {
  description = "TWINT API key"
  type        = string
  sensitive   = true
  default     = ""
}