# InduSign Docker Deployment

This directory contains all Docker-related files for deploying the InduSign eSignature application.

## 📁 Directory Structure

```
docker/
├── Dockerfile              # Main application Dockerfile
├── docker-compose.yml      # Multi-service orchestration
├── .dockerignore          # Files to exclude from build
├── deploy.sh              # Deployment automation script
├── nginx/
│   ├── nginx.conf         # Nginx reverse proxy configuration
│   ├── ssl/               # SSL certificates directory
│   └── logs/              # Nginx logs directory
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Docker** (version 20.10+)
2. **Docker Compose** (version 2.0+)
3. **OpenSSL** (for SSL certificate generation)

### Installation

1. **Navigate to the docker directory:**
   ```bash
   cd docker/
   ```

2. **Make the deployment script executable:**
   ```bash
   chmod +x deploy.sh
   ```

3. **Deploy the application:**
   ```bash
   ./deploy.sh deploy
   ```

## 🛠️ Deployment Commands

### Basic Commands

```bash
# Deploy the application
./deploy.sh deploy

# Stop all services
./deploy.sh stop

# Check service status
./deploy.sh status

# Clean up Docker resources
./deploy.sh cleanup

# Create backup
./deploy.sh backup

# Show help
./deploy.sh help
```

### Environment-Specific Deployment

```bash
# Production deployment
./deploy.sh deploy production

# Staging deployment
./deploy.sh deploy staging

# Development deployment
./deploy.sh deploy development
```

## 🏗️ Architecture

The application is deployed using the following services:

### Frontend Service (`indusign-frontend`)
- **Port:** 3000
- **Technology:** Electron + React
- **Purpose:** Main application interface
- **Health Check:** Node.js process check

### Backend Service (`indusign-backend`)
- **Port:** 8000
- **Technology:** Python FastAPI
- **Purpose:** API endpoints and business logic
- **Health Check:** HTTP endpoint check

### Database Service (`indusign-db`)
- **Port:** 5432
- **Technology:** PostgreSQL 15
- **Purpose:** Data persistence
- **Health Check:** PostgreSQL readiness check

### Cache Service (`indusign-redis`)
- **Port:** 6379
- **Technology:** Redis 7
- **Purpose:** Session storage and caching
- **Health Check:** Redis ping

### Reverse Proxy (`indusign-nginx`)
- **Ports:** 80 (HTTP), 443 (HTTPS)
- **Technology:** Nginx
- **Purpose:** Load balancing and SSL termination
- **Health Check:** HTTP endpoint check

## 🔧 Configuration

### Environment Variables

#### Frontend
```bash
NODE_ENV=production
ELECTRON_DISABLE_SECURITY_WARNINGS=true
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

#### Backend
```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@indusign-db:5432/indusign
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REDIS_URL=redis://indusign-redis:6379
```

#### Database
```bash
POSTGRES_DB=indusign
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

### Volumes

The following directories are mounted as volumes:

- `../uploads/` - File uploads
- `../downloads/` - Downloaded files
- `../shared/` - Shared resources
- `./nginx/logs/` - Nginx logs
- `./nginx/ssl/` - SSL certificates

## 🔒 Security Features

### SSL/TLS Configuration
- **Protocols:** TLSv1.2, TLSv1.3
- **Ciphers:** ECDHE-RSA-AES256-GCM-SHA512
- **Certificate:** Self-signed (development) / Let's Encrypt (production)

### Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### Rate Limiting
- **API:** 10 requests/second
- **Login:** 5 requests/minute
- **Upload:** 100MB max file size

## 📊 Monitoring

### Health Checks
All services include health checks that run every 30 seconds:

- **Frontend:** Node.js process check
- **Backend:** HTTP endpoint check
- **Database:** PostgreSQL readiness check
- **Redis:** Redis ping check
- **Nginx:** HTTP endpoint check

### Logging
- **Application logs:** Available via `docker-compose logs`
- **Nginx logs:** Stored in `./nginx/logs/`
- **Deployment logs:** Stored in `./deploy.log`

## 🔄 Backup and Recovery

### Automatic Backups
The deployment script creates automatic backups before deployment:

```bash
# Backup location
../backups/indusign_backup_YYYYMMDD_HHMMSS.tar.gz
```

### Manual Backup
```bash
./deploy.sh backup
```

### Restore from Backup
```bash
# Stop services
./deploy.sh stop

# Extract backup
tar -xzf ../backups/indusign_backup_YYYYMMDD_HHMMSS.tar.gz

# Restart services
./deploy.sh deploy
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
netstat -tulpn | grep :5432
```

#### 2. Permission Issues
```bash
# Fix directory permissions
sudo chown -R $USER:$USER ../uploads ../downloads ../shared
```

#### 3. SSL Certificate Issues
```bash
# Regenerate SSL certificates
rm -f ./nginx/ssl/cert.pem ./nginx/ssl/key.pem
./deploy.sh deploy
```

#### 4. Database Connection Issues
```bash
# Check database status
docker-compose logs indusign-db

# Reset database
docker-compose down -v
docker-compose up -d
```

### Debug Commands

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs indusign-frontend
docker-compose logs indusign-backend

# Access service shell
docker-compose exec indusign-frontend sh
docker-compose exec indusign-backend bash

# Check resource usage
docker stats
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull

# Rebuild and redeploy
./deploy.sh deploy
```

### Updating Dependencies
```bash
# Rebuild with no cache
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### Database Migrations
```bash
# Run migrations
docker-compose exec indusign-backend alembic upgrade head
```

## 📈 Production Considerations

### Performance Optimization
- **Database:** Configure connection pooling
- **Redis:** Enable persistence
- **Nginx:** Enable gzip compression
- **Application:** Use production builds

### Security Hardening
- **SSL:** Use Let's Encrypt certificates
- **Secrets:** Use Docker secrets or environment files
- **Network:** Configure firewall rules
- **Monitoring:** Set up log aggregation

### Scaling
- **Horizontal:** Add more backend instances
- **Vertical:** Increase container resources
- **Database:** Configure read replicas
- **Cache:** Use Redis cluster

## 📞 Support

For issues and questions:

1. **Check logs:** `docker-compose logs`
2. **Verify health:** `./deploy.sh status`
3. **Review configuration:** Check environment variables
4. **Test connectivity:** Use health check endpoints

## 📝 License

This Docker setup is part of the InduSign eSignature application. 