# Wealth Holding Premium Realty - Setup Guide

## Overview
This application now has dynamic content management for Projects and Jobs, with an admin dashboard to manage this content. The database is MySQL (compatible with cPanel/phpMyAdmin).

## 🚀 Quick Start

### 1. Database Setup (MySQL/cPanel)

#### Create MySQL Database via cPanel:
1. Log into your cPanel hosting
2. Go to "MySQL Databases"
3. Create a new database (e.g., `wealth_holding`)
4. Create a new MySQL user with a strong password
5. Add the user to the database with ALL PRIVILEGES
6. Note down:
   - Database name
   - Database user
   - Database password
   - Database host (usually `localhost`)

#### Database Connection String Format:
```
mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME
```

Example:
```
mysql://wealth_user:MySecurePass123@localhost:3306/wealth_holding
```

### 2. Backend Setup

#### Install Dependencies:
```bash
cd server
npm install
```

#### Configure Environment:
```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` file with your details:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Your MySQL connection string from cPanel
DATABASE_URL="mysql://your_user:your_password@localhost:3306/wealth_holding"

# Generate a secure random string for JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin credentials (change these!)
ADMIN_EMAIL=admin@wealthholding.com
ADMIN_PASSWORD=changeme123
```

#### Initialize Database:
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Seed initial data (admin user + sample data)
node prisma/seed.js
```

#### Start Backend Server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

#### Install Dependencies:
```bash
# Go back to root directory
cd ..
npm install
```

#### Configure Environment:
```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001
```

For production, update to your actual API URL:
```env
VITE_API_URL=https://api.yourwebsite.com
```

#### Start Frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Admin Access

### Default Credentials:
- **Email**: admin@wealthholding.com
- **Password**: changeme123

### Admin Routes:
- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin/dashboard`
- Manage Projects: `http://localhost:5173/admin/projects`
- Manage Jobs: `http://localhost:5173/admin/jobs`

⚠️ **IMPORTANT**: Change the default admin password after first login!

## 📊 Database Management

### Using phpMyAdmin:
1. Access phpMyAdmin through cPanel
2. Select your database
3. You can view/edit tables:
   - `Admin` - Admin users
   - `Project` - Real estate projects
   - `Job` - Job openings

### Using Prisma Studio (Local Development):
```bash
cd server
npx prisma studio
```

This opens a visual database editor at `http://localhost:5555`

### Prisma Commands:
```bash
# View database structure
npx prisma db pull

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Generate Prisma Client after schema changes
npx prisma generate

# Re-seed database
node prisma/seed.js
```

## 🎯 Features

### Public Features:
- **Projects Page**: Dynamically loads projects from database
- **Careers Page**: Dynamically loads job openings from database
- Filter projects by type and status
- Filter jobs by department and type

### Admin Features:
- **Authentication**: JWT-based secure login
- **Project Management**: Create, update, delete projects
- **Job Management**: Create, update, delete job openings
- **Toggle Visibility**: Publish/unpublish jobs
- **Featured Projects**: Mark projects as featured

## 🏗️ Project Structure

```
├── server/                      # Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.js             # Initial data seeder
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.js         # Login routes
│   │   │   ├── projects.js     # Project CRUD
│   │   │   └── jobs.js         # Job CRUD
│   │   └── index.js            # Server entry point
│   ├── .env.example
│   └── package.json
│
├── src/                         # Frontend
│   ├── pages/
│   │   ├── Projects.tsx        # Public projects page
│   │   ├── Careers.tsx         # Public careers page
│   │   ├── AdminLogin.tsx      # Admin login
│   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   ├── AdminProjects.tsx   # Manage projects
│   │   └── AdminJobs.tsx       # Manage jobs
│   ├── App.tsx                 # Route configuration
│   └── ...
└── .env.example
```

## 🔧 API Endpoints

### Public Endpoints:
```
GET    /api/projects              # Get all projects
GET    /api/projects/:slug        # Get single project
GET    /api/jobs                  # Get published jobs
GET    /api/jobs/:id              # Get single job
POST   /api/contact               # Contact form
```

### Protected Endpoints (Require JWT Token):
```
POST   /api/auth/login            # Admin login
POST   /api/projects              # Create project
PUT    /api/projects/:id          # Update project
DELETE /api/projects/:id          # Delete project
POST   /api/jobs                  # Create job
PUT    /api/jobs/:id              # Update job
DELETE /api/jobs/:id              # Delete job
```

## 🚀 Deployment

### Backend Deployment (cPanel/Shared Hosting):

1. **Upload Files**:
   - Upload `server` folder to your hosting
   - Install Node.js via cPanel (if available)

2. **Setup Environment**:
   - Create `.env` file with production settings
   - Update DATABASE_URL with production credentials
   - Update CORS_ORIGIN to your frontend URL

3. **Install & Build**:
   ```bash
   npm install --production
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   ```

4. **Start Server**:
   - Use Node.js app manager in cPanel
   - Or use PM2: `pm2 start src/index.js --name wealth-backend`

### Frontend Deployment:

1. **Build Production**:
   ```bash
   npm run build
   ```

2. **Update Environment**:
   - Update `VITE_API_URL` in `.env` to production API URL

3. **Deploy**:
   - Upload `dist` folder contents to your hosting public_html
   - Configure web server to handle SPA routes

## 📝 Common Tasks

### Add New Admin User:
```javascript
// Run in Prisma Studio or directly in database
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('newpassword', 10);

// Insert into Admin table:
{
  email: 'newadmin@email.com',
  password: hashedPassword,
  name: 'Admin Name'
}
```

### Backup Database:
```bash
# Via phpMyAdmin: Export tab -> Export
# Or via command line:
mysqldump -u username -p database_name > backup.sql
```

### Restore Database:
```bash
mysql -u username -p database_name < backup.sql
```

## 🐛 Troubleshooting

### "Cannot connect to database":
- Check DATABASE_URL is correct
- Verify MySQL user has proper privileges
- Check firewall allows connections to MySQL port

### "CORS Error":
- Update CORS_ORIGIN in backend `.env`
- Ensure frontend URL is whitelisted

### "Prisma Client not found":
- Run `npx prisma generate` in server folder

### "Admin cannot login":
- Verify admin exists: `npx prisma studio`
- Re-run seed: `node prisma/seed.js`

## 📞 Support

For issues or questions:
1. Check database connection in cPanel
2. Verify environment variables are set correctly
3. Check browser console for frontend errors
4. Check server logs for backend errors

## 🔒 Security Best Practices

1. **Change default admin credentials immediately**
2. **Use strong JWT_SECRET** (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Use HTTPS in production**
4. **Keep dependencies updated**: `npm audit fix`
5. **Don't commit `.env` files**
6. **Restrict database user permissions** to only needed operations
