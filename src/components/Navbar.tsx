import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plane, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toastUtils';
import { isLoggedIn, logout, getCurrentUser, isAdmin } from '@/utils/authUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userLoggedIn = isLoggedIn();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out');
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Plane className="h-8 w-8 text-airline-600" />
              <span className="ml-2 text-xl font-semibold text-airline-800">IFHE AIRLINES</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Home
              </Link>
              {userLoggedIn && (
                <Link 
                  to="/bookings" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  My Bookings
                </Link>
              )}
              {userIsAdmin && (
                <Link 
                  to="/admin" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {userLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-airline-600" />
                    {user?.name || 'User'}
                    {userIsAdmin && <span className="ml-1 text-xs bg-airline-100 text-airline-800 px-1.5 py-0.5 rounded-full">Admin</span>}
                  </div>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-airline-600 hover:text-airline-700 hover:bg-airline-50">
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-airline-600 hover:text-airline-700 hover:bg-airline-50">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-airline-600 hover:bg-airline-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-airline-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {userLoggedIn && (
              <Link 
                to="/bookings" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}
            {userIsAdmin && (
              <Link 
                to="/admin" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {userLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
