import { toast } from "@/utils/toastUtils";

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const login = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Mock authentication - in a real app, this would call an API
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'Password123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 'user1',
          name: 'John Doe',
          email: 'user@example.com',
          isAdmin: false
        }));
        toast.success("Successfully logged in!");
        resolve(true);
      } else if (email === 'admin@example.com' && password === 'Password123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@example.com',
          isAdmin: true
        }));
        toast.success("Administrator logged in!");
        resolve(true);
      } else {
        toast.error("Invalid email or password");
        resolve(false);
      }
    }, 1000);
  });
};

export const signup = (name: string, email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Mock sign up - in a real app, this would call an API
    setTimeout(() => {
      if (email === 'user@example.com') {
        toast.error("Account already exists with this email");
        resolve(false);
      } else {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 'user' + Math.floor(Math.random() * 1000),
          name,
          email,
          isAdmin: false
        }));
        toast.success("Account created successfully!");
        resolve(true);
      }
    }, 1000);
  });
};

export const logout = (): void => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  toast.success("Logged out successfully");
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (e) {
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin === true;
};
