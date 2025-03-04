import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel, Users, Calendar, UserCog, Home, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <Home size={20} /> },
    { path: '/rooms', name: 'Rooms', icon: <Hotel size={20} /> },
    { path: '/guests', name: 'Guests', icon: <Users size={20} /> },
    { path: '/bookings', name: 'Bookings', icon: <Calendar size={20} /> },
    { path: '/staff', name: 'Staff', icon: <UserCog size={20} /> },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white h-screen fixed shadow-lg">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <Hotel className="mr-2" /> LuxeStay
          </h1>
        </div>
        <nav className="flex-1 pt-5">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center px-5 py-3 text-gray-700 relative ${
                    location.pathname === item.path ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-full bg-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-5 border-t">
          <p className="text-sm text-gray-500">© 2025 LuxeStay Hotel</p>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden fixed inset-0 bg-blue-600 z-40 flex flex-col items-center justify-center"
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <nav>
          <ul className="flex flex-col items-center space-y-6">
            {navItems.map((item) => (
              <motion.li
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="flex flex-col items-center text-white text-xl font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mb-1">{item.icon}</span>
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Content padding for desktop */}
      <div className="hidden md:block md:ml-64"></div>
    </>
  );
};

export default Navbar;