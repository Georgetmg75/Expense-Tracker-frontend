// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import {
  logo,
  heading,
  subtext,
  button,
  link
} from '../styles/landingStyles';

export default function Landing() {
  // SAFE IMAGE FALLBACK
  const heroUrl = '/hero.jpg';
  const logoUrl = '/logo.jpg';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* HERO BACKGROUND WITH FALLBACK */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-gray-200"
        style={{
          backgroundImage: `url(${heroUrl})`,
          backgroundColor: '#1a1a1a' // fallback dark
        }}
        onError={(e) => {
          e.currentTarget.style.backgroundImage = 'none';
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          console.warn('hero.jpg failed to load — using fallback');
        }}
      />

      {/* BLACK TINT */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 min-h-screen">
        {/* LOGO WITH FALLBACK */}
        <img
          src={logoUrl}
          alt="Expense Tracker Logo"
          className={`${logo} mx-auto mb-6 w-24 h-24 object-contain`}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3Jn/LzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjNGFhZjUwIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0YWFmNTAiPkVUPC90ZXh0Pjwvc3ZnPg==';
            console.warn('logo.jpg failed — using SVG fallback');
          }}
        />

        <h1 className={`${heading} text-4xl sm:text-5xl font-bold mb-4`}>
          Expense Tracker
        </h1>
        <p className={`${subtext} text-lg sm:text-xl max-w-2xl`}>
          Track income, crush expenses, build wealth — all in one place.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
          <Link
            to="/register"
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg transition shadow-lg"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black font-bold text-lg rounded-lg transition"
          >
            Log In
          </Link>
        </div>

        {/* FOOTER TAGLINE */}
        <p className="mt-16 text-sm opacity-80">
          🚀 Built for financial freedom • 100% secure • No ads
        </p>
      </div>
    </div>
  );
}