# Terraform configuration for tofi.ch infrastructure
# Swiss flowers marketplace - Production-ready infrastructure

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "tofi-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "tofi-terraform-locks"
  }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "tofi"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Configure Cloudflare Provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# Local values
locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  # Swiss-specific configurations
  allowed_countries = ["CH", "LI", "AT", "DE", "FR", "IT"]
  
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    Country     = "CH"
    Compliance  = "GDPR,nFADP"
  }
}