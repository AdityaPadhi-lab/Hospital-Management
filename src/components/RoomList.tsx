import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotel } from '../context/HotelContext';
import { Plus, Edit, Trash2, X, Check, Wifi, Tv, Wind, Wine, Mountain, Coffee, Bath, Utensils } from 'lucide-react';

const RoomList: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useHotel();
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    number: '',
    type: 'Standard',
    price: 100,
    capacity: 2,
    available: true,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  });

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
        return <Wifi size={16} />;
      case 'tv':
        return <Tv size={16} />;
      case 'air conditioning':
        return <Wind size={16} />;
      case 'mini bar':
        return <Wine size={16} />;
      case 'balcony':
        return <Mountain size={16} />;
      case 'room service':
        return <Coffee size={16} />;
      case 'jacuzzi':
        return <Bath size={16} />;
      case 'kitchenette':
        return <Utensils size={16} />;
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom !== null) {
      const roomToUpdate = rooms.find(r => r.id === editingRoom);
      if (roomToUpdate) {
        updateRoom({ ...roomToUpdate, ...newRoom });
      }
      setEditingRoom(null);
    } else {
      addRoom(newRoom);
    }
    setIsAddingRoom(false);
    setNewRoom({
      number: '',
      type: 'Standard',
      price: 100,
      capacity: 2,
      available: true,
      amenities: ['Wi-Fi', 'TV', 'Air Conditioning'],
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    });
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room.id);
    setNewRoom({
      number: room.number,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      available: room.available,
      amenities: room.amenities,
      image: room.image
    });
    setIsAddingRoom(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    if (newRoom.amenities.includes(amenity)) {
      setNewRoom({
        ...newRoom,
        amenities: newRoom.amenities.filter(a => a !== amenity)
      });
    } else {
      setNewRoom({
        ...newRoom,
        amenities: [...newRoom.amenities, amenity]
      });
    }
  };

  const filteredRooms = filter === 'all' 
    ? rooms 
    : filter === 'available' 
      ? rooms.filter(room => room.available) 
      : rooms.filter(room => !room.available);

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
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Rooms Management
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingRoom(!isAddingRoom)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          {isAddingRoom ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
          {isAddingRoom ? 'Cancel' : 'Add Room'}
        </motion.button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'occupied' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Occupied
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAddingRoom && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingRoom !== null ? 'Edit Room' : 'Add New Room'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={newRoom.number}
                    onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night ($)
                  </label>
                  <input
                    type="number"
                    value={newRoom.price}
                    onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={newRoom.available ? 'available' : 'occupied'}
                    onChange={(e) => setNewRoom({ ...newRoom, available: e.target.value === 'available' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newRoom.image}
                    onChange={(e) => setNewRoom({ ...newRoom, image: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service', 'Jacuzzi', 'Kitchenette'].map((amenity) => (
                    <div
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-2 border rounded-md cursor-pointer flex items-center ${
                        newRoom.amenities.includes(amenity)
                          ? 'bg-blue-100 border-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="mr-2">
                        {newRoom.amenities.includes(amenity) ? (
                          <Check size={16} className="text-blue-500" />
                        ) : null}
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingRoom(false);
                    setEditingRoom(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {editingRoom !== null ? 'Update Room' : 'Add Room'}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRooms.map((room) => (
          <motion.div
            key={room.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={room.image}
              alt={`Room ${room.number}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Room {room.number}</h3>
                  <p className="text-gray-600">{room.type}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    room.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {room.available ? 'Available' : 'Occupied'}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold text-blue-600">${room.price}<span className="text-sm text-gray-500">/night</span></p>
                <p className="text-gray-600">Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</p>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs"
                    >
                      <span className="mr-1">{getAmenityIcon(amenity)}</span>
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs">
                      +{room.amenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(room)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(room.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 p-8 rounded-lg text-center"
        >
          <p className="text-gray-600">No rooms found. {filter !== 'all' && 'Try changing the filter or '} Add a new room.</p>
        </motion.div>
      )}
    </div>
  );
};

export default RoomList;