// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import "./Auth.css";

// const socket = io("http://localhost:9090");

// const Dashboard = () => {
//   const [donations, setDonations] = useState([]);
//   const [filteredDonations, setFilteredDonations] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [subscribers, setSubscribers] = useState([]);
//   const navigate = useNavigate();

//   // Auth check
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   // Fetch all donations
//   const fetchDonations = async () => {
//     try {
//       const res = await fetch("http://localhost:9090/donors");
//       if (!res.ok) throw new Error("Failed to fetch donations");
//       const data = await res.json();
//       const sorted = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//       setDonations(sorted);
//     } catch (err) {
//       console.error("Error fetching donations:", err);
//     }
//   };

//   // Fetch newsletter subscribers
//   const fetchSubscribers = async () => {
//     try {
//       const res = await fetch("http://localhost:9090/subscribers");
//       const data = await res.json();
//       setSubscribers(data);
//     } catch (err) {
//       console.error("Error fetching subscribers:", err);
//     }
//   };

//   // Filter donations by status
//   useEffect(() => {
//     if (statusFilter === "All") {
//       setFilteredDonations(donations);
//     } else {
//       setFilteredDonations(donations.filter(d => d.status === statusFilter));
//     }
//   }, [donations, statusFilter]);

//   // Load data and setup socket listeners
//   useEffect(() => {
//     fetchDonations();
//     fetchSubscribers();

//     socket.on("newDonor", (newDonor) => {
//       setDonations(prev => [newDonor, ...prev].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
//     });

//     socket.on("updateDonor", (updatedDonor) => {
//       setDonations(prev =>
//         prev.map(d => d._id === updatedDonor._id ? updatedDonor : d)
//           .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//       );
//     });

//     socket.on("deleteDonor", (deletedId) => {
//       setDonations(prev => prev.filter(d => d._id !== deletedId));
//     });

//     return () => {
//       socket.off("newDonor");
//       socket.off("updateDonor");
//       socket.off("deleteDonor");
//     };
//   }, []);

//   const handleFilterChange = (e) => {
//     setStatusFilter(e.target.value);
//   };

//   const handleUpdateStatus = async (id, currentStatus) => {
//     const nextStatus = currentStatus === "Pending" ? "Accepted" : "Completed";
//     try {
//       await fetch(`http://localhost:9090/donors/${id}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: nextStatus }),
//       });
//     } catch (err) {
//       console.error("Error updating status:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this record?");
//     if (!confirm) return;

//     try {
//       await fetch(`http://localhost:9090/donors/${id}`, {
//         method: "DELETE",
//       });
//     } catch (err) {
//       console.error("Error deleting record:", err);
//     }
//   };

//   const formatDateTime = (iso) => {
//     const date = new Date(iso);
//     return date.toLocaleString("en-US", {
//       day: "2-digit", month: "2-digit", year: "numeric",
//       hour: "2-digit", minute: "2-digit", second: "2-digit"
//     });
//   };

//   return (
//     <div className="dashboard-container">
//       <h2>Admin Dashboard</h2>

//       {/* Donation Filter */}
//       <div className="search-filter-container">
//         <label htmlFor="statusFilter">Filter by Status:</label>
//         <select
//           id="statusFilter"
//           className="status-filter"
//           value={statusFilter}
//           onChange={handleFilterChange}
//         >
//           <option value="All">All</option>
//           <option value="Pending">Pending</option>
//           <option value="Accepted">Accepted</option>
//           <option value="Completed">Completed</option>
//         </select>
//       </div>

//       {/* Donations Table */}
//       <h3 className="mt-4">Donations</h3>
//       {filteredDonations.length === 0 ? (
//         <p>No donations available.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Address</th>
//               <th>Donation Type</th>
//               <th>Status</th>
//               <th>Updated At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDonations.map(donor => (
//               <tr key={donor._id}>
//                 <td>{donor.name}</td>
//                 <td>{donor.mobile}</td>
//                 <td>{donor.address}</td>
//                 <td>{donor.donationType}</td>
//                 <td>
//                   <span className={`status-badge status-${donor.status.toLowerCase()}`}>
//                     {donor.status}
//                   </span>
//                 </td>
//                 <td>{formatDateTime(donor.updatedAt)}</td>
//                 <td>
//                   {donor.status !== "Completed" ? (
//                     <button
//                       className="update-btn"
//                       onClick={() => handleUpdateStatus(donor._id, donor.status)}
//                     >
//                       Update
//                     </button>
//                   ) : (
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(donor._id)}
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  // ======================
  // AUTH CHECK
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // ======================
  // FETCH DONATIONS
  // ======================
  const fetchDonations = async () => {
    try {
      const res = await fetch(`${API_URL}/donors`);
      if (!res.ok) throw new Error("Failed to fetch donations");

      const data = await res.json();
      const sorted = data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setDonations(sorted);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ======================
  // FILTER
  // ======================
  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(
        donations.filter((d) => d.status === statusFilter)
      );
    }
  }, [donations, statusFilter]);

  // ======================
  // UPDATE STATUS (INSTANT)
  // ======================
  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === "Pending" ? "Accepted" : "Completed";

    try {
      const res = await fetch(`${API_URL}/donors/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedDonor = await res.json();

      // 🔥 INSTANT UI UPDATE
      setDonations((prev) =>
        prev.map((d) =>
          d._id === updatedDonor._id ? updatedDonor : d
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ======================
  // DELETE (INSTANT)
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`${API_URL}/donors/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      // 🔥 INSTANT UI UPDATE
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="search-filter-container">
        <label>Filter by Status:</label>
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <h3 className="mt-4">Donations</h3>

      {filteredDonations.length === 0 ? (
        <p>No donations available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Donation Type</th>
              <th>Status</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonations.map((donor) => (
              <tr key={donor._id}>
                <td>{donor.name}</td>
                <td>{donor.mobile}</td>
                <td>{donor.address}</td>
                <td>{donor.donationType}</td>

                <td>
                  <span
                    className={`status-badge status-${donor.status.toLowerCase()}`}
                  >
                    {donor.status}
                  </span>
                </td>

                <td>{formatDateTime(donor.updatedAt)}</td>

                <td>
                  {donor.status !== "Completed" ? (
                    <button
                      className="update-btn"
                      onClick={() =>
                        handleUpdateStatus(donor._id, donor.status)
                      }
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(donor._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
