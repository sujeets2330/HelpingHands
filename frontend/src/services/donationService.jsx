// export const fetchDonations = async () => {
//   try {
//     const response = await fetch("http://localhost:9090/donors");
//     if (!response.ok) throw new Error("Failed to fetch donations");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching donations:", error);
//     return [];
//   }
// };

// // Add updateDonationStatus function
// export const updateDonationStatus = async (id, status) => {
//   try {
//     const response = await fetch(`http://localhost:9090/donors/${id}/status`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ status }),
//     });

//     if (!response.ok) throw new Error("Failed to update status");

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating donation status:", error);
//     return null;
//   }
// };

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDonations = async () => {
  try {
    const response = await fetch(`${API_URL}/donors`);
    if (!response.ok) throw new Error("Failed to fetch donations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

export const updateDonationStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/donors/${id}/status`, {
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
