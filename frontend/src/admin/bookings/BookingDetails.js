import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/axios';
import Layout from '../Layout';
import Swal from 'sweetalert2';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [rescheduleForm, setRescheduleForm] = useState({
        date: '',
        time: ''
    });

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/bookings/${id}`);
                setBooking(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch booking details');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const cancelBooking = async () => {
        Swal.fire({
            title: "Cancel this booking?",
            showDenyButton: true,
            confirmButtonText: "Cancel booking",
            denyButtonText: "Don't Cancel booking"
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    await API.patch(`/bookings/${id}/cancel`);
                    Swal.fire("Canceled!", "", "success");
                    navigate('/bookings');
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to cancel booking');
                }
            }
        });
    };

    const [reschedulingLoading,setReschedulingLoading] = useState(false)
    const handleReschedule = async (e) => {
        e.preventDefault();
        try {
            setReschedulingLoading(true);
            await API.put(`/bookings/${id}`, rescheduleForm);
            navigate('/bookings');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reschedule booking');
        } finally {
            setReschedulingLoading(false);
        }
    };

    const handleRescheduleChange = (e) => {
        const { name, value } = e.target;
        setRescheduleForm(prev => ({ ...prev, [name]: value }));
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

    if (loading) {
        return (
            <Layout active="bookings" content={
                <div className="flex justify-center items-center h-full">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                </div>
            } />
        );
    }

    if (!booking) {
        return (
            <Layout active="bookings" content={
                <div className="p-6 text-center">
                    <p className="text-red-500">Booking not found</p>
                    <Link to="/bookings" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to bookings
                    </Link>
                </div>
            } />
        );
    }

    return (
        <Layout active="bookings" content={
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
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

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Booking #{booking._id.substring(18, 24).toUpperCase()}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Created on {new Date(booking.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                                {booking.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 py-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">CLIENT INFORMATION</h4>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12">
                                    <img
                                        className="h-12 w-12 rounded-full"
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.clientId?.name || 'N/A')}&background=0ea5e9&color=fff`}
                                        alt={booking.clientId?.name || 'N/A'}
                                    />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">{booking.clientId?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">{booking.clientId?.email || 'No email'}</p>
                                    <p className="text-sm text-gray-500">{booking.clientId?.phone || 'No phone'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">BOOKING DETAILS</h4>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Service</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {booking.serviceId?.name || 'N/A'} (${booking.serviceId?.price || '0'})
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(booking.date).toLocaleDateString()}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Time</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {booking.time}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {booking.serviceId?.duration || 'N/A'} mins
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {booking.notes || 'No notes provided'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {booking.status === 'confirmed' && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setIsRescheduling(!isRescheduling)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    <i className="fas fa-calendar-alt mr-2"></i> Reschedule
                                </button>
                                <button
                                    onClick={cancelBooking}
                                    disabled={isCancelling}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-75"
                                >
                                    {isCancelling ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i> Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-times mr-2"></i> Cancel Booking
                                        </>
                                    )}
                                </button>
                            </div>

                            {isRescheduling && (
                                <form onSubmit={handleReschedule} className="mt-4 p-4 bg-white rounded-md border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Reschedule Booking</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={rescheduleForm.date}
                                                onChange={handleRescheduleChange}
                                                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={rescheduleForm.time}
                                                onChange={handleRescheduleChange}
                                                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsRescheduling(false)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={reschedulingLoading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
                                        >
                                            {reschedulingLoading ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin mr-2"></i> Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2"></i> Update Booking
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        } />
    );
};

export default BookingDetails;