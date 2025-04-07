import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/track-donation">Track Donation</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
