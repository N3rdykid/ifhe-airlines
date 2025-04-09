
import { Flight, Booking } from '../data/models';
import { mockFlights, mockBookings } from '../data/mockData';
import { getCurrentUser } from './authUtils';
import { toast } from "@/components/ui/sonner";

// Get all flights
export const getFlights = (): Promise<Flight[]> => {
  return new Promise((resolve) => {
    // Mock API call - in a real app, this would call a backend API
    setTimeout(() => {
      resolve(mockFlights);
    }, 800);
  });
};

// Search flights by criteria
export const searchFlights = (source: string, destination: string, date: string): Promise<Flight[]> => {
  return new Promise((resolve) => {
    // Filter the mock flights based on search criteria
    setTimeout(() => {
      const filteredFlights = mockFlights.filter(flight => 
        (source ? flight.source === source : true) &&
        (destination ? flight.destination === destination : true) &&
        (date ? flight.departureDate === date : true)
      );
      resolve(filteredFlights);
    }, 800);
  });
};

// Get flight by ID
export const getFlightById = (id: string): Promise<Flight | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const flight = mockFlights.find(f => f.id === id);
      resolve(flight || null);
    }, 300);
  });
};

// Get user bookings
export const getUserBookings = (): Promise<Booking[]> => {
  return new Promise((resolve) => {
    const user = getCurrentUser();
    if (!user) {
      resolve([]);
      return;
    }
    
    setTimeout(() => {
      const bookings = mockBookings.filter(booking => booking.userId === user.id);
      resolve(bookings);
    }, 500);
  });
};

// Book a flight
export const bookFlight = (flightId: string): Promise<Booking | null> => {
  return new Promise((resolve) => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("You must be logged in to book a flight");
      resolve(null);
      return;
    }
    
    setTimeout(async () => {
      const flight = await getFlightById(flightId);
      if (!flight) {
        toast.error("Flight not found");
        resolve(null);
        return;
      }
      
      if (flight.availableSeats <= 0) {
        toast.error("No seats available on this flight");
        resolve(null);
        return;
      }
      
      // Generate a random seat number
      const row = Math.floor(Math.random() * 30) + 1;
      const seat = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A to F
      const seatNumber = `${row}${seat}`;
      
      // Create a new booking
      const newBooking: Booking = {
        id: `b${Date.now()}`,
        userId: user.id,
        flightId: flight.id,
        flight: flight,
        bookingDate: new Date().toISOString(),
        seatNumber,
        status: 'confirmed'
      };
      
      // In a real app, we would save this to a database
      // For now, let's just return it
      toast.success("Flight booked successfully!");
      resolve(newBooking);
    }, 1000);
  });
};

// Cancel a booking
export const cancelBooking = (bookingId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would update the database
      toast.success("Booking cancelled successfully");
      resolve(true);
    }, 800);
  });
};

// Add a new flight (admin only)
export const addFlight = (flight: Omit<Flight, 'id'>): Promise<Flight> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFlight: Flight = {
        ...flight,
        id: `${Date.now()}`
      };
      toast.success("Flight added successfully");
      resolve(newFlight);
    }, 800);
  });
};

// Update a flight (admin only)
export const updateFlight = (flight: Flight): Promise<Flight> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success("Flight updated successfully");
      resolve(flight);
    }, 800);
  });
};

// Delete a flight (admin only)
export const deleteFlight = (flightId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success("Flight deleted successfully");
      resolve(true);
    }, 800);
  });
};
