import { Room, Guest, Booking, Staff } from './types';

export const rooms: Room[] = [
  {
    id: 1,
    number: '101',
    type: 'Standard',
    price: 100,
    capacity: 2,
    available: true,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    number: '102',
    type: 'Standard',
    price: 100,
    capacity: 2,
    available: false,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    number: '201',
    type: 'Deluxe',
    price: 200,
    capacity: 3,
    available: true,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    number: '301',
    type: 'Suite',
    price: 350,
    capacity: 4,
    available: true,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service', 'Jacuzzi', 'Kitchenette'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    number: '401',
    type: 'Presidential',
    price: 800,
    capacity: 6,
    available: true,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service', 'Jacuzzi', 'Kitchenette', 'Private Pool', 'Butler Service'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

export const guests: Guest[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    checkIn: '2025-06-01',
    checkOut: '2025-06-05',
    roomId: 2,
    totalAmount: 400,
    paymentStatus: 'Paid'
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 987-6543',
    checkIn: '2025-06-10',
    checkOut: '2025-06-15',
    roomId: 3,
    totalAmount: 1000,
    paymentStatus: 'Pending'
  }
];

export const bookings: Booking[] = [
  {
    id: 1,
    guestId: 1,
    roomId: 2,
    checkIn: '2025-06-01',
    checkOut: '2025-06-05',
    status: 'Confirmed',
    totalAmount: 400,
    paymentStatus: 'Paid',
    createdAt: '2025-05-15'
  },
  {
    id: 2,
    guestId: 2,
    roomId: 3,
    checkIn: '2025-06-10',
    checkOut: '2025-06-15',
    status: 'Confirmed',
    totalAmount: 1000,
    paymentStatus: 'Pending',
    createdAt: '2025-05-20'
  }
];

export const staff: Staff[] = [
  {
    id: 1,
    name: 'Michael Johnson',
    position: 'Manager',
    department: 'Administration',
    contactInfo: 'michael.johnson@hotel.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    position: 'Receptionist',
    department: 'Front Desk',
    contactInfo: 'sarah.williams@hotel.com',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Robert Brown',
    position: 'Chef',
    department: 'Food & Beverage',
    contactInfo: 'robert.brown@hotel.com',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Emily Davis',
    position: 'Housekeeper',
    department: 'Housekeeping',
    contactInfo: 'emily.davis@hotel.com',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];