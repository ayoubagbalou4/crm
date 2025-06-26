import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/axios';
import Layout from '../Layout';
import Swal from 'sweetalert2';
import moment from 'moment';

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

    const [trainerSettings, setTrainerSettings] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const [bookingsRes, settingsRes] = await Promise.all([
                    API.get(`/bookings/${id}`),
                    API.get("/settings"),
                ]);
                setBooking(bookingsRes.data);
                setTrainerSettings(settingsRes.data);
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
        }).then(async (result) => {
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


    const [availableSlots, setAvailableSlots] = useState([]);

    // Generate available time slots based on selected date and trainer settings
    const generateAvailableSlots = (date) => {
        if (!trainerSettings || !date) return [];

        const dayName = moment(date).format('dddd').toLowerCase();
        if (!trainerSettings.daysAvailable[dayName]) return [];

        const slots = [];
        const startTime = moment(trainerSettings.startTime, 'HH:mm');
        const endTime = moment(trainerSettings.endTime, 'HH:mm');
        const breakStart = moment(trainerSettings.breakStart, 'HH:mm');
        const breakEnd = moment(trainerSettings.breakEnd, 'HH:mm');
        const duration = trainerSettings.sessionDuration;
        const buffer = trainerSettings.bufferTime;

        let currentSlot = startTime.clone();

        while (currentSlot.isBefore(endTime)) {
            // Skip break time
            if (currentSlot.isBetween(breakStart, breakEnd)) {
                currentSlot = breakEnd.clone();
                continue;
            }

            // Check if slot would go past end time
            const slotEnd = currentSlot.clone().add(duration, 'minutes');
            if (slotEnd.isAfter(endTime)) break;

            // Format the time for display and value
            const timeValue = currentSlot.format('HH:mm');
            const timeDisplay = currentSlot.format('h:mm A');

            slots.push({
                value: timeValue,
                display: timeDisplay
            });

            currentSlot.add(duration + buffer, 'minutes');
        }

        return slots;
    };

    const handleRescheduleChange = (e) => {
        const { name, value } = e.target;
        setRescheduleForm(prev => ({ ...prev, [name]: value }));

        // When date changes, update available time slots
        if (name === 'date') {
            const slots = generateAvailableSlots(value);
            setAvailableSlots(slots);

            // Reset time if no slots available or if current time isn't in available slots
            if (slots.length === 0 || !slots.some(slot => slot.value === rescheduleForm.time)) {
                setRescheduleForm(prev => ({ ...prev, time: slots[0]?.value || '' }));
            }
        }
    };


    const [reschedulingLoading, setReschedulingLoading] = useState(false)
    const handleReschedule = async (e) => {
        e.preventDefault();

        // Check if selected day is available
        const dayName = moment(rescheduleForm.date).format('dddd').toLowerCase();
        if (!trainerSettings.daysAvailable[dayName]) {
            Swal.fire({
                title: 'Day Not Available',
                text: 'The trainer is not available on the selected day',
                icon: 'error'
            });
            return;
        }

        // Check if selected time is within available slots
        const isValidTime = availableSlots.some(slot => slot.value === rescheduleForm.time);
        if (!isValidTime) {
            Swal.fire({
                title: 'Time Not Available',
                text: 'The selected time is not available for booking',
                icon: 'error'
            });
            return;
        }

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


    const isDateAvailable = (date) => {
        if (!date) return false;

        const selectedDate = moment(date);
        const today = moment().startOf('day');

        // Date must be today or in the future
        if (selectedDate.isBefore(today)) return false;

        // Check if day is available
        const dayName = selectedDate.format('dddd').toLowerCase();
        return trainerSettings?.daysAvailable[dayName] || false;
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
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.clientId?.fullName || 'N/A')}&background=0ea5e9&color=fff`}
                                        alt={booking.clientId?.fullName || 'N/A'}
                                    />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">{booking.clientId?.fullName || 'N/A'}</p>
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
                                        {booking.SessionPricingId?.sessionType || 'N/A'} (${booking.SessionPricingId?.price || '0'})
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
                                        {booking.SessionPricingId?.duration || 'N/A'} mins
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={rescheduleForm.date}
                                                onChange={handleRescheduleChange}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required
                                                disabled={loading}
                                                min={moment().format('YYYY-MM-DD')}
                                            />
                                            {rescheduleForm.date && !isDateAvailable(rescheduleForm.date) && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    Trainer is not available on this day
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                                            {rescheduleForm.date && isDateAvailable(rescheduleForm.date) ? (
                                                <select
                                                    name="time"
                                                    value={rescheduleForm.time}
                                                    onChange={handleRescheduleChange}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                    required
                                                    disabled={loading || availableSlots.length === 0}
                                                >
                                                    <option value="">Select time</option>
                                                    {availableSlots.map(slot => (
                                                        <option key={slot.value} value={slot.value}>
                                                            {slot.display}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="time"
                                                    name="time"
                                                    value={rescheduleForm.time}
                                                    onChange={handleRescheduleChange}
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    disabled
                                                />
                                            )}
                                            {rescheduleForm.date && isDateAvailable(rescheduleForm.date) && availableSlots.length === 0 && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    No available time slots for this day
                                                </p>
                                            )}
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