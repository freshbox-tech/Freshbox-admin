"use client";
import ApiServices from "@/lib/ApiServices";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [riders, setRiders] = useState([]);
  const [orders, setOrders] = useState([]);
  const router = useRouter()

  const getAllRiders = async () => {
    try {
      const res = await ApiServices.allRiders();
      if (res.data.success) {
        setRiders(res.data.riders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllServices = async () => {
    try {
      const res = await ApiServices.allServices();
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));


      } catch {
        setUser(null);

        localStorage.removeItem("user");
      }
    } else {
      setUser(null);

    }
  }, []);
  const getAllOrders = async () => {
    try {
      const res = await ApiServices.allOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllServicesAreas = async () => {
    try {
      const res = await ApiServices.allServicesArea();
      if (res.data.success) {
        setServiceAreas(res.data.areas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await ApiServices.allUsers();
      if (res.data.success) {
        const users = res.data.users;
        setCustomers(users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSupportTickets = async () => {
    try {
      const res = await ApiServices.getAllTickets();
      if (res.data.success) {
        const tickets = res.data.tickets;
        setTickets(tickets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (typeof window === "undefined") {
  //     return null;
  //   } else {
  //     const storedUser = localStorage.getItem("user");

  //     if (storedUser) {
  //       setUser(JSON.parse(storedUser));
  //     } else {
  //       setUser(null);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    getAllSupportTickets();
    getAllServicesAreas();
    getAllUsers();
    getAllServices();
    getAllRiders();
    getAllOrders();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/Login")
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    logout,
    setUser,
    customers,
    services,
    setServices,
    serviceAreas,
    orders,
    setServiceAreas,
    riders,
    setRiders,
    setTickets,
    setOrders,
    tickets,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
