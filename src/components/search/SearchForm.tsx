
import { useState } from 'react';
import { CalendarIcon, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/data/mockData';
import { Flight } from '@/data/models';
import { searchFlights } from '@/utils/flightUtils';

interface SearchFormProps {
  onSearchResults: (results: Flight[], source: string, destination: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  isSearching: boolean;
}

const SearchForm = ({ onSearchResults, setIsSearching, isSearching }: SearchFormProps) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = async () => {
    if (!source || !destination || !date) {
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchFlights(source, destination, date);
      onSearchResults(results, source, destination);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
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
  );
};

export default SearchForm;
