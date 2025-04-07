import { fetchDonations, updateDonationStatus } from "../services/donationService";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donors, setDonors] = useState([]);
  const socket = io("http://localhost:9090");

  useEffect(() => {
    const loadDonors = async () => {
      try {
        const data = await fetchDonations();
        console.log("Initial donors:", data);
        setDonors(data);
      } catch (error) {
        console.error("Failed to fetch donors:", error);
      }
    };
    loadDonors();

    socket.on("newDonor", (newDonor) => {
      console.log("New donor received via socket:", newDonor);
      setDonors((prev) => [newDonor, ...prev]);
    });

    socket.on("updateDonor", (updatedDonor) => {
      console.log("Donor status updated via socket:", updatedDonor);
      setDonors((prev) =>
        prev.map((donor) => (donor._id === updatedDonor._id ? updatedDonor : donor))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Add changeStatus function
  const changeStatus = async (id, status) => {
    try {
      const updatedDonation = await updateDonationStatus(id, status);
      if (updatedDonation) {
        setDonors((prev) =>
          prev.map((donation) => (donation._id === id ? updatedDonation : donation))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <DonationContext.Provider value={{ donors, changeStatus }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => useContext(DonationContext);
