import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { HotelProvider } from "./context/HotelContext";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

// Lazy load components
const Dashboard = lazy(() => import("./components/Dashboard"));
const RoomList = lazy(() => import("./components/RoomList"));
const GuestList = lazy(() => import("./components/GuestList"));
const BookingList = lazy(() => import("./components/BookingList"));
const StaffList = lazy(() => import("./components/StaffList"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

// Authentication check
const isAuthenticated = () => localStorage.getItem("auth") === "true";

// Protected route component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// Page transition settings (120 FPS optimized)
const pageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

// Floating particles animation
const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <HotelProvider>
      <Router>
        <div className={`relative min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
          {/* Background Floating Particles */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />

          <Navbar />
          <div className="relative md:ml-64 min-h-screen p-5">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="absolute top-5 right-5 p-3 bg-gray-800 text-white rounded-full shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? "☀️" : "🌙"}
            </motion.button>

            {/* Animated Page Wrapper */}
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                  <Route path="/rooms" element={<ProtectedRoute element={<RoomList />} />} />
                  <Route path="/guests" element={<ProtectedRoute element={<GuestList />} />} />
                  <Route path="/bookings" element={<ProtectedRoute element={<BookingList />} />} />
                  <Route path="/staff" element={<ProtectedRoute element={<StaffList />} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </Suspense>
            </motion.div>

            {/* Welcome Section with Animated Buttons */}
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold tracking-wide">
                Welcome to <motion.span className="text-blue-500">Hotel Management</motion.span>
              </h1>

              <div className="flex justify-center gap-6 mt-6">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
                  >
                    Login
                  </motion.button>
                </Link>

                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
                  >
                    Signup
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Floating Particles */}
            <motion.div
              className="absolute bottom-10 left-10 w-12 h-12 bg-blue-500 rounded-full opacity-50"
              variants={floatingVariants}
              animate="animate"
            />
            <motion.div
              className="absolute bottom-20 right-10 w-10 h-10 bg-purple-500 rounded-full opacity-50"
              variants={floatingVariants}
              animate="animate"
            />
            <motion.div
              className="absolute top-10 left-20 w-14 h-14 bg-pink-500 rounded-full opacity-50"
              variants={floatingVariants}
              animate="animate"
            />
          </div>
        </div>
      </Router>
    </HotelProvider>
  );
}

export default App;