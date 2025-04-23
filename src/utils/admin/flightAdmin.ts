
import { Flight } from '@/data/models';
import { toast } from "@/utils/toastUtils";

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
