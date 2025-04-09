
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
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
  duration: string;
  aircraft: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  flight: Flight;
  bookingDate: string;
  seatNumber: string;
  status: 'confirmed' | 'cancelled';
}

export interface City {
  code: string;
  name: string;
  country: string;
}
