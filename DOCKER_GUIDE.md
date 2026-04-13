# 🐳 Docker Setup Guide

## Overview
This project is fully containerized with Docker, including MySQL database, Express backend, and React frontend.

## Prerequisites
- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start (Development)

### 1. Start Everything with One Command
```bash
docker-compose up
```

That's it! The application will:
- Start MySQL database on port 3306
- Start backend API on port 3001
- Start frontend on port 5173
- Automatically create database tables
- Seed initial data (admin user + sample projects/jobs)

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Credentials**: 
  - Email: `admin@wealthholding.com`
  - Password: `changeme123`

### 3. Stop Everything
```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers, and delete volumes (WARNING: deletes database)
docker-compose down -v
```

## 📋 Docker Commands Reference

### Starting Services

```bash
# Start all services (detached mode)
docker-compose up -d

# Start and rebuild containers
docker-compose up --build

# Start specific service
docker-compose up backend
docker-compose up frontend
docker-compose up db

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Managing Containers

```bash
# List running containers
docker-compose ps

# Stop all services
docker-compose stop

# Start stopped services
docker-compose start

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Database Management

```bash
# Access MySQL database
docker-compose exec db mysql -u wealth_user -pwealth_password wealth_holding

# Access MySQL as root
docker-compose exec db mysql -u root -prootpassword

# Run Prisma commands
docker-compose exec backend npx prisma studio
docker-compose exec backend npx prisma db push
docker-compose exec backend node prisma/seed.js
```

### Viewing Logs

```bash
# All services
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Last 100 lines
docker-compose logs --tail=100
```

### Cleaning Up

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes (deletes database!)
docker-compose down -v

# Remove containers, volumes, and images
docker-compose down -v --rmi all

# Prune unused Docker resources
docker system prune -a
```

## 🏗️ Project Structure

```
├── docker-compose.yml              # Development compose file
├── docker-compose.prod.yml         # Production compose file
├── Dockerfile.frontend             # Frontend dev Dockerfile
├── Dockerfile.frontend.prod        # Frontend prod Dockerfile
├── .dockerignore                   # Files to ignore
├── .env.docker                     # Frontend dev env
├── .env.prod.example               # Production env template
│
├── server/
│   ├── Dockerfile                  # Backend dev Dockerfile
│   ├── Dockerfile.prod             # Backend prod Dockerfile
│   ├── .dockerignore               # Backend ignore files
│   └── .env.docker                 # Backend dev env
```

## 🔧 Configuration

### Development Environment Variables

Already configured in `docker-compose.yml`:
- Database: `wealth_holding`
- DB User: `wealth_user`
- DB Password: `wealth_password`
- Backend Port: `3001`
- Frontend Port: `5173`

### Customizing Settings

Edit `docker-compose.yml` to change:
- Ports
- Database credentials
- Admin credentials
- Environment variables

Example:
```yaml
services:
  db:
    environment:
      MYSQL_DATABASE: my_custom_db
      MYSQL_USER: my_user
      MYSQL_PASSWORD: my_password
  backend:
    ports:
      - "4000:3001"  # Map to different host port
```

## 🔄 Development Workflow

### Hot Reload
Both frontend and backend support hot reload:
- Edit files on your host machine
- Changes are automatically reflected in containers
- No need to rebuild!

### Making Code Changes
```bash
# 1. Edit files in your editor
# 2. Changes auto-reload in containers
# 3. Check logs to see updates
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuilding After Dependency Changes
```bash
# If you modify package.json
docker-compose down
docker-compose up --build
```

### Accessing Container Shell
```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec db bash
```

## 📊 Database Operations

### Accessing Prisma Studio
```bash
docker-compose exec backend npx prisma studio
```
Opens at: http://localhost:5555

### Database Backup
```bash
# Create backup
docker-compose exec db mysqldump -u wealth_user -pwealth_password wealth_holding > backup.sql

# Restore backup
docker-compose exec -T db mysql -u wealth_user -pwealth_password wealth_holding < backup.sql
```

