# Instamart Ops Co-Pilot

A mobile-friendly internal web app for Swiggy Instamart's city operations teams to monitor red pods, view metrics, and get AI-powered recommendations. It is live at https://amar-co-pilot.netlify.app/

## 🎯 Features

### Dashboard (`/`)
- **City Overview**: View all cities with latest metrics
- **Status Indicators**: Green/Red pills based on threshold breaches
- **Quick Stats**: Total, Green, and Red pod counts per city
- **Navigation**: Click cities to view detailed pod analysis

### Pod Detail Page (`/pod/[podId]`)
- **Hourly Trends**: Historical metric data visualization (collapsible)
- **Current Metrics**: O2HAR (Mins) and Unserviceability with threshold indicators
- **Root Cause Analysis**: Auto-generated issues and causes
- **Recommendations**: Surge pricing and DE allocation suggestions

### AI Chat Assistant
- **Floating Chat**: 💬 button for instant access
- **PromptQL Integration**: Mock AI responses for operations queries
- **Chat History**: Persistent conversation tracking

### Alert Management (`/alerts`)
- **Custom Alerts**: Set thresholds for O2HAR and Unserviceability
- **Pod Selection**: Choose specific pods for monitoring
- **Alert Management**: Enable/disable and delete alerts
- **Local Storage**: Persistent alert configurations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - The app is optimized for mobile devices

## 📱 Mobile-First Design

- **Responsive Layout**: Optimized for mobile screens
- **Touch-Friendly**: Large buttons and touch targets
- **Fast Loading**: Efficient data loading and caching
- **Offline Ready**: Local storage for alerts and preferences
- **Dark Mode**: Toggle between light and dark themes

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PodCard.tsx     # Pod overview card
│   ├── CityCard.tsx    # City overview card
│   ├── ChatBot.tsx     # AI chat interface
│   ├── MetricsChart.tsx # Chart components
│   └── CollapsibleSection.tsx # Collapsible UI sections
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── PodDetail.tsx   # Individual pod analysis
│   ├── CityPods.tsx    # City-specific pod view
│   └── Alerts.tsx      # Alert management
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Helper functions and constants
│   ├── constants.ts    # App constants and thresholds
│   └── helpers.ts      # Data processing utilities
└── App.tsx             # Main app component
```

## 📊 Data Structure

### Pod Metrics
- **O2HAR**: Order to Hard Attempt Ratio in Minutes (threshold: 9.0 Mins)
- **Unserviceability**: Percentage of unserviceable orders (threshold: 5.0%)
- **Root Causes**: Array of identified issues
- **Recommendations**: Surge pricing and DE allocation suggestions

### Sample Data
Located in `public/data/pods.json` with realistic Instamart operations data for multiple cities.

## 🎨 Design System

### Colors
- **Instamart Green**: `#10B981` (success/healthy metrics)
- **Instamart Red**: `#EF4444` (breached thresholds)
- **Instamart Blue**: `#3B82F6` (primary actions)
- **Instamart Gray**: `#6B7280` (secondary elements)

### Components
- **Cards**: Clean, shadowed containers for content
- **Status Pills**: Color-coded indicators for pod health
- **Floating Actions**: Bottom-right positioned buttons
- **Responsive Grid**: Mobile-first layout system
- **Collapsible Sections**: Interactive content organization

## 🔧 Configuration

### Thresholds
Edit `src/utils/constants.ts` to modify:
- O2HAR threshold (default: 9.0 Mins)
- Unserviceability threshold (default: 5.0%)

### Mock AI Responses
Customize AI responses in `src/utils/helpers.ts`:
- Add more response variations
- Implement actual PromptQL API integration

## 🌐 Deployment & Sharing

### Option 1: GitHub Pages (Recommended for Demo)
1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[your-username]/instamart-ops-co-pilot.git
   git push -u origin main
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update homepage in package.json**
   Replace `[your-username]` with your actual GitHub username

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Share the URL**
   - Your app will be available at: `https://[your-username].github.io/instamart-ops-co-pilot`
   - Share this URL with anyone to test the app

### Option 2: Netlify (Free Hosting)
1. **Build the app**
   ```bash
   npm run build
   ```

2. **Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `build` folder to deploy
   - Get a shareable URL instantly

### Option 3: Vercel (Free Hosting)
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** and get a shareable URL

### Option 4: Local Network Sharing
1. **Start development server**
   ```bash
   npm start
   ```

2. **Find your IP address**
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

3. **Share the local URL**
   - `http://[your-ip]:3000`
   - Anyone on the same network can access it

## 📋 Testing Checklist

When sharing with testers, ask them to verify:

- [ ] **Dashboard loads** with city cards
- [ ] **Dark mode toggle** works across all pages
- [ ] **City navigation** shows pod details
- [ ] **Pod detail pages** display metrics correctly
- [ ] **Charts are collapsible** and show data
- [ ] **Chat bot** responds to questions
- [ ] **Alert setup** allows creating custom alerts
- [ ] **Mobile responsiveness** works on phones/tablets
- [ ] **O2HAR shows "Mins"** units throughout
- [ ] **Timestamps** show latest data

## 🐛 Troubleshooting

### Common Issues
- **npm not found**: Install Node.js from [nodejs.org](https://nodejs.org)
- **Build fails**: Clear cache with `npm run build -- --reset-cache`
- **Charts not loading**: Check if Chart.js dependencies are installed
- **Dark mode not persisting**: Clear browser cache and localStorage

### Support
For issues or questions, check the browser console for error messages and refer to the React/TypeScript documentation.

---

**Built with ❤️ for Swiggy Instamart Operations Teams** 
