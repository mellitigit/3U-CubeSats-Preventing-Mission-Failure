# 🛰️ CubeSat Mission Control Dashboard

A modern, real-time space monitoring dashboard built with Next.js 14, React, TypeScript, and Tailwind CSS. Features live telemetry, AI-powered self-repair systems, and stunning space visualizations.

## ✨ Features

### Core Functionality
- 🌍 **Interactive 3D Globe Visualization** - Real-time satellite tracking with orbital trajectories
- 📊 **Live Telemetry Monitoring** - Real-time data updates every 3 seconds
- 🤖 **AI Self-Repair Module** - Automated anomaly detection and system recovery
- 🛰️ **Mission Analytics** - Comprehensive mission statistics and performance metrics
- 📡 **Communication System** - Signal strength monitoring and connection status
- ⚡ **Power System (EPS)** - Battery level, solar panel output, and power consumption tracking
- 🌡️ **Thermal Management** - CPU, battery, and internal temperature monitoring
- 🎨 **Animated Space Background** - Beautiful cosmic visualization with stars and nebulae
- 📱 **Responsive Design** - Works seamlessly across all devices

### Performance Optimizations
- ⚡ **React.memo** - Optimized component re-renders
- 🎯 **useMemo & useCallback** - Memoized values and callbacks
- 🔄 **Custom Hooks** - Reusable logic for telemetry and state management
- 📦 **Code Splitting** - Dynamic imports for better load times
- 🎨 **Canvas Animations** - Hardware-accelerated space background
- 🧩 **Modular Architecture** - Clean separation of concerns

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router with Turbopack)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS v4
- **3D Visualization:** react-globe.gl, Three.js
- **State Management:** React Hooks
- **Animation:** CSS Animations, Canvas API
- **Performance:** React.memo, custom hooks, memoization

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Main dashboard page
│   │   └── globals.css         # Global styles & animations
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── world-map.tsx
│   │   │   ├── power-system.tsx
│   │   │   ├── thermal-system.tsx
│   │   │   ├── communication-system.tsx
│   │   │   ├── ai-repair-module.tsx
│   │   │   ├── mission-summary.tsx
│   │   │   ├── activities-table.tsx
│   │   │   └── satisfaction-rate.tsx
│   │   └── ui/                 # Reusable UI components
│   │       └── animated-space-background.tsx
│   ├── data/
│   │   └── cubesatData.ts      # Telemetry data generator
│   ├── hooks/
│   │   └── index.ts            # Custom React hooks
│   ├── lib/
│   │   ├── constants.ts        # App-wide constants
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── next.config.ts              # Next.js configuration
└── tsconfig.json               # TypeScript configuration
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/amelmediouni2001/iesXaess-dashboard.git
   cd iesXaess-dashboard/dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Components

### Telemetry Systems

#### Power System (EPS)
- Battery level percentage
- Solar panel output (W)
- Power consumption (W)
- Charging status (charging/discharging/idle)
- Net power calculation

#### Thermal System
- CPU temperature monitoring
- Battery temperature tracking
- Internal temperature measurement
- Status indicators (NOMINAL/WARNING/CRITICAL)

#### Communication System
- Signal strength (dBm)
- Uplink/Downlink status
- Connection quality bars
- Last contact timestamp

#### AI Self-Repair Module
- Real-time anomaly detection
- Repair status monitoring
- Confidence score (0-100%)
- Recent anomalies log with severity levels

#### Mission Summary
- Total mission time
- Anomaly statistics
- Repair success rate
- Orbital periods calculation

## 🎨 Customization

### Updating Telemetry Intervals

Edit `src/lib/constants.ts`:
```typescript
export const TELEMETRY_UPDATE_INTERVAL = 3000 // milliseconds
```

### Modifying Thresholds

Edit threshold values in `src/lib/constants.ts`:
```typescript
export const THERMAL_THRESHOLDS = {
  cpu: { warning: 50, critical: 60 },
  battery: { warning: 23, critical: 28 },
  internal: { warning: 25, critical: 30 },
}
```

### Changing Colors

Update color mappings in `src/lib/constants.ts` or modify the Tailwind theme in `tailwind.config.ts`.

## 🚀 Performance Tips

1. **Memoization** - All major components use `React.memo` for optimal re-rendering
2. **Custom Hooks** - Telemetry data management is centralized in hooks
3. **Constants** - Configuration values are stored separately for easy maintenance
4. **Utility Functions** - Reusable functions reduce code duplication
5. **Type Safety** - Full TypeScript coverage prevents runtime errors

## 📊 Data Flow

```
cubesatData.ts → Custom Hooks → Dashboard Components → UI
     ↓              ↓                   ↓              ↓
  Generator    useTelemetry()    PowerSystem     User Sees
  Functions    useTemperatures()  ThermalSystem   Live Data
                                  CommSystem
```

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of the IES (IEEE) initiative.

## 👥 Team

Developed by the IES Team for advanced satellite monitoring and mission control.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- react-globe.gl for 3D globe visualization
- Tailwind CSS for the utility-first styling
- Three.js for 3D graphics

---

**Built with ❤️ for space exploration**
