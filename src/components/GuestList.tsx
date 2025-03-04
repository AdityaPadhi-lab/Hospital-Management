import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotel } from '../context/HotelContext';
import { Plus, Edit, Trash2, Search, X, User, Mail, Phone, Calendar, CreditCard } from 'lucide-react';

const GuestList: React.FC = () => {
  const { guests, rooms, addGuest, updateGuest, deleteGuest } = useHotel();
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newGuest, setNewGuest] = useState<Omit<Guest, 'id'>>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomId: 0,
    totalAmount: 0,
    paymentStatus: 'Pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGuest !== null) {
      const guestToUpdate = guests.find(g => g.id === editingGuest);
      if (guestToUpdate) {
        updateGuest({ ...guestToUpdate, ...newGuest });
      }
      setEditingGuest(null);
    } else {
      addGuest(newGuest);
    }
    
    setIsAddingGuest(false);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      roomId: 0,
      totalAmount: 0,
      paymentStatus: 'Pending'
    });
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest.id);
    setNewGuest({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      roomId: guest.roomId,
      totalAmount: guest.totalAmount,
      paymentStatus: guest.paymentStatus
    });
    setIsAddingGuest(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      deleteGuest(id);
    }
  };

  const calculateTotalAmount = () => {
    const selectedRoom = rooms.find(r => r.id === newGuest.roomId);
    if (!selectedRoom || !newGuest.checkIn || !newGuest.checkOut) return 0;
    
    const checkIn = new Date(newGuest.checkIn);
    const checkOut = new Date(newGuest.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return selectedRoom.price * nights;
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = Number(e.target.value);
    setNewGuest({ ...newGuest, roomId });
    
    // Auto-calculate total amount when room changes
    if (newGuest.checkIn && newGuest.checkOut) {
      const total = calculateTotalAmount();
      setNewGuest(prev => ({ ...prev, roomId, totalAmount: total }));
    }
  };

  const handleDateChange = () => {
    if (newGuest.checkIn && newGuest.checkOut && newGuest.roomId) {
      const total = calculateTotalAmount();
      setNewGuest(prev => ({ ...prev, totalAmount: total }));
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

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
          Guest Management
        </motion.h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingGuest(!isAddingGuest)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          >
            {isAddingGuest ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
            {isAddingGuest ? 'Cancel' : 'Add Guest'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isAddingGuest && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingGuest !== null ? 'Edit Guest' : 'Add New Guest'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="inline mr-1" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" /> Phone
                  </label>
                  <input
                    type="text"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <select
                    value={newGuest.roomId}
                    onChange={handleRoomChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.filter(room => room.available || (editingGuest !== null && room.id === newGuest.roomId)).map((room) => (
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
                    value={newGuest.checkIn}
                    onChange={(e) => {
                      setNewGuest({ ...newGuest, checkIn: e.target.value });
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
                    value={newGuest.checkOut}
                    onChange={(e) => {
                      setNewGuest({ ...newGuest, checkOut: e.target.value });
                      setTimeout(handleDateChange, 0);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CreditCard size={16} className="inline mr-1" /> Total Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newGuest.totalAmount}
                    onChange={(e) => setNewGuest({ ...newGuest, totalAmount: Number(e.target.value) })}
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
                    value={newGuest.paymentStatus}
                    onChange={(e) => setNewGuest({ ...newGuest, paymentStatus: e.target.value as any })}
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
                    setIsAddingGuest(false);
                    setEditingGuest(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {editingGuest !== null ? 'Update Guest' : 'Add Guest'}
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
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In/Out
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
              {filteredGuests.map((guest) => {
                const room = rooms.find(r => r.id === guest.roomId);
                
                return (
                  <motion.tr 
                    key={guest.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guest.email}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {room ? `Room ${room.number}` : 'Not assigned'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {room ? room.type : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">In: {guest.checkIn}</div>
                      <div className="text-sm text-gray-500">Out: {guest.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${guest.totalAmount}</div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        guest.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        guest.paymentStatus === 'Refunded' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {guest.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(guest)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(guest.id)}
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
        
        {filteredGuests.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No guests found. {searchTerm && 'Try a different search term or '} Add a new guest.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GuestList;