import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room, Guest, Booking, Staff } from '../types';
import { rooms as initialRooms, guests as initialGuests, bookings as initialBookings, staff as initialStaff } from '../data';

interface HotelContextType {
  rooms: Room[];
  guests: Guest[];
  bookings: Booking[];
  staff: Staff[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: number) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (guest: Guest) => void;
  deleteGuest: (id: number) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: number) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: number) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};

interface HotelProviderProps {
  children: ReactNode;
}

export const HotelProvider: React.FC<HotelProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = {
      ...room,
      id: Math.max(0, ...rooms.map(r => r.id)) + 1
    };
    setRooms([...rooms, newRoom as Room]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
  };

  const deleteRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    const newGuest = {
      ...guest,
      id: Math.max(0, ...guests.map(g => g.id)) + 1
    };
    setGuests([...guests, newGuest as Guest]);
  };

  const updateGuest = (updatedGuest: Guest) => {
    setGuests(guests.map(guest => guest.id === updatedGuest.id ? updatedGuest : guest));
  };

  const deleteGuest = (id: number) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking = {
      ...booking,
      id: Math.max(0, ...bookings.map(b => b.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings([...bookings, newBooking as Booking]);
    
    // Update room availability
    const roomToUpdate = rooms.find(room => room.id === booking.roomId);
    if (roomToUpdate) {
      updateRoom({ ...roomToUpdate, available: false });
    }
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(bookings.map(booking => booking.id === updatedBooking.id ? updatedBooking : booking));
  };

  const deleteBooking = (id: number) => {
    const bookingToDelete = bookings.find(booking => booking.id === id);
    setBookings(bookings.filter(booking => booking.id !== id));
    
    // Update room availability if booking is deleted
    if (bookingToDelete) {
      const roomToUpdate = rooms.find(room => room.id === bookingToDelete.roomId);
      if (roomToUpdate) {
        updateRoom({ ...roomToUpdate, available: true });
      }
    }
  };

  const addStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newStaff = {
      ...staffMember,
      id: Math.max(0, ...staff.map(s => s.id)) + 1
    };
    setStaff([...staff, newStaff as Staff]);
  };

  const updateStaff = (updatedStaff: Staff) => {
    setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };

  const deleteStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const value = {
    rooms,
    guests,
    bookings,
    staff,
    addRoom,
    updateRoom,
    deleteRoom,
    addGuest,
    updateGuest,
    deleteGuest,
    addBooking,
    updateBooking,
    deleteBooking,
    addStaff,
    updateStaff,
    deleteStaff
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};