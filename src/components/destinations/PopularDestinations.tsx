
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

interface PopularDestinationsProps {
  onViewFlights: (source: string, destination: string, date: string) => void;
}

const PopularDestinations = ({ onViewFlights }: PopularDestinationsProps) => {
  const defaultDate = '2025-04-15';

  return (
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
              <Button 
                variant="outline" 
                className="w-full border-airline-200 text-airline-700 hover:bg-airline-50" 
                onClick={() => onViewFlights('JFK', 'LAX', defaultDate)}
              >
                View Flights
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
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
              <Button 
                variant="outline" 
                className="w-full border-airline-200 text-airline-700 hover:bg-airline-50" 
                onClick={() => onViewFlights('LHR', 'JFK', defaultDate)}
              >
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
              <Button 
                variant="outline" 
                className="w-full border-airline-200 text-airline-700 hover:bg-airline-50" 
                onClick={() => onViewFlights('SIN', 'HKG', defaultDate)}
              >
                View Flights
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;
