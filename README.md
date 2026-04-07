# LifeOS Dashboard v2.1

A unified personal command center built with Next.js, TypeScript, and Tailwind CSS. Features a retro-futuristic interface inspired by cassette futurism and 80s sci-fi aesthetics.

## 🚀 Features

### Unified Dashboard Architecture
- **Single-page design** with smooth view transitions
- **Smart view switching** between Today Focus, Projects, Calendar, and Tasks
- **Responsive sidebar** with collapsible navigation
- **Real-time stats** and progress tracking

### Core Views
- **Today Focus** - Daily command center with task prioritization
- **Projects View** - PARA system integration with visual project cards
- **Enhanced Kanban** - Multi-mode kanban board (status, priority, project)
- **Calendar View** - Interactive calendar with task scheduling
- **Task Management** - Complete task overview with advanced filtering

### Task System
- **Smart prioritization** with energy levels and contexts
- **Due date tracking** with overdue alerts
- **Project assignment** using PARA methodology
- **Rich metadata** (tags, time estimates, recurring patterns)

### Integrations
- **Google Calendar** OAuth integration for events and reminders
- **PARA System** Projects, Areas, Resources, and Archives
- **Local storage** with optional cloud sync

### Modern UX
- **Smooth animations** with Framer Motion
- **Progressive enhancement** with proper loading states
- **Mobile responsive** design
- **Accessibility focused** with proper ARIA labels

## 🎨 Design Philosophy

Inspired by modern dashboard UX from [21st.dev](https://21st.dev/home) and [Pretext](https://github.com/chenglou/pretext):
- Clean typography hierarchy
- Subtle gradients and glass morphism
- Consistent spacing and rhythm
- Terminal/command aesthetic with modern polish

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Add your Google Calendar API credentials and other config
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)** - you'll be redirected to `/dashboard`

## 📁 Project Structure

```
lifeos-dashboard/
├── app/
│   ├── dashboard/          # Unified dashboard page
│   └── page.tsx           # Redirect to dashboard
├── components/
│   ├── dashboard/         # New unified dashboard components
│   │   ├── views/         # View components (Today, Projects, etc.)
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardStats.tsx
│   │   └── EnhancedKanbanBoard.tsx
│   └── Tasks/             # Original task components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
└── types/                 # TypeScript definitions
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **State**: React hooks with localStorage persistence
- **Calendar**: Google Calendar API integration

## 🌟 Key Improvements in v2.1

1. **Fixed Kanban Board** - Completely rebuilt with proper column management
2. **Unified Architecture** - Single page with view toggles instead of separate routes
3. **Better Performance** - Optimized components with proper lazy loading
4. **Enhanced UX** - Smooth transitions and contextual controls
5. **Modern Design** - Inspired by 21st.dev and Pretext examples
6. **Mobile First** - Responsive design that works on all devices

## 🎯 View Modes

### Today Focus
- Daily task prioritization
- Time estimation and tracking
- Overdue task alerts
- Calendar event integration

### Projects View
- Visual PARA project cards
- Project progress tracking
- Task assignment and management
- Grid/List/Kanban viewing modes

### Enhanced Kanban
- Multiple board views (status, priority, project)
- Drag-and-drop task management
- Column customization
- Visual progress indicators

### Calendar View
- Monthly calendar with task overlay
- Event integration
- Quick task scheduling
- Date-based task filtering

## 🔮 Optional Deep Pages

The original separate pages are still available for deep exploration:
- `/calendar` - Detailed calendar interface
- `/tasks` - Advanced task management

## ⚙️ Configuration

The dashboard includes a comprehensive settings panel:
- Theme customization
- Notification preferences
- Sync settings
- Privacy controls
- Time/date format options

## 🚦 Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Responsive Design

The dashboard is fully responsive and works seamlessly on:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (320px - 768px)

## 🎨 Customization

The dashboard uses CSS custom properties for easy theming. Key color variables are defined in `tailwind.config.js`:
- `command-background`
- `command-primary`
- `command-secondary`
- `command-accent`
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details