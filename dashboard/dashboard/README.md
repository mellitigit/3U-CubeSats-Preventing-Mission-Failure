# 🛰️ CubeSat Space Monitoring Dashboard

A modern, interactive dashboard for monitoring the health and activities of a CubeSat satellite, built with Next.js 14, Tailwind CSS, and React.

![Dashboard Screenshot](https://user-images.githubusercontent.com/your-screenshot.png)

---

## 🚀 Features

- **3D Interactive Earth Globe**: Visualize satellite trajectories in real time
- **Floating CubeSat Animation**: See your satellite orbiting the Earth
- **Live Telemetry & Status**: Satisfaction rate, delivery stats, weather, and more
- **Activities Table**: Track cargo, destinations, and status
- **Responsive Design**: Works beautifully on desktop and mobile
- **Dark Space Theme**: Futuristic, elegant, and easy on the eyes

---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React](https://react.dev/)
- [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- [Three.js](https://threejs.org/)

---

## 📦 Project Structure

```
src/
  app/
    globals.css         # Global styles
    layout.tsx          # App layout
    page.tsx            # Main dashboard page
  components/
    dashboard/
      world-map.tsx     # 3D Earth and trajectories
      CubeSatFloating.tsx # Animated CubeSat
      activities-table.tsx # Activities table
      satisfaction-rate.tsx # Stats widgets
    ui/
      # (Reusable UI components)
```

---

## 🏁 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
3. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

---

## ✨ Customization

- Add more telemetry widgets in `components/dashboard/`
- Change the CubeSat animation in `CubeSatFloating.tsx`
- Update theme colors in `globals.css` and `tailwind.config.ts`

---

## 📚 Challenge Context

This dashboard is designed for the IEEE IES & AESS Technical Challenge:
> "Créer un système électronique intelligent pour un CubeSat qui peut se réparer tout seul lorsqu'un problème se produit, sans intervention depuis la Terre."

- Monitor satellite health, detect anomalies, and visualize autonomous actions
- Document your solution and share on GitHub

---

## 🧑‍💻 Authors & Credits

- [Your Name] (replace with your team)
- Inspired by NASA, IEEE, and the open-source community

---

## 📄 License

MIT

---

## 📬 Contact

For questions or support:
- ies@ieee.tn
- aess@ieee.tn
