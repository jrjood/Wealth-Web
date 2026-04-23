# 🏢 Wealth Holding Premium Realty

A modern, full-stack real estate website with dynamic content management, admin dashboard, and MySQL database integration.

## ✨ Features

- 🎨 Modern, responsive UI with React & TypeScript
- 🔐 Secure admin dashboard with JWT authentication
- 📊 Dynamic content management for Projects and Jobs
- 🗄️ MySQL database with Prisma ORM
- 🐳 **Fully containerized with Docker**
- 🎯 RESTful API with Express.js
- 🚀 Production-ready deployment

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)

### One-Command Setup

**Windows:**
```bash
docker-start.bat
```

**Mac/Linux:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

That's it! The application will be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Dashboard**: http://localhost:5173/admin/login

**Default Admin Credentials:**
- Email: `admin@wealthholding.com`
- Password: `changeme123`

### Docker Commands

```bash
# Start everything
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

📚 **[Complete Docker Guide](DOCKER_GUIDE.md)**

## 📚 Documentation

- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Complete Docker documentation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Manual setup with cPanel/MySQL
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheat sheet
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Feature overview

## 🎯 What's Dynamic

### ✅ Database-Driven Content
- **Projects**: All real estate projects (managed via admin dashboard)
- **Jobs/Careers**: All job openings (managed via admin dashboard)

### Admin Features
- Create, edit, delete projects
- Create, edit, delete job openings
- Mark projects as featured
- Publish/unpublish jobs

## 🎨 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Framer Motion for animations
- Shadcn/ui component library

### Backend
- Node.js with Express.js
- Prisma ORM
- MySQL 8.0 database
- JWT authentication

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Nginx (production)

## 🐛 Troubleshooting

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Full reset
docker-compose down -v
docker-compose up --build
```

## 💡 Quick Tips

- Use Docker for easiest setup
- Access admin at /admin/login
- Use Prisma Studio: `docker-compose exec backend npx prisma studio`
- Check logs when troubleshooting
- Backup database before major changes

---

**Built with ❤️ for Wealth Holding Premium Realty**

🐳 **Docker makes it simple - just run and go!**


This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
