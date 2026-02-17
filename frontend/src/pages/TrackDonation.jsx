import { useDonation } from "../context/DonationContext";

const TrackDonation = () => {
    const { donors, changeStatus } = useDonation();

    return (
        <div>
            <h2>Donation Tracking</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Donation Type</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {donors.map((donor) => (
                        <tr key={donor._id}>
                            <td>{donor.name}</td>
                            <td>{donor.donationType}</td>
                            <td>{donor.status}</td>
                            <td>
                                <select
                                    value={donor.status}
                                    onChange={(e) => changeStatus(donor._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TrackDonation;
