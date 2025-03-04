import React from 'react';
import { motion } from 'framer-motion';
import { useHotel } from '../context/HotelContext';
import { Hotel, Users, Calendar, DollarSign, Percent } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { rooms, guests, bookings } = useHotel();
  
  // Calculate statistics
  const availableRooms = rooms.filter(room => room.available).length;
  const occupancyRate = rooms.length > 0 ? ((rooms.length - availableRooms) / rooms.length) * 100 : 0;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pendingPayments = bookings
    .filter(booking => booking.paymentStatus === 'Pending')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const statCards = [
    {
      title: 'Available Rooms',
      value: availableRooms,
      total: rooms.length,
      icon: <Hotel className="text-blue-500" size={24} />,
      color: 'bg-blue-100',
    },
    {
      title: 'Total Guests',
      value: guests.length,
      icon: <Users className="text-green-500" size={24} />,
      color: 'bg-green-100',
    },
    {
      title: 'Active Bookings',
      value: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length,
      icon: <Calendar className="text-purple-500" size={24} />,
      color: 'bg-purple-100',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="text-yellow-500" size={24} />,
      color: 'bg-yellow-100',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate.toFixed(1)}%`,
      icon: <Percent className="text-red-500" size={24} />,
      color: 'bg-red-100',
    },
    {
      title: 'Pending Payments',
      value: `$${pendingPayments.toLocaleString()}`,
      icon: <DollarSign className="text-orange-500" size={24} />,
      color: 'bg-orange-100',
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            className={`${card.color} rounded-lg shadow-md p-6`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
                {card.total && (
                  <p className="text-sm text-gray-500 mt-1">of {card.total} total</p>
                )}
              </div>
              <div className="p-3 rounded-full bg-white shadow-sm">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => {
                  const guest = guests.find(g => g.id === booking.guestId);
                  const room = rooms.find(r => r.id === booking.roomId);
                  
                  return (
                    <tr key={booking.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {guest?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {room?.number || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {booking.checkIn}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'Checked Out' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Room Availability</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg ${
                  room.available ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <p className="font-bold">{room.number}</p>
                <p className="text-sm">{room.type}</p>
                <p className={`text-sm font-medium ${
                  room.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {room.available ? 'Available' : 'Occupied'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;