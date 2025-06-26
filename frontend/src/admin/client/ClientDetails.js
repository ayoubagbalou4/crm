import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Layout';
import API from '../../services/axios';
import Swal from 'sweetalert2';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('sessions');

    const fetchClient = async () => {
        try {
            const [clientsRes, bookingsRes,] = await Promise.all([
                API.get(`/clients/${id}`),
                API.get(`/bookingsByClient/${id}`),
            ]);
            setClient(clientsRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch client');
            console.error('Error fetching client:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} years old`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const cancelBooking = async (id) => {
        Swal.fire({
            title: "Cancel this booking?",
            showDenyButton: true,
            confirmButtonText: "Cancel booking",
            denyButtonText: "Don't Cancel booking"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await API.patch(`/bookings/${id}/cancel`);
                    fetchClient();
                    Swal.fire("Canceled!", "", "success");
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to cancel booking');
                }
            }
        });
    };


    const deleteBookingsConfirm = (id) => {
        Swal.fire({
            title: "Do you want to delete This Bookings?",
            showDenyButton: true,
            confirmButtonText: "delete",
            denyButtonText: "Don't delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await API.delete(`/bookings/${id}`);
                    fetchClient();
                    Swal.fire("Deleted!", "", "success");
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to cancel booking');
                }
            }
        });
    }

    if (loading) {
        return (
            <Layout active="clients" content={
                <div className="flex justify-center items-center h-full">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                </div>
            }
            />
        );
    }

    if (error) {
        return (
            <Layout active="clients" content={
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            }
            />
        );
    }

    if (!client) {
        return (
            <Layout active="clients" content={
                <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                    Client not found
                </div>
            }
            />
        );
    }

    return (
        <Layout active="clients" content={
            <div className="flex-1 overflow-auto p-4 bg-gray-50 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <Link to="/clients" className="mr-4 text-gray-500 hover:text-gray-700">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
                            <p className="text-sm text-gray-500">View and manage client information</p>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                            onClick={() => navigate(`/clients/editclient/${id}`)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <i className="fas fa-edit mr-2"></i> Edit
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <i className="fas fa-plus mr-2"></i> New Session
                        </button>
                    </div>
                </div>

                {/* Client Profile Section */}
                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-start">
                            {/* Client Avatar */}
                            <div className="flex-shrink-0">
                                <img
                                    className="h-20 w-20 rounded-full"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.fullName)}&background=0ea5e9&color=fff`}
                                    alt={client.fullName}
                                />
                            </div>

                            {/* Client Info */}
                            <div className="ml-6 flex-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">{client.fullName}</h2>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        client.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                            client.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        <i className={`fas fa-circle mr-1`} style={{ fontSize: '6px' }}></i>
                                        {client.status || 'Unknown'}
                                    </span>
                                </div>

                                <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-envelope mr-2 text-gray-400"></i>
                                        {client.email || 'N/A'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-phone mr-2 text-gray-400"></i>
                                        {client.phone || 'N/A'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-birthday-cake mr-2 text-gray-400"></i>
                                        {calculateAge(client.birthDate)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-venus-mars mr-2 text-gray-400"></i>
                                        {client.gender || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Membership</h3>
                                <p className="mt-1 text-sm text-gray-900">Premium (12 sessions)</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(client.createdAt)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Last Session</h3>
                                <p className="mt-1 text-sm text-gray-900">June 10, 2023</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="mt-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('sessions')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sessions'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <i className="fas fa-calendar-alt mr-2"></i> Session History
                        </button>
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <i className="fas fa-chart-line mr-2"></i> Progress
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <i className="fas fa-file-alt mr-2"></i> Notes
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <i className="fas fa-dollar-sign mr-2"></i> Payments
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'sessions' && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">Recent Sessions</h3>

                        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {
                                        bookings.map((booking, index) => (
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</div>
                                                    <div className="text-sm text-gray-500">{booking.time}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {booking?.SessionPricingId?.sessionType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {booking?.SessionPricingId?.duration} Min
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {booking.notes}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            to={`/bookings/${booking._id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteBookingsConfirm(booking._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                        {booking.status === "confirmed" && (
                                                            <button
                                                                onClick={() => cancelBooking(booking._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Client Notes</h3>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <i className="fas fa-plus mr-1"></i> Add Note
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="https://ui-avatars.com/api/?name=Trainer&background=0ea5e9&color=fff"
                                                alt="Trainer"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900">You</p>
                                                <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-700">
                                                <p>{client.notes || 'No notes available for this client.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other tabs would be implemented similarly */}
            </div>
        }
        />
    );
};

export default ClientDetails;