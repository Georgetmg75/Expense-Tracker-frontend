import { Link } from 'react-router-dom';
import {
  logo,
  heading,
  subtext,
  button,
  link
} from '../styles/landingStyles';

export default function Landing() {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Black tint overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 min-h-screen">
        <img src="/logo.jpg" alt="Logo" className={`${logo} mx-auto mb-6`} />
        <h1 className={`${heading} text-white text-2xl sm:text-4xl font-bold mb-4`}>
          Welcome to Expense Tracker
        </h1>
        <p className={`${subtext} text-white text-base sm:text-lg max-w-xl mx-auto`}>
          Track your income, budget your spending, and stay financially empowered.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-xs sm:max-w-md">
          <Link
            to="/register"
            className={`${button} w-full px-4 py-3 text-base bg-green-500 hover:bg-green-600 text-white rounded text-center`}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className={`${link} w-full px-4 py-3 text-base text-white underline rounded text-center`}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
