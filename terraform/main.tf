# Main Terraform configuration file
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    # This will be configured per environment
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "jobberman"
      ManagedBy   = "terraform"
    }
  }
}

# EKS Module
module "eks" {
  source          = "./modules/eks"
  cluster_name    = "${var.project_name}-${var.environment}"
  cluster_version = var.kubernetes_version
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
  environment     = var.environment
  node_groups     = var.node_groups
}

# VPC Module
module "vpc" {
  source             = "./modules/vpc"
  vpc_name           = "${var.project_name}-${var.environment}"
  vpc_cidr           = var.vpc_cidr
  azs                = var.availability_zones
  private_subnets    = var.private_subnet_cidrs
  public_subnets     = var.public_subnet_cidrs
  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"
  environment        = var.environment
}

# RDS Module
module "rds" {
  source               = "./modules/rds"
  identifier           = "${var.project_name}-${var.environment}"
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  db_name              = "jobberman"
  username             = "postgres"
  password             = var.db_password
  vpc_id               = module.vpc.vpc_id
  subnet_ids           = module.vpc.database_subnets
  security_group_ids   = [module.eks.node_security_group_id]
  environment          = var.environment
  backup_retention_period = var.environment == "production" ? 7 : 1
}

# Kubernetes Provider Configuration
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    command     = "aws"
  }
}

# Helm Provider Configuration
provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
      command     = "aws"
    }
  }
}

# Deploy Prometheus, Grafana, and other monitoring tools
module "monitoring" {
  source       = "./modules/monitoring"
  cluster_name = module.eks.cluster_name
  environment  = var.environment
  depends_on   = [module.eks]
}
