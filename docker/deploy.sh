#!/bin/bash

# InduSign Docker Deployment Script
# This script builds and deploys the InduSign application using Docker Compose

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENVIRONMENT=${1:-production}
BACKUP_DIR="../backups"
LOG_FILE="./deploy.log"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running. Please start Docker first."
    fi
    
    log "Prerequisites check passed."
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p ../uploads
    mkdir -p ../downloads
    mkdir -p ../shared
    mkdir -p ./nginx/logs
    mkdir -p ./nginx/ssl
    mkdir -p "$BACKUP_DIR"
    
    log "Directories created successfully."
}

# Generate SSL certificates (self-signed for development)
generate_ssl_certificates() {
    log "Generating SSL certificates..."
    
    if [ ! -f "./nginx/ssl/cert.pem" ] || [ ! -f "./nginx/ssl/key.pem" ]; then
        mkdir -p ./nginx/ssl
        
        # Generate self-signed certificate
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ./nginx/ssl/key.pem \
            -out ./nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" \
            2>/dev/null || warning "Failed to generate SSL certificates. Using HTTP only."
        
        log "SSL certificates generated."
    else
        log "SSL certificates already exist."
    fi
}

# Backup existing data
backup_data() {
    log "Creating backup of existing data..."
    
    BACKUP_NAME="indusign_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        # Stop services before backup
        docker-compose -f "$COMPOSE_FILE" stop
        
        # Create backup
        tar -czf "$BACKUP_DIR/$BACKUP_NAME" \
            ../uploads \
            ../downloads \
            ../shared \
            2>/dev/null || warning "Failed to create backup."
        
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    else
        log "No running services found. Skipping backup."
    fi
}

# Build and deploy
deploy() {
    log "Starting deployment for environment: $ENVIRONMENT"
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" pull || warning "Failed to pull some images."
    
    # Build images
    log "Building Docker images..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache || error "Failed to build images."
    
    # Start services
    log "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d || error "Failed to start services."
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_health
    
    log "Deployment completed successfully!"
}

# Check service health
check_health() {
    log "Checking service health..."
    
    # Check if all services are running
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log "All services are running."
    else
        error "Some services failed to start."
    fi
    
    # Check frontend
    if curl -f http://localhost:3000/health &>/dev/null; then
        log "Frontend is healthy."
    else
        warning "Frontend health check failed."
    fi
    
    # Check backend
    if curl -f http://localhost:8000/health &>/dev/null; then
        log "Backend is healthy."
    else
        warning "Backend health check failed."
    fi
    
    # Check database
    if docker-compose -f "$COMPOSE_FILE" exec -T indusign-db pg_isready -U postgres &>/dev/null; then
        log "Database is healthy."
    else
        warning "Database health check failed."
    fi
}

# Show service status
show_status() {
    log "Service Status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    log "Service Logs (last 10 lines):"
    docker-compose -f "$COMPOSE_FILE" logs --tail=10
}

# Stop services
stop_services() {
    log "Stopping services..."
    docker-compose -f "$COMPOSE_FILE" down
    log "Services stopped."
}

# Clean up
cleanup() {
    log "Cleaning up..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    log "Cleanup completed."
}

# Show usage
usage() {
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy the application (default)"
    echo "  stop       Stop all services"
    echo "  status     Show service status"
    echo "  cleanup    Clean up unused Docker resources"
    echo "  backup     Create backup of data"
    echo ""
    echo "Environments:"
    echo "  production  Production environment (default)"
    echo "  staging     Staging environment"
    echo "  development Development environment"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production"
    echo "  $0 stop"
    echo "  $0 status"
}

# Main execution
main() {
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            create_directories
            generate_ssl_certificates
            backup_data
            deploy
            show_status
            ;;
        "stop")
            stop_services
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "backup")
            backup_data
            ;;
        "help"|"-h"|"--help")
            usage
            ;;
        *)
            error "Unknown command: $1. Use 'help' for usage information."
            ;;
    esac
}

# Run main function
main "$@" 