### Reset Database
```bash
# Warning: Deletes all data!
docker-compose down -v
docker-compose up
```

### Manual Database Seeding
```bash
docker-compose exec backend node prisma/seed.js
```

## 🚀 Production Deployment

### 1. Prepare Environment File
```bash
cp .env.prod.example .env.prod
# Edit .env.prod with production values
```

### 2. Update Production Values
Edit `.env.prod`:
- Set strong passwords
- Update CORS_ORIGIN to your domain
- Generate secure JWT_SECRET
- Use HTTPS URLs

### 3. Start Production Stack
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### 4. Production Features
- ✅ Optimized builds (multi-stage)
- ✅ Smaller image sizes
- ✅ Nginx for frontend
- ✅ Health checks
- ✅ Auto-restart on failure
- ✅ Production-ready MySQL

### 5. Production Monitoring
```bash
# View container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health
docker inspect --format='{{.State.Health.Status}}' wealth-holding-backend-prod
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
services:
  frontend:
    ports:
      - "8080:5173"  # Use 8080 instead
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose up --build

# Remove and recreate
docker-compose down
docker-compose up
```

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# Restart database
docker-compose restart db

# Check backend can reach db
docker-compose exec backend ping db
```

### Clear Everything and Start Fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Backend Can't Connect to Database
Wait for database to be ready. The `healthcheck` in docker-compose ensures this, but you can manually check:
```bash
docker-compose exec db mysqladmin ping -h localhost
```

### Frontend Can't Reach Backend
Check CORS_ORIGIN in docker-compose.yml matches frontend URL.

### Permission Issues (Linux)
```bash
# Fix ownership
sudo chown -R $USER:$USER .
```

## 📝 Common Tasks

### View Environment Variables
```bash
docker-compose exec backend printenv
docker-compose exec frontend printenv
```

### Run Commands in Container
```bash
# Install new package
docker-compose exec backend npm install package-name

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Run tests
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

### Update Admin Password
```bash
docker-compose exec backend node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('newpassword', 10));
"

# Then update in Prisma Studio or database directly
```

### Check Container Resource Usage
```bash
docker stats
```

### Export/Import Database

**Export:**
```bash
docker-compose exec db mysqldump -u wealth_user -pwealth_password wealth_holding > backup_$(date +%Y%m%d).sql
```

**Import:**
```bash
docker-compose exec -T db mysql -u wealth_user -pwealth_password wealth_holding < backup_20260116.sql
```

## 🔐 Security Best Practices

### For Production:

1. **Change Default Passwords**
   - Database passwords
   - Admin credentials
   - JWT secret

2. **Use Strong Secrets**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Enable HTTPS**
   - Use reverse proxy (nginx, traefik)
   - Configure SSL certificates

4. **Limit Ports**
   - Don't expose database port publicly
   - Use internal Docker network

5. **Regular Backups**
```bash
# Add to cron
0 2 * * * docker-compose exec db mysqldump -u wealth_user -pwealth_password wealth_holding > /backups/db_$(date +\%Y\%m\%d).sql
```

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:3001/api/health

# Container health
docker inspect --format='{{.State.Health.Status}}' wealth-holding-backend
```

### Performance Monitoring
```bash
# Real-time stats
docker stats

# Specific container
docker stats wealth-holding-backend
```

## 🎯 Next Steps

1. ✅ Run `docker-compose up`
2. ✅ Access http://localhost:5173
3. ✅ Login to admin at http://localhost:5173/admin/login
4. ✅ Add your projects and jobs
5. ✅ Customize as needed
6. ✅ Deploy to production when ready

## 💡 Tips

- Keep Docker Desktop running
- Use `docker-compose up -d` for background running
- Check logs regularly: `docker-compose logs -f`
- Backup database before major changes
- Use Prisma Studio for easy database management
- Monitor container resources with `docker stats`

## 🆘 Getting Help

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify services are running: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Full reset: `docker-compose down -v && docker-compose up --build`

---

**Everything runs in containers - no local setup needed!** 🎉
