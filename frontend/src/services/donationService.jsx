// import axios from "axios";

// const API_URL = "http://localhost:9090"; // ✅ Update if needed

// // 📌 Fetch all donations
// export const fetchDonations = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/donor/donations`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching donations:", error);
//     throw new Error(error.response?.data?.error || "Failed to fetch donations");
//   }
// };

// // 📌 Update donation status (Admin updates donation)
// export const updateDonationStatus = async (id, status) => {
//   try {
//     const response = await axios.put(`${API_URL}/donor/update/${id}`, { status });
//     return response.data; // ✅ Returning the updated donation object directly
//   } catch (error) {
//     console.error("❌ Error updating donation status:", error);
//     throw new Error(error.response?.data?.error || "Failed to update donation status");
//   }
// };
// import axios from "axios";

// const API_URL = "http://localhost:9090"; 

// // Fetch all donors (since donations are inside Donor model)
// export const fetchDonations = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/donors`);
//     console.log("✅ Donors received in frontend:", response.data); 
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching donors:", error);
//     throw new Error(error.response?.data?.error || "Failed to fetch donors");
//   }
// };


export const fetchDonations = async () => {
  try {
    const response = await fetch("http://localhost:9090/donors");
    if (!response.ok) throw new Error("Failed to fetch donations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

// Add updateDonationStatus function
export const updateDonationStatus = async (id, status) => {
  try {
    const response = await fetch(`http://localhost:9090/donors/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Failed to update status");

    return await response.json();
  } catch (error) {
    console.error("Error updating donation status:", error);
    return null;
  }
};

