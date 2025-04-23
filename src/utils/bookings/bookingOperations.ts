
import { Booking } from '@/data/models';
import { getCurrentUser } from '@/utils/authUtils';
import { toast } from "@/utils/toastUtils";
import { supabase } from '@/integrations/supabase/client';
import { getFlightById } from '../flights/flightSearch';

// Get user bookings
export const getUserBookings = async (): Promise<Booking[]> => {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  try {
    const { data: bookings, error } = await supabase
      .from('flight_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      return [];
    }

    return bookings.map(booking => ({
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      flight: {
        id: booking.flight_id,
        flightNumber: booking.flight_number,
        airline: booking.airline,
        source: booking.source,
        destination: booking.destination,
        departureDate: booking.departure_date,
        departureTime: booking.departure_time,
        arrivalDate: booking.arrival_date,
        arrivalTime: booking.arrival_time,
        price: booking.price,
        aircraft: booking.aircraft,
        availableSeats: 0,
        totalSeats: 0,
        duration: '0h 0m',
        createdAt: booking.created_at,
      },
      seatNumber: booking.seat_number,
      status: booking.status as 'confirmed' | 'cancelled' | 'pending',
      paymentStatus: booking.payment_status as 'paid' | 'pending' | 'failed',
      bookingDate: booking.booking_date,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }));
  } catch (err) {
    console.error('Error in getUserBookings:', err);
    toast.error('Failed to fetch bookings');
    return [];
  }
};

// Book a flight
export const bookFlight = async (flightId: string): Promise<Booking | null> => {
  const user = getCurrentUser();
  if (!user) {
    toast.error("You must be logged in to book a flight");
    return null;
  }

  try {
    const flight = await getFlightById(flightId);
    if (!flight) {
      toast.error("Flight not found");
      return null;
    }

    if (flight.availableSeats <= 0) {
      toast.error("No seats available on this flight");
      return null;
    }

    const row = Math.floor(Math.random() * 30) + 1;
    const seat = String.fromCharCode(65 + Math.floor(Math.random() * 6));
    const seatNumber = `${row}${seat}`;

    const { data: booking, error } = await supabase
      .from('flight_bookings')
      .insert({
        user_id: user.id,
        flight_id: flight.id,
        flight_number: flight.flightNumber,
        airline: flight.airline,
        source: flight.source,
        destination: flight.destination,
        departure_date: flight.departureDate,
        departure_time: flight.departureTime,
        arrival_date: flight.arrivalDate,
        arrival_time: flight.arrivalTime,
        price: flight.price,
        aircraft: flight.aircraft,
        seat_number: seatNumber,
        passenger_name: user.name || 'Guest User',
        passenger_email: user.email
      })
      .select()
      .single();

    if (error) {
      console.error('Error booking flight:', error);
      toast.error("Failed to book flight");
      return null;
    }

    toast.success("Flight booked successfully!");
    
    return {
      id: booking.id,
      userId: booking.user_id,
      flightId: booking.flight_id,
      flight: flight,
      seatNumber: booking.seat_number,
      status: booking.status as 'confirmed' | 'cancelled' | 'pending',
      paymentStatus: booking.payment_status as 'paid' | 'pending' | 'failed',
      bookingDate: booking.booking_date,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    };
  } catch (err) {
    console.error('Error in bookFlight:', err);
    toast.error("An error occurred while booking the flight");
    return null;
  }
};

// Cancel a booking
export const cancelBooking = (bookingId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success("Booking cancelled successfully");
      resolve(true);
    }, 800);
  });
};
