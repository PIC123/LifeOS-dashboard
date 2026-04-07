# GitHub Repository Setup

## 🎯 Quick Setup (When You're Home)

Since GitHub CLI doesn't have repo creation permissions, here's the manual setup:

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. **Repository name**: `lifeos-dashboard`
3. **Description**: `Personal command center dashboard with task management, calendar integration, and PARA system`
4. **Public** repository
5. **Don't** initialize with README (we already have code)
6. Click "Create repository"

### 2. Connect Local Repository
```bash
cd lifeos-dashboard

# Add the GitHub remote (replace YOUR_USERNAME)
git remote set-url origin https://github.com/YOUR_USERNAME/lifeos-dashboard.git

# Push all our commits to GitHub
git push -u origin main
```

### 3. Set up Vercel Auto-Deploy
1. Go to https://vercel.com/dashboard
2. Import the GitHub repository
3. Connect `lifeos-dashboard` repo
4. Enable auto-deploy on push to main branch

## 📊 Current Commit History
We have **15+ commits** ready to push:
- Initial project setup
- Task management system
- Calendar integration
- Unified dashboard refactor
- TypeScript fixes
- Deployment optimizations

## 🔄 Future Workflow
Once GitHub is connected:
```bash
# Make changes
git add .
git commit -m "Feature: description"
git push origin main

# Vercel auto-deploys from GitHub
# Dashboard updates automatically
```

## 🎯 Benefits
- **Version history** - Track all changes
- **Collaboration** - Easy sharing and contributions  
- **Backup** - Code safely stored on GitHub
- **Auto-deploy** - Push to GitHub → Vercel deploys automatically
- **Issue tracking** - GitHub Issues for feature requests/bugs