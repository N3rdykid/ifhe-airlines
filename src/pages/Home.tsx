
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flight } from '@/data/models';
import { toast } from '@/utils/toastUtils';
import HeroSection from '@/components/hero/HeroSection';
import SearchForm from '@/components/search/SearchForm';
import FlightResults from '@/components/flights/FlightResults';
import PopularDestinations from '@/components/destinations/PopularDestinations';

const Home = () => {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSource, setCurrentSource] = useState('');
  const [currentDestination, setCurrentDestination] = useState('');
  const navigate = useNavigate();

  const handleSearchResults = (results: Flight[], source: string, destination: string) => {
    setSearchResults(results);
    setHasSearched(true);
    setCurrentSource(source);
    setCurrentDestination(destination);
  };

  const handleBookFlight = (flightId: string) => {
    navigate(`/booking/${flightId}`);
  };

  const handleResetSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleViewPopularFlight = (source: string, destination: string, date: string) => {
    setIsSearching(true);
    
    import('@/utils/flightUtils').then(module => {
      module.searchFlights(source, destination, date)
        .then(results => {
          handleSearchResults(results, source, destination);
        })
        .catch(error => {
          console.error('Error searching popular flights:', error);
          toast.error('Unable to load flights. Please try again.');
        })
        .finally(() => {
          setIsSearching(false);
        });
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Search Form */}
      <HeroSection>
        <SearchForm 
          onSearchResults={handleSearchResults}
          setIsSearching={setIsSearching}
          isSearching={isSearching}
        />
      </HeroSection>

      {/* Search Results */}
      {hasSearched && (
        <FlightResults 
          searchResults={searchResults}
          source={currentSource}
          destination={currentDestination}
          onBookFlight={handleBookFlight}
          onResetSearch={handleResetSearch}
        />
      )}

      {/* Featured Destinations */}
      {!hasSearched && (
        <PopularDestinations onViewFlights={handleViewPopularFlight} />
      )}
    </div>
  );
};

export default Home;
