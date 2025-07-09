import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import API from "../services/axios";
import moment from 'moment';
import BookingModal from './bookings/BookingModal';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Loader from '../components/Loader';


const Dashboard = () => {

    const [stats, setStats] = useState({ clients: 0, bookings: 0 });
    const [sessionPricing, setSessionPricing] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, sessionPricingRes, notificationRes] = await Promise.all([
                    API.get('/stats'),
                    API.get('/pricing'),
                    API.get('/notifications?filter=all'),
                ]);
                setStats(statsRes.data)
                setSessionPricing(sessionPricingRes.data);
                setNotifications(notificationRes.data);
                console.log(statsRes.data)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bookingsRes, clientsRes] = await Promise.all([
                    API.get('/bookings'),
                    API.get('/clients')
                ]);
                setBookings(bookingsRes.data);
                setClients(clientsRes.data.clients || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleBookingClick = (booking, e) => {
        e?.stopPropagation();
        setSelectedBooking(booking);
        setSelectedSlot(null);
        setShowModal(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


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


    const getIcon = (type) => {
        switch (type) {
            case 'booking':
                return { icon: 'fas fa-calendar-check', color: 'indigo' };
            case 'payment':
                return { icon: 'fas fa-dollar-sign', color: 'green' };
            case 'reminder':
                return { icon: 'fas fa-exclamation-triangle', color: 'yellow' };
            case 'message':
                return { icon: 'fas fa-envelope', color: 'blue' };
            default:
                return { icon: 'fas fa-bell', color: 'gray' };
        }
    };


    if (loading) {
        return (
            <Layout active="dashboard" content={
                <Loader />
            } />
        )
    }

    return (
        <>
            <Layout active="dashboard" content={
                <>
                    {/* Main content area */}
                    <div className="flex-1 overflow-auto p-4 bg-gray-50">
                        {/* Stats cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Clients</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.clients}</p>
                                        <p className="text-xs text-green-500 mt-1">
                                            <i className="fas fa-arrow-up mr-1"></i> 12.5% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-primary-50 text-primary-600">
                                        <i className="fas fa-users text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.bookings}</p>
                                        <p className="text-xs text-green-500 mt-1">
                                            <i className="fas fa-arrow-up mr-1"></i> 5.3% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                                        <i className="fas fa-calendar-alt text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Unread Notification</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.notifications}</p>
                                        <p className="text-xs text-red-500 mt-1">
                                            <i className="fas fa-arrow-down mr-1"></i> 2.1% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                        <i className="fas fa-bell text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Upcoming Bookings</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.upcomingBookingCount}</p>
                                        <p className="text-xs text-green-500 mt-1">
                                            <i className="fas fa-arrow-up mr-1"></i> 8.7% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                                        <i className="fas fa-clock text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Recent activities and top customers */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
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
                                <div className="mt-4">
                                    <Link to={`/bookings`}>
                                        <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">View all Bookings</button>
                                    </Link>
                                </div>
                            </div>

                            {/* Top customers */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
                                <div className="space-y-4">
                                    {
                                        stats?.topClients?.map((client, index) => (
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${client.fullName}&background=0ea5e9&color=fff`} alt="Acme Corp" />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{client.fullName}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{client.bookingCount} booking</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="mt-4">
                                    <button onClick={() => navigate(`/clients`)} className="text-sm text-primary-600 hover:text-primary-800 font-medium">View all customers</button>
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
                            <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {notifications.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-6">No recent notifications</p>
                                    ) : (
                                        notifications.map((notification, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className="flex items-start gap-4 py-4 hover:bg-gray-50 px-2 rounded-lg transition"
                                            >
                                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                                                    <i className={`${getIcon(notification.type).icon} text-${getIcon(notification.type).color}-600 text-lg`}></i>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{notification.name}</p>
                                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </a>
                                        ))
                                    )}
                                </div>
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
                            />
                        )}
                    </div>
                </>
            }
            />
        </>
    )
}

export default Dashboard