
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPin, Plane, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/data/mockData';
import { searchFlights } from '@/utils/flightUtils';
import { Flight } from '@/data/models';

const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!source || !destination || !date) {
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchFlights(source, destination, date);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handleBookFlight = (flightId: string) => {
    navigate(`/booking/${flightId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-airline-800 to-airline-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Explore the World with SkyWay
            </h1>
            <p className="text-xl text-airline-200 mb-8">
              Book your flights easily, travel comfortably, create unforgettable memories.
            </p>
            <div className="bg-white rounded-xl shadow-lg p-6 text-left text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger className="w-full" id="source">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.code} value={city.code}>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-airline-600" />
                            <span>{city.name} ({city.code})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="w-full" id="destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.code} value={city.code} disabled={city.code === source}>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-airline-600" />
                            <span>{city.name} ({city.code})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input pl-9"
                    />
                    <CalendarIcon className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch} 
                    disabled={!source || !destination || !date || isSearching}
                    className="w-full bg-airline-600 hover:bg-airline-700"
                  >
                    {isSearching ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Search className="mr-2 h-4 w-4" />
                        Search Flights
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} flights from ${source} to ${destination}`
                : `No flights found from ${source} to ${destination}`}
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="grid gap-6">
                {searchResults.map((flight) => (
                  <div key={flight.id} className="flight-card">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="p-3 bg-airline-100 rounded-full mr-4">
                          <Plane className="h-6 w-6 text-airline-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{flight.airline} · {flight.flightNumber}</h3>
                          <p className="text-sm text-gray-500">{flight.aircraft}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-1 justify-center mx-4 my-4 md:my-0">
                        <div className="text-center">
                          <p className="font-medium">{flight.departureTime}</p>
                          <p className="text-xs text-gray-500">{source}</p>
                        </div>
                        
                        <div className="mx-4 flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                          <div className="relative w-20 md:w-40">
                            <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                            <div className="absolute -left-1 top-1/2 w-2 h-2 rounded-full bg-gray-500 transform -translate-y-1/2"></div>
                            <div className="absolute -right-1 top-1/2 w-2 h-2 rounded-full bg-gray-500 transform -translate-y-1/2"></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Direct</div>
                        </div>
                        
                        <div className="text-center">
                          <p className="font-medium">{flight.arrivalTime}</p>
                          <p className="text-xs text-gray-500">{destination}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end w-full md:w-auto">
                        <p className="text-2xl font-bold text-airline-700 mb-2">{formatPrice(flight.price)}</p>
                        <p className="text-sm text-gray-500 mb-3">{flight.availableSeats} seats left</p>
                        <Button 
                          onClick={() => handleBookFlight(flight.id)} 
                          className="bg-airline-600 hover:bg-airline-700 w-full md:w-auto"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-500 mb-6">Try different dates or destinations</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSource('');
                    setDestination('');
                    setDate('');
                    setHasSearched(false);
                  }}
                >
                  Reset Search
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Destinations */}
      {!hasSearched && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
              <p className="mt-4 text-lg text-gray-600">Discover our most popular flight routes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    alt="New York"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">New York</h3>
                    <p className="text-sm opacity-90">United States</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <Plane className="h-4 w-4 text-airline-600 mr-1" />
                      <span className="text-sm text-gray-600">Multiple Airlines</span>
                    </div>
                    <span className="text-sm font-semibold text-airline-700">from $299</span>
                  </div>
                  <Button variant="outline" className="w-full border-airline-200 text-airline-700 hover:bg-airline-50" onClick={() => {
                    setSource('JFK');
                    setDestination('LAX');
                    setDate('2025-04-15');
                    handleSearch();
                  }}>
                    View Flights
                  </Button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1525624286402-9f701e60e9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    alt="London"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">London</h3>
                    <p className="text-sm opacity-90">United Kingdom</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <Plane className="h-4 w-4 text-airline-600 mr-1" />
                      <span className="text-sm text-gray-600">Multiple Airlines</span>
                    </div>
                    <span className="text-sm font-semibold text-airline-700">from $649</span>
                  </div>
                  <Button variant="outline" className="w-full border-airline-200 text-airline-700 hover:bg-airline-50" onClick={() => {
                    setSource('LHR');
                    setDestination('JFK');
                    setDate('2025-04-15');
                    handleSearch();
                  }}>
                    View Flights
                  </Button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1509549649946-f1b6276d4f35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    alt="Singapore"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Singapore</h3>
                    <p className="text-sm opacity-90">Singapore</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <Plane className="h-4 w-4 text-airline-600 mr-1" />
                      <span className="text-sm text-gray-600">Multiple Airlines</span>
                    </div>
                    <span className="text-sm font-semibold text-airline-700">from $349</span>
                  </div>
                  <Button variant="outline" className="w-full border-airline-200 text-airline-700 hover:bg-airline-50" onClick={() => {
                    setSource('SIN');
                    setDestination('HKG');
                    setDate('2025-04-15');
                    handleSearch();
                  }}>
                    View Flights
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
