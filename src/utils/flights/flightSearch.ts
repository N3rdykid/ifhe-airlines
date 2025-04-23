
import { Flight } from '@/data/models';
import { mockFlights } from '@/data/mockData';

// Get all flights
export const getFlights = (): Promise<Flight[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFlights);
    }, 800);
  });
};

// Search flights by criteria
export const searchFlights = (source: string, destination: string, date: string): Promise<Flight[]> => {
  return new Promise((resolve) => {
    console.log("Searching flights with params:", { source, destination, date });
    console.log("Available flights:", mockFlights);
    
    setTimeout(() => {
      const filteredFlights = mockFlights.filter(flight => 
        (source ? flight.source.includes(source) : true) &&
        (destination ? flight.destination.includes(destination) : true)
      );
      
      console.log("Filtered flights:", filteredFlights);
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
