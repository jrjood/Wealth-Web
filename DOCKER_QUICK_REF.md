# 🐳 Docker Quick Reference

## Fastest Start

```bash
# Windows
docker-start.bat

# Mac/Linux
./docker-start.sh
```

## Essential Commands

### Start/Stop
```bash
docker-compose up              # Start (foreground)
docker-compose up -d           # Start (background)
docker-compose down            # Stop
docker-compose restart         # Restart all
```

### View Status
```bash
docker-compose ps              # List containers
docker-compose logs -f         # Follow all logs
docker-compose logs backend    # Specific service
docker stats                   # Resource usage
```

### Database
```bash
# Prisma Studio (visual DB editor)
docker-compose exec backend npx prisma studio

# MySQL CLI
docker-compose exec db mysql -u wealth_user -pwealth_password wealth_holding

# Backup
docker-compose exec db mysqldump -u wealth_user -pwealth_password wealth_holding > backup.sql

# Restore
docker-compose exec -T db mysql -u wealth_user -pwealth_password wealth_holding < backup.sql

# Re-seed
docker-compose exec backend node prisma/seed.js
```

### Troubleshooting
```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild
docker-compose up --build

# Full reset (deletes database!)
docker-compose down -v
docker-compose up --build
```

## Access Points

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Admin: http://localhost:5173/admin/login
- Prisma Studio: http://localhost:5555 (after running studio command)

## Default Credentials

- Email: `admin@wealthholding.com`
- Password: `changeme123`

## Services in Docker Compose

1. **db** - MySQL 8.0 database
2. **backend** - Express API (Node.js)
3. **frontend** - React app (Vite)

## Common Issues

**Port already in use:**
Edit `docker-compose.yml` ports section

**Database connection error:**
Wait for DB to be ready, check logs: `docker-compose logs db`

**Changes not reflecting:**
Restart: `docker-compose restart`

**Clean slate:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Production

```bash
# Use production compose
docker-compose -f docker-compose.prod.yml up -d

# With env file
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

---

📚 **Full guide:** [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
