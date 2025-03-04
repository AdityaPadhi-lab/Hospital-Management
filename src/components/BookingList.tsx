import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotel } from '../context/HotelContext';
import { Plus, Edit, Trash2, Filter, X, Calendar, User, Hotel, CreditCard } from 'lucide-react';

const BookingList: React.FC = () => {
  const { bookings, guests, rooms, addBooking, updateBooking, deleteBooking } = useHotel();
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [editingBooking, setEditingBooking] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [newBooking, setNewBooking] = useState<Omit<Booking, 'id' | 'createdAt'>>({
    guestId: 0,
    roomId: 0,
    checkIn: '',
    checkOut: '',
    status: 'Confirmed',
    totalAmount: 0,
    paymentStatus: 'Pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBooking !== null) {
      const bookingToUpdate = bookings.find(b => b.id === editingBooking);
      if (bookingToUpdate) {
        updateBooking({ ...bookingToUpdate, ...newBooking });
      }
      setEditingBooking(null);
    } else {
      addBooking(newBooking);
    }
    
    setIsAddingBooking(false);
    setNewBooking({
      guestId: 0,
      roomId: 0,
      checkIn: '',
      checkOut: '',
      status: 'Confirmed',
      totalAmount: 0,
      paymentStatus: 'Pending'
    });
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking.id);
    setNewBooking({
      guestId: booking.guestId,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus
    });
    setIsAddingBooking(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(id);
    }
  };

  const calculateTotalAmount = () => {
    const selectedRoom = rooms.find(r => r.id === newBooking.roomId);
    if (!selectedRoom || !newBooking.checkIn || !newBooking.checkOut) return 0;
    
    const checkIn = new Date(newBooking.checkIn);
    const checkOut = new Date(newBooking.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return selectedRoom.price * nights;
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = Number(e.target.value);
    setNewBooking({ ...newBooking, roomId });
    
    // Auto-calculate total amount when room changes
    if (newBooking.checkIn && newBooking.checkOut) {
      const total = calculateTotalAmount();
      setNewBooking(prev => ({ ...prev, roomId, totalAmount: total }));
    }
  };

  const handleDateChange = () => {
    if (newBooking.checkIn && newBooking.checkOut && newBooking.roomId) {
      const total = calculateTotalAmount();
      setNewBooking(prev => ({ ...prev, totalAmount: total }));
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Booking Management
        </motion.h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-48"
            >
              <option value="all">All Bookings</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingBooking(!isAddingBooking)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          >
            {isAddingBooking ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
            {isAddingBooking ? 'Cancel' : 'Add Booking'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isAddingBooking && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingBooking !== null ? 'Edit Booking' : 'Add New Booking'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="inline mr-1" /> Guest
                  </label>
                  <select
                    value={newBooking.guestId}
                    onChange={(e) => setNewBooking({ ...newBooking, guestId: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a guest</option>
                    {guests.map((guest) => (
                      <option key={guest.id} value={guest.id}>
                        {guest.name} ({guest.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Hotel size={16} className="inline mr-1" /> Room
                  </label>
                  <select
                    value={newBooking.roomId}
                    onChange={handleRoomChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.filter(room => room.available || (editingBooking !== null && room.id === newBooking.roomId)).map((room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.number} - {room.type} (${room.price}/night)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" /> Check In Date
                  </label>
                  <input
                    type="date"
                    value={newBooking.checkIn}
                    onChange={(e) => {
                      setNewBooking({ ...newBooking, checkIn: e.target.value });
                      setTimeout(handleDateChange, 0);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" /> Check Out Date
                  </label>
                  <input
                    type="date"
                    value={newBooking.checkOut}
                    onChange={(e) => {
                      setNewBooking({ ...newBooking, checkOut: e.target.value });
                      setTimeout(handleDateChange, 0);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Status
                  </label>
                  <select
                    value={newBooking.status}
                    onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CreditCard size={16} className="inline mr-1" /> Total Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newBooking.totalAmount}
                    onChange={(e) => setNewBooking({ ...newBooking, totalAmount: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newBooking.paymentStatus}
                    onChange={(e) => setNewBooking({ ...newBooking, paymentStatus: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBooking(false);
                    setEditingBooking(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {editingBooking !== null ? 'Update Booking' : 'Add Booking'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const guest = guests.find(g => g.id === booking.guestId);
                const room = rooms.find(r => r.id === booking.roomId);
                
                return (
                  <motion.tr 
                    key={booking.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                      <div className="text-xs text-gray-500">{booking.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {guest ? guest.name : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest ? guest.email : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {room ? `Room ${room.number}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {room ? room.type : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">In: {booking.checkIn}</div>
                      <div className="text-sm text-gray-500">Out: {booking.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Checked Out' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${booking.totalAmount}</div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        booking.paymentStatus === 'Refunded' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(booking)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No bookings found. {statusFilter !== 'all' && 'Try changing the filter or '} Add a new booking.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingList;