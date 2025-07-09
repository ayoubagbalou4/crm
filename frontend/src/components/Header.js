import React, { useContext, useState } from 'react'
import { GlobalContext } from '../GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/axios';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const Header = () => {

    const { user, setUser } = useContext(GlobalContext);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const nav = useNavigate()
    const logout = async () => {
        const response = await API.post(`/logout`)
        try {
            if (response.data.status) {
                nav('/login')
                setUser(null)
                localStorage.removeItem('token')
            }
        } catch (error) {
            console.log(error)
        }
    }


    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/notifications?filter=${filter}`);
                setNotifications(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch notifications');
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [filter]);


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



    return (
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
                <button className="md:hidden text-gray-500 focus:outline-none">
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="ml-4 text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notifications Dropdown */}
                <div className="relative">
                    <button
                        className="text-gray-500 focus:outline-none relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <i className="fas fa-bell"></i>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">

                                {/* Notification Items */}

                                {
                                    notifications.map((notification, index) => (

                                        <a key={index} href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <i className={`${getIcon(notification.type).icon} text-${getIcon(notification.type).color}-600`}></i>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{notification.name}</p>
                                                    <p className="text-sm text-gray-500">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                }



                            </div>
                            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                                <Link to="/notifications" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>


                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center text-sm focus:outline-none"
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        {user && user.picture ? (
                            <img className="h-8 w-8 rounded-full" src={user.picture} alt="User avatar" />
                        ) : (
                            <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`} alt="User avatar" />
                        )}
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                            <div className="py-1">
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                                <Link onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100">Sign out</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header