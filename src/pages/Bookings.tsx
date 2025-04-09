
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, Calendar, MapPin, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserBookings, cancelBooking } from '@/utils/flightUtils';
import { isLoggedIn } from '@/utils/authUtils';
import { Booking } from '@/data/models';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const userBookings = await getUserBookings();
        setBookings(userBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const success = await cancelBooking(bookingId);
      if (success) {
        // Update the bookings list
        setBookings(bookings.map(booking => {
          if (booking.id === bookingId) {
            return { ...booking, status: 'cancelled' };
          }
          return booking;
        }));
      } else {
        setError('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('An error occurred while cancelling the booking');
    } finally {
      setCancellingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airline-600"></div>
        <p className="mt-4 text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">View and manage all your flight bookings</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">You haven't made any flight bookings yet.</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-airline-600 hover:bg-airline-700"
            >
              <span className="flex items-center">
                Search Flights
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card 
                key={booking.id}
                className={`overflow-hidden ${booking.status === 'cancelled' ? 'border-gray-200 opacity-75' : 'border-airline-200'}`}
              >
                <div className={`px-4 py-2 ${booking.status === 'cancelled' ? 'bg-gray-100' : 'bg-airline-50'} flex justify-between items-center`}>
                  <div className="flex items-center">
                    <Plane className={`h-4 w-4 mr-2 ${booking.status === 'cancelled' ? 'text-gray-500' : 'text-airline-600'}`} />
                    <span className={`font-medium ${booking.status === 'cancelled' ? 'text-gray-600' : 'text-airline-700'}`}>
                      Booking #{booking.id}
                    </span>
                  </div>
                  <div className="text-sm">
                    {booking.status === 'confirmed' ? (
                      <span className="text-green-600 font-medium">Confirmed</span>
                    ) : (
                      <span className="text-gray-500 font-medium">Cancelled</span>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-gray-100 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Flight Date</h3>
                          <p className="font-medium">{booking.flight.departureDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                          <p className="font-medium">{booking.flight.duration}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">From</h3>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-airline-600 mr-1" />
                            <span className="font-medium">{booking.flight.source}</span>
                          </div>
                          <p className="text-gray-700">{booking.flight.departureTime}</p>
                        </div>
                        
                        <div className="hidden sm:block">
                          <div className="w-16 relative my-4">
                            <div className="border-t border-dashed border-gray-300 absolute w-full top-1/2"></div>
                            <Plane className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">To</h3>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-airline-600 mr-1" />
                            <span className="font-medium">{booking.flight.destination}</span>
                          </div>
                          <p className="text-gray-700">{booking.flight.arrivalTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-600 mr-2">Flight:</span>
                        <span className="font-medium">{booking.flight.airline} {booking.flight.flightNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Seat:</span>
                        <span className="font-medium">{booking.seatNumber}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex items-center">
                      <p className="font-bold text-lg text-airline-700 mr-4">
                        {formatPrice(booking.flight.price)}
                      </p>
                      {booking.status === 'confirmed' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={!!cancellingId}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {cancellingId === booking.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Cancelling...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
