import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from "../../services/axios";
import Layout from '../Layout';
import Swal from 'sweetalert2';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10
    });

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await API.get("/bookings");
            setBookings(res.data);
            setPagination(prev => ({
                ...prev,
                totalItems: res.data.length,
                totalPages: Math.ceil(res.data.length / prev.limit)
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        Swal.fire({
            title: "Cancel this booking?",
            showDenyButton: true,
            confirmButtonText: "Cancel booking",
            denyButtonText: "Don't Cancel booking"
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    await API.patch(`/bookings/${id}/cancel`);
                    fetchBookings();
                    Swal.fire("Canceled!", "", "success");
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to cancel booking');
                }
            }
        });
    };

    const getPaginatedBookings = () => {
        const startIndex = (pagination.currentPage - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        return bookings
            .filter(booking =>
                booking.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.time?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(startIndex, endIndex);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = getPaginatedBookings();
    const totalFilteredItems = bookings.filter(booking =>
        booking.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.time?.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;

    return (
        <Layout active="bookings" content={
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
                    <div className="flex space-x-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <Link
                            to="/bookings/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Booking
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBookings.length > 0 ? (
                                            filteredBookings.map(booking => (
                                                <tr key={booking._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img
                                                                    className="h-10 w-10 rounded-full"
                                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.clientId?.fullName || 'N/A')}&background=0ea5e9&color=fff`}
                                                                    alt={booking.clientId?.fullName || 'N/A'}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {booking.clientId?.fullName || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {booking.clientId?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(booking.date).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {booking.time}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                to={`/bookings/${booking._id}`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </Link>
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
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No bookings found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(pagination.currentPage * pagination.limit, totalFilteredItems)}
                                            </span>{' '}
                                            of <span className="font-medium">{totalFilteredItems}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (pagination.currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i;
                                                } else {
                                                    pageNum = pagination.currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.currentPage === pageNum
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <span className="sr-only">Next</span>
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        } />
    );
};

export default Bookings;