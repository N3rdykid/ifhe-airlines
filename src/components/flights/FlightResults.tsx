
import { Button } from '@/components/ui/button';
import { Flight } from '@/data/models';
import { Plane, Search } from 'lucide-react';

interface FlightResultsProps {
  searchResults: Flight[];
  source: string;
  destination: string;
  onBookFlight: (flightId: string) => void;
  onResetSearch: () => void;
}

const FlightResults = ({ searchResults, source, destination, onBookFlight, onResetSearch }: FlightResultsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  return (
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
                      onClick={() => onBookFlight(flight.id)} 
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
              onClick={onResetSearch}
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightResults;
