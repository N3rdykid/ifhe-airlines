
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  duration: string;
  aircraft: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  flight: Flight;
  seatNumber: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

export interface City {
  code: string;
  name: string;
  country: string;
}

export interface FlightSeat {
  id: string;
  flightId: string;
  seatNumber: string;
  isBooked: boolean;
}

export interface AdminAction {
  id: string;
  adminId: string;
  actionType: string;
  flightId?: string;
  timestamp: string;
}
