import React, { useEffect, useState } from "react";
import API from "../../services/axios";
import { useNavigate, Link } from "react-router-dom";
import Layout from '../Layout';

const AddBooking = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        clientId: "",
        serviceId: "",
        date: "",
        time: "",
        notes: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/clients").then(res => setClients(res.data.clients));
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            await API.post("/bookings", form);
            navigate("/bookings");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout active="bookings" content={
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Booking</h2>
                    <Link
                        to="/bookings"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <i className="fas fa-arrow-left mr-2"></i> Back to Bookings
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                <select
                                    name="clientId"
                                    value={form.clientId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select client</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.fullName} {c.phone ? `(${c.phone})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                                <select
                                    name="serviceId"
                                    value={form.serviceId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select service</option>
                                    {services.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} (${s.price})</option>
                                    ))}
                                </select>
                            </div> */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate("/bookings")}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i> Save Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default AddBooking;