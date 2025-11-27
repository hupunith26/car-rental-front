import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ Attach token to axios globally
  const setAuthToken = (tokenValue) => {
    if (tokenValue) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // ✅ Fetch logged-in user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch user");
    }
  };

  // ✅ Fetch all cars (public)
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch cars");
    }
  };

  // ✅ Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsOwner(false);
    setAuthToken(null);
    toast.success("Logout successfully");
    navigate("/");
  };

  // ✅ Load token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
    }
    fetchCars();
  }, []);

  // ✅ Whenever token changes, fetch user
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    isOwner,
    setIsOwner,
    token,
    setToken,
    logout,
    showLogin,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    cars,
    fetchCars,
    setCars,
    fetchUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
