
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarClock, Plane, Clock, MapPin, CreditCard, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { getFlightById, bookFlight } from '@/utils/flightUtils';
import { isLoggedIn } from '@/utils/authUtils';
import { Flight, Booking } from '@/data/models';

const BookingPage = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        if (!flightId) {
          setError('Flight ID is missing');
          setLoading(false);
          return;
        }

        const flightData = await getFlightById(flightId);
        if (!flightData) {
          setError('Flight not found');
        } else {
          setFlight(flightData);
        }
      } catch (err) {
        console.error('Error fetching flight:', err);
        setError('Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId]);

  const handleBookFlight = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (!flightId) return;

    setBookingLoading(true);
    try {
      const bookingResult = await bookFlight(flightId);
      if (bookingResult) {
        setBooking(bookingResult);
      } else {
        setError('Failed to book the flight. Please try again.');
      }
    } catch (err) {
      console.error('Error booking flight:', err);
      setError('An error occurred while booking the flight');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airline-600"></div>
        <p className="mt-4 text-gray-600">Loading flight details...</p>
      </div>
    );
  }

  if (error && !flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (booking) {
    // Show booking confirmation
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your booking has been successfully processed.
            </p>
          </div>
          
          <Card className="border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                    <p className="text-gray-500 text-sm">Reference: {booking.id}</p>
                  </div>
                  <Button onClick={() => navigate('/bookings')} variant="outline">
                    View All Bookings
                  </Button>
                </div>
                
                <div className="md:col-span-3">
                  <div className="bg-airline-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane className="h-5 w-5 text-airline-600 mr-2" />
                      <span className="font-medium">{flight?.airline} · {flight?.flightNumber}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {flight?.departureDate} · Seat {booking.seatNumber}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">From</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-airline-600 mr-1" />
                    <span className="font-medium">{flight?.source}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{flight?.departureTime}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">To</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-airline-600 mr-1" />
                    <span className="font-medium">{flight?.destination}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{flight?.arrivalTime}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-airline-600 mr-1" />
                    <span className="font-medium">{flight?.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{flight?.aircraft}</p>
                </div>
                
                <div className="md:col-span-3 border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Price</h3>
                      <p className="text-2xl font-bold text-airline-700">{formatPrice(flight?.price || 0)}</p>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-1" />
                      <span className="font-medium">Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-4">
              A confirmation email has been sent to your email address.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-airline-600 hover:bg-airline-700"
            >
              Book Another Flight
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {flight && (
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 text-airline-600"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-airline-700 to-airline-900 text-white">
              <h1 className="text-2xl font-bold">Flight Details</h1>
              <div className="flex items-center mt-2">
                <CalendarClock className="h-5 w-5 mr-2" />
                <span>{flight.departureDate}</span>
              </div>
            </div>
            
            <div className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-airline-100 rounded-full mr-3">
                      <Plane className="h-6 w-6 text-airline-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">{flight.airline}</h2>
                      <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-airline-700">{formatPrice(flight.price)}</p>
                    <p className="text-sm text-gray-500">per passenger</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Departure</h3>
                      <p className="font-semibold text-lg">{flight.departureTime}</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600 text-sm">{flight.source}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="hidden md:block w-full relative">
                        <div className="border-t-2 border-dashed border-gray-300 absolute w-full top-1/2"></div>
                        <div className="absolute left-0 top-1/2 w-3 h-3 rounded-full bg-airline-600 transform -translate-y-1/2"></div>
                        <div className="absolute right-0 top-1/2 w-3 h-3 rounded-full bg-airline-600 transform -translate-y-1/2"></div>
                        <div className="text-xs text-gray-500 text-center mt-4">{flight.duration}</div>
                      </div>
                      <div className="md:hidden text-center">
                        <div className="h-8 border-l-2 border-dashed border-gray-300 mx-auto"></div>
                        <div className="text-xs text-gray-500 my-1">{flight.duration}</div>
                        <div className="h-8 border-l-2 border-dashed border-gray-300 mx-auto"></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Arrival</h3>
                      <p className="font-semibold text-lg">{flight.arrivalTime}</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600 text-sm">{flight.destination}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Flight Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight</span>
                    <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aircraft</span>
                    <span className="font-medium">{flight.aircraft}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Seats</span>
                    <span className="font-medium">{flight.availableSeats}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                    <span className="text-gray-600">Total Price</span>
                    <span className="text-xl font-bold text-airline-700">{formatPrice(flight.price)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleBookFlight}
                  className="w-full bg-airline-600 hover:bg-airline-700"
                  disabled={bookingLoading || flight.availableSeats <= 0}
                >
                  {bookingLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : flight.availableSeats <= 0 ? (
                    "Sold Out"
                  ) : (
                    <span className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Book Now
                    </span>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By clicking "Book Now", you agree to our Terms and Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
