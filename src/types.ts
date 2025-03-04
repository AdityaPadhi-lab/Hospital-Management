export interface Room {
  id: number;
  number: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Presidential';
  price: number;
  capacity: number;
  available: boolean;
  amenities: string[];
  image: string;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomId: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
}

export interface Booking {
  id: number;
  guestId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: string;
}

export interface Staff {
  id: number;
  name: string;
  position: string;
  department: string;
  contactInfo: string;
  image: string;
}