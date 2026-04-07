# DEPLOYMENT_WORKFLOW.md

## 🚀 Automated Deployment Pattern

**Trigger:** Successful coding agent completion
**Action:** Automatic Vercel deployment

### Standard Workflow:
```bash
# 1. Coding agent completes successfully
# 2. Commit changes with descriptive message
git add . && git commit -m "Agent completion: [feature description]"

# 3. Deploy to Vercel production
npx vercel --prod --yes

# 4. Update live URL status
# 5. Notify of successful deployment
```

### 🏗️ Build Requirements:
- ✅ All TypeScript errors resolved
- ✅ Next.js build passes
- ✅ React Suspense boundaries for client components using Next.js hooks
- ✅ Environment variables documented in .env.example

### 🔧 Common Build Fixes:
- **useSearchParams/useRouter:** Wrap in Suspense boundary
- **TypeScript strict mode:** Handle null/undefined properly  
- **API routes:** Proper error handling and types
- **Client components:** 'use client' directive at top

### 📍 Current Status:
- **Live URL:** https://lifeos-dashboard-psi.vercel.app
- **Last Deploy:** 2026-04-07 02:49 UTC
- **Features:** Daily tasks, Kanban board, OAuth calendar setup, mobile responsive

### 🎯 Next Deployments:
When coding agents complete work:
1. Review changes for build compatibility
2. Test critical paths locally if needed
3. Commit with clear messages
4. Deploy immediately to production
5. Update this workflow doc with new features