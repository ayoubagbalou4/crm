import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/axios';
import moment from 'moment';
import Layout from '../Layout';
import BookingModal from '../bookings/BookingModal';
import { format } from "date-fns";
import Swal from 'sweetalert2';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState('month');
    const [error, setError] = useState('');
    const [clients, setClients] = useState([]);
    const [trainerSettings, setTrainerSettings] = useState(null);
    const [sessionPricing, setSessionPricing] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bookingsRes, clientsRes, settingsRes,sessionPricingRes] = await Promise.all([
                    API.get('/bookings'),
                    API.get('/clients'),
                    API.get('/settings'), // Assuming this endpoint exists
                    API.get('/pricing'),
                ]);
                setBookings(bookingsRes.data);
                setClients(clientsRes.data.clients || []);
                setTrainerSettings(settingsRes.data);
                setSessionPricing(sessionPricingRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Check if a day is available based on trainer settings
    const isDayAvailable = (day) => {
        if (!trainerSettings) return true;
        
        const dayName = day.format('dddd').toLowerCase();
        return trainerSettings.daysAvailable[dayName];
    };

    // Generate time slots for a given day based on trainer settings
    const generateTimeSlots = (day) => {
        if (!trainerSettings || !isDayAvailable(day)) return [];
        
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
            
            // Check if this slot is already booked
            const isBooked = bookings.some(booking => {
                const bookingDate = moment(booking.date);
                const bookingTime = moment(booking.time, 'HH:mm');
                return (
                    bookingDate.isSame(day, 'day') &&
                    bookingTime.isSame(currentSlot, 'minute')
                );
            });
            
            if (!isBooked) {
                slots.push({
                    time: currentSlot.format('HH:mm'),
                    available: true
                });
            }
            
            currentSlot.add(duration + buffer, 'minutes');
        }
        
        return slots;
    };

    // Generate calendar days based on current view
    const generateCalendarDays = () => {
        if (view === 'day') {
            return [currentDate.clone()];
        } else if (view === 'week') {
            const startOfWeek = currentDate.clone().startOf('week');
            const days = [];
            for (let i = 0; i < 7; i++) {
                days.push(startOfWeek.clone().add(i, 'days'));
            }
            return days;
        } else {
            // Month view
            const startOfMonth = currentDate.clone().startOf('month').startOf('week');
            const endOfMonth = currentDate.clone().endOf('month').endOf('week');
            const days = [];
            let day = startOfMonth.clone();
            while (day.isBefore(endOfMonth, 'day')) {
                days.push(day.clone());
                day.add(1, 'day');
            }
            return days;
        }
    };

    // Get bookings for a specific day
    const getBookingsForDay = (day) => {
        return bookings.filter(booking =>
            moment(booking.date).isSame(day, 'day')
        );
    };

    // Handle date navigation
    const navigateDate = (direction) => {
        const unit = view === 'day' ? 'day' : view === 'week' ? 'week' : 'month';
        setCurrentDate(currentDate.clone().add(direction === 'prev' ? -1 : 1, unit));
    };

    const handleDayClick = (day) => {
        if (!isDayAvailable(day)) {
            Swal.fire({
                title: 'Not Available',
                text: 'The trainer is not available on this day',
                icon: 'info'
            });
            return;
        }
        
        setSelectedSlot({
            date: day.format('YYYY-MM-DD'),
            time: moment().format('HH:mm'),
            availableSlots: generateTimeSlots(day)
        });
        setSelectedBooking(null);
        setShowModal(true);
    };

    // Handle booking click
    const handleBookingClick = (booking, e) => {
        e?.stopPropagation();
        setSelectedBooking(booking);
        setSelectedSlot(null);
        setShowModal(true);
    };

    // Handle booking save
    const handleSaveBooking = async (formData) => {
        try {
            setLoading(true);
            let updatedBookings;

            if (selectedBooking) {
                await API.patch(`/bookings/${selectedBooking._id}`, formData);
            } else {
                await API.post('/bookings', formData);
            }

            // Refresh bookings
            const response = await API.get('/bookings');
            setBookings(response.data);
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save booking');
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await API.patch(`/bookings/${id}/cancel`);
                    const response = await API.get('/bookings');
                    setBookings(response.data);
                    setShowModal(false);
                    Swal.fire("Canceled!", "", "success");
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to cancel booking');
                }
            }
        });
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Generate calendar days based on current view
    const days = generateCalendarDays();

    // Render day cell
    const renderDayCell = (day) => {
        const isCurrentMonth = day.isSame(currentDate, 'month');
        const isToday = day.isSame(moment(), 'day');
        const dayBookings = getBookingsForDay(day);
        const isAvailable = isDayAvailable(day);

        return (
            <div
                key={day.format('YYYY-MM-DD')}
                onClick={() => handleDayClick(day)}
                className={`bg-white p-2 ${view === 'month' ? 'h-32' : 'h-32'} ${isCurrentMonth ? '' : 'text-gray-400'
                    } ${isToday ? 'ring-2 ring-indigo-500' : ''} ${isAvailable ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-100 cursor-not-allowed'}`}
            >
                <time dateTime={day.format('YYYY-MM-DD')} className="font-medium">
                    {day.format('D')}
                </time>
                {!isAvailable && (
                    <div className="mt-1 text-xs text-gray-500">Not available</div>
                )}
                <ol className="mt-2 space-y-1">
                    {dayBookings.slice(0, view === 'month' ? 2 : 5).map(booking => (
                        <li key={booking._id}>
                            <button
                                onClick={(e) => handleBookingClick(booking, e)}
                                className="group w-full flex text-left"
                            >
                                <p className="flex-auto truncate font-medium text-indigo-600 group-hover:text-indigo-900">
                                    {booking.clientId?.fullName || 'Client'}
                                </p>
                                <time
                                    dateTime={`${booking.date}T${booking.time}`}
                                    className="ml-3 hidden flex-none text-gray-500 group-hover:text-gray-900 xl:block"
                                >
                                    {moment(booking.time, 'HH:mm').format('h:mm A')}
                                </time>
                            </button>
                        </li>
                    ))}
                    {dayBookings.length > (view === 'month' ? 2 : 5) && (
                        <li className="text-gray-500 text-xs">
                            +{dayBookings.length - (view === 'month' ? 2 : 5)} more
                        </li>
                    )}
                </ol>
            </div>
        );
    };

    return (
        <Layout active="calendar" content={
            <div className="flex-1 overflow-auto p-4 bg-gray-50">

                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Training Calendar</h1>
                        <p className="mt-2 text-sm text-gray-700">View and manage your bookings</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => {
                                const today = moment();
                                if (!isDayAvailable(today)) {
                                    Swal.fire({
                                        title: 'Not Available',
                                        text: 'The trainer is not available today',
                                        icon: 'info'
                                    });
                                    return;
                                }
                                
                                setSelectedSlot({
                                    date: today.format('YYYY-MM-DD'),
                                    time: moment().format('HH:mm'),
                                    availableSlots: generateTimeSlots(today)
                                });
                                setSelectedBooking(null);
                                setShowModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <i className="fas fa-plus mr-2"></i> New Booking
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Calendar Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => navigateDate('prev')}
                            className="p-2 rounded-full bg-white border border-gray-300 shadow-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Previous {view}</span>
                            <i className="fas fa-chevron-left h-5 w-5"></i>
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {view === 'day' ? currentDate.format('MMMM D, YYYY') :
                                view === 'week' ? `${currentDate.clone().startOf('week').format('MMM D')} - ${currentDate.clone().endOf('week').format('MMM D, YYYY')}` :
                                    currentDate.format('MMMM YYYY')}
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigateDate('next')}
                            className="p-2 rounded-full bg-white border border-gray-300 shadow-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Next {view}</span>
                            <i className="fas fa-chevron-right h-5 w-5"></i>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentDate(moment())}
                            className="ml-4 px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Today
                        </button>
                    </div>
                    <div className="relative">
                        <div className="flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => setView('day')}
                                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${view === 'day' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Day
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('week')}
                                className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Week
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('month')}
                                className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Month
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                {view === 'month' && (
                    <div className="mt-6 grid grid-cols-7 gap-px bg-gray-200 text-sm text-gray-700">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-gray-100 py-2 text-center font-semibold">
                                {day}
                            </div>
                        ))}
                        {days.map(day => renderDayCell(day))}
                    </div>
                )}

                {view === 'week' && (
                    <div className="mt-6 grid grid-cols-7 gap-px bg-gray-200 text-sm text-gray-700">
                        {days.map(day => (
                            <div key={day.format('ddd')} className="flex flex-col">
                                <div className="bg-gray-100 py-2 text-center font-semibold">
                                    {day.format('ddd')}<br />
                                    {day.format('D')}
                                </div>
                                {renderDayCell(day)}
                            </div>
                        ))}
                    </div>
                )}

                {view === 'day' && (
                    <div className="mt-6">
                        <div className="bg-gray-100 py-2 text-center font-semibold">
                            {currentDate.format('dddd, MMMM D')}
                        </div>
                        <div className="bg-white p-4">
                            {renderDayCell(currentDate)}
                        </div>
                    </div>
                )}

                {/* Upcoming Events */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Upcoming Sessions</h2>
                    <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                        {bookings.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No bookings found
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {bookings
                                    .filter(b => {
                                        const bookingDateTime = moment(`${b.date.split('T')[0]}T${b.time}`);
                                        const now = moment();
                                        return bookingDateTime.isAfter(now);
                                    })
                                    .sort((a, b) => {
                                        const aTime = moment(`${a.date.split('T')[0]}T${a.time}`);
                                        const bTime = moment(`${b.date.split('T')[0]}T${b.time}`);
                                        return aTime.diff(bTime);
                                    })
                                    .slice(0, 5)
                                    .map(booking => (
                                        <li key={booking._id}>
                                            <button
                                                onClick={() => handleBookingClick(booking)}
                                                className="block w-full text-left hover:bg-gray-50"
                                            >
                                                <div className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                                            {booking.clientId?.fullName || 'Client'}
                                                        </p>
                                                        <div className="ml-2 flex-shrink-0 flex">
                                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)
                                                                }`}>
                                                                {booking.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 sm:flex sm:justify-between">
                                                        <div className="sm:flex">
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                <i className="fas fa-calendar mr-1.5 text-gray-400"></i>
                                                                {moment(booking.date.split('T')[0]).format('ddd, MMM D')}, {moment(booking.time, 'HH:mm').format('h:mm A')}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            <i className="fas fa-file-alt mr-1.5 text-gray-400"></i>
                                                            <p className="truncate max-w-xs">{booking.notes || 'No notes'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        )}
                    </div>
                </div>

                {/* Booking Modal */}
                {showModal && (
                    <BookingModal
                        slotInfo={selectedSlot}
                        booking={selectedBooking}
                        clients={clients}
                        sessionPricing={sessionPricing}
                        onClose={() => setShowModal(false)}
                        onSave={handleSaveBooking}
                        onCancelBooking={selectedBooking ? () => cancelBooking(selectedBooking._id) : null}
                        trainerSettings={trainerSettings}
                    />
                )}
            </div>
        } />
    );
};

export default CalendarView;