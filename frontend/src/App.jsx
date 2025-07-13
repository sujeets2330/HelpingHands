import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrackDonation from "./pages/TrackDonation";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { DonationProvider } from "./context/DonationContext";
 

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <DonationProvider>
        <Router>
          <>
            {/* Your main app routes */}
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/track" element={<TrackDonation />} />
            </Routes>
          </>
        </Router>
      </DonationProvider>
    </AuthProvider>
  );
}

export default App;
