# 🚀 Quick Reference Card

## Starting the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Login**: http://localhost:5173/admin/login
- **Prisma Studio**: Run `npx prisma studio` in server folder

## Default Admin Credentials
```
Email:    admin@wealthholding.com
Password: changeme123
```

## Common Commands

### Database
```bash
cd server

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run seed

# Open Prisma Studio (visual editor)
npm run db:studio

# Reset database (DANGER: deletes all data)
npx prisma db push --force-reset
```

### Backend
```bash
cd server

# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# View all routes
# Edit src/index.js
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Locations

### Configuration
- Backend env: `server/.env`
- Frontend env: `.env`
- Database schema: `server/prisma/schema.prisma`
- Seed data: `server/prisma/seed.js`

### Backend Routes
- Auth: `server/src/routes/auth.js`
- Projects: `server/src/routes/projects.js`
- Jobs: `server/src/routes/jobs.js`

### Frontend Pages
- Admin Login: `src/pages/AdminLogin.tsx`
- Admin Dashboard: `src/pages/AdminDashboard.tsx`
- Admin Projects: `src/pages/AdminProjects.tsx`
- Admin Jobs: `src/pages/AdminJobs.tsx`
- Public Projects: `src/pages/Projects.tsx`
- Public Careers: `src/pages/Careers.tsx`

## Database Connection String

### Format
```
mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME
```

### Examples
```bash
# Local development
mysql://root:password@localhost:3306/wealth_holding

# cPanel hosting
mysql://cpanel_user:secure_pass@localhost:3306/cpanel_wealthdb

# Remote database
mysql://user:pass@db.example.com:3306/wealth_holding
```

## API Endpoints Quick Reference

### Authentication
```
POST /api/auth/login
Body: { email, password }
Returns: { token, admin }
```

### Projects (Public)
```
GET  /api/projects              # All projects
GET  /api/projects/:slug        # Single project
```

### Projects (Protected - requires Bearer token)
```
POST   /api/projects            # Create
PUT    /api/projects/:id        # Update
DELETE /api/projects/:id        # Delete
```

### Jobs (Public)
```
GET /api/jobs                   # Published jobs
GET /api/jobs/:id               # Single job
```

### Jobs (Protected - requires Bearer token)
```
POST   /api/jobs                # Create
PUT    /api/jobs/:id            # Update
DELETE /api/jobs/:id            # Delete
```

## Testing API with curl

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wealthholding.com","password":"changeme123"}'
```

### Get Projects
```bash
curl http://localhost:3001/api/projects
```

### Create Project (with auth)
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Project",
    "location": "Dubai, UAE",
    "type": "Residential",
    "status": "Under Construction",
    "description": "Test description",
    "slug": "test-project"
  }'
```

## Troubleshooting

### "Cannot connect to database"
```bash
cd server
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
# Test connection
npx prisma db push
```

### "Module not found"
```bash
# Backend
cd server && npm install

# Frontend
npm install
```

### "Prisma Client not found"
```bash
cd server
npx prisma generate
```

### "CORS error"
```bash
# Update server/.env
CORS_ORIGIN=http://localhost:5173
```

### "Port already in use"
```bash
# Backend (port 3001)
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9

# Frontend (port 5173)
# Kill Vite process and restart
```

## Environment Variables

### Backend (server/.env)
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@wealthholding.com
ADMIN_PASSWORD=changeme123
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## Production Deployment

### Backend
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Update `CORS_ORIGIN` to production frontend URL
4. Use strong `JWT_SECRET`
5. Change admin credentials
6. Run: `npm install --production`
7. Start: `npm start` or use PM2

### Frontend
1. Update `.env` with production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to hosting
4. Configure server for SPA routing

## Database Backup & Restore

### Backup (via phpMyAdmin)
1. Open phpMyAdmin
2. Select database
3. Click "Export" tab
4. Choose "Quick" or "Custom"
5. Click "Go"

### Backup (via command line)
```bash
mysqldump -u username -p database_name > backup.sql
```

### Restore
```bash
mysql -u username -p database_name < backup.sql
```

## Adding New Admin User

### Via Prisma Studio
1. Run `npx prisma studio` in server folder
2. Open Admin table
3. Click "Add record"
4. Enter email and name
5. For password: Hash it first using bcrypt (or use seed script pattern)

### Via Seed Script
Edit `server/prisma/seed.js` and add another admin:
```javascript
const admin2 = await prisma.admin.upsert({
  where: { email: 'newadmin@email.com' },
  update: {},
  create: {
    email: 'newadmin@email.com',
    password: await bcrypt.hash('newpassword', 10),
    name: 'New Admin'
  }
});
```

Then run: `npm run seed`

## Useful npm Scripts

### Backend (in server/)
```bash
npm run dev       # Start development server
npm start         # Start production server
npm run seed      # Seed database
npm run db:push   # Push schema to database
npm run db:studio # Open Prisma Studio
```

### Frontend (in root)
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter
```

## Package Updates
```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Security audit
npm audit
npm audit fix
```

---

**Keep this file handy for quick reference!** 📌
