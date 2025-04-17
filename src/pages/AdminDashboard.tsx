import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Plus, Edit, Trash2, Save, X, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getFlights, addFlight, updateFlight, deleteFlight } from '@/utils/flightUtils';
import { isLoggedIn, isAdmin } from '@/utils/authUtils';
import { Flight } from '@/data/models';
import { cities } from '@/data/mockData';

interface FlightFormData {
  id?: string;
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  duration: string;
  aircraft: string;
  createdAt: string;
  updatedAt?: string;
}

const initialFormData: FlightFormData = {
  flightNumber: '',
  airline: 'IFHE AIRLINES',
  source: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  arrivalDate: '',
  arrivalTime: '',
  price: 0,
  availableSeats: 0,
  totalSeats: 180,
  duration: '',
  aircraft: '',
  createdAt: new Date().toISOString()
};

const AdminDashboard = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      return;
    }

    const fetchFlights = async () => {
      try {
        const allFlights = await getFlights();
        setFlights(allFlights);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to load flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [navigate]);

  const handleOpenDialog = (flight?: Flight) => {
    if (flight) {
      setEditingFlight(flight);
      setIsEditing(true);
    } else {
      setEditingFlight(initialFormData);
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFlight(initialFormData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'price' || name === 'availableSeats') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setEditingFlight({
      ...editingFlight,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && editingFlight.id) {
        const updatedFlight = await updateFlight(editingFlight as Flight);
        setFlights(flights.map(f => f.id === updatedFlight.id ? updatedFlight : f));
      } else {
        const newFlight = await addFlight(editingFlight);
        setFlights([...flights, newFlight]);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving flight:', err);
      setError('Failed to save flight');
    }
  };

  const handleDeleteFlight = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      setProcessingId(id);
      try {
        const success = await deleteFlight(id);
        if (success) {
          setFlights(flights.filter(f => f.id !== id));
        } else {
          setError('Failed to delete flight');
        }
      } catch (err) {
        console.error('Error deleting flight:', err);
        setError('An error occurred while deleting the flight');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const filteredFlights = searchTerm 
    ? flights.filter(flight => 
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flights;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airline-600"></div>
        <p className="mt-4 text-gray-600">Loading flights data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage flights and view airline operations</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="mt-4 sm:mt-0 bg-airline-600 hover:bg-airline-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Flight
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold text-gray-800">All Flights</h2>
            <div className="relative mt-3 sm:mt-0 w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search flights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 text-airline-600 mr-2" />
                          {flight.flightNumber}
                        </div>
                      </TableCell>
                      <TableCell>{flight.source} → {flight.destination}</TableCell>
                      <TableCell>
                        <div>
                          <div>{flight.departureDate}</div>
                          <div className="text-sm text-gray-500">{flight.departureTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{flight.arrivalDate}</div>
                          <div className="text-sm text-gray-500">{flight.arrivalTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>{flight.duration}</TableCell>
                      <TableCell className="font-medium text-airline-700">
                        {formatPrice(flight.price)}
                      </TableCell>
                      <TableCell>{flight.availableSeats}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => handleOpenDialog(flight)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => handleDeleteFlight(flight.id)}
                            disabled={processingId === flight.id}
                            className="h-8 w-8"
                          >
                            {processingId === flight.id ? (
                              <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Search className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No flights found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Flight' : 'Add New Flight'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? `Editing flight ${editingFlight.flightNumber}` 
                : 'Fill in the details to add a new flight'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Flight Number *
                </label>
                <Input
                  id="flightNumber"
                  name="flightNumber"
                  value={editingFlight.flightNumber}
                  onChange={handleInputChange}
                  placeholder="SW101"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="airline" className="block text-sm font-medium text-gray-700 mb-1">
                  Airline *
                </label>
                <Input
                  id="airline"
                  name="airline"
                  value={editingFlight.airline}
                  onChange={handleInputChange}
                  placeholder="SkyWay"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Origin *
                </label>
                <select
                  id="source"
                  name="source"
                  value={editingFlight.source}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select origin</option>
                  {cities.map((city) => (
                    <option key={`source-${city.code}`} value={city.code} disabled={city.code === editingFlight.destination}>
                      {city.name} ({city.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={editingFlight.destination}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select destination</option>
                  {cities.map((city) => (
                    <option key={`dest-${city.code}`} value={city.code} disabled={city.code === editingFlight.source}>
                      {city.name} ({city.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date *
                </label>
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  value={editingFlight.departureDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time *
                </label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  value={editingFlight.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Date *
                </label>
                <Input
                  id="arrivalDate"
                  name="arrivalDate"
                  type="date"
                  value={editingFlight.arrivalDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time *
                </label>
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="time"
                  value={editingFlight.arrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingFlight.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Seats *
                </label>
                <Input
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  min="0"
                  value={editingFlight.availableSeats}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Seats *
                </label>
                <Input
                  id="totalSeats"
                  name="totalSeats"
                  type="number"
                  min="0"
                  value={editingFlight.totalSeats}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="3h 30m"
                  value={editingFlight.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="aircraft" className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft *
                </label>
                <Input
                  id="aircraft"
                  name="aircraft"
                  placeholder="Boeing 737-800"
                  value={editingFlight.aircraft}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" className="bg-airline-600 hover:bg-airline-700">
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Flight' : 'Add Flight'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
