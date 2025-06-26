import React, { useContext, useState } from 'react'
import { GlobalContext } from '../GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/axios';

const Header = () => {

    const { user , setUser } = useContext(GlobalContext);

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
                                <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <i className="fas fa-calendar-check text-indigo-600"></i>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">New booking</p>
                                            <p className="text-sm text-gray-500">John Doe booked a session for tomorrow</p>
                                            <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                                        </div>
                                    </div>
                                </a>

                                <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <i className="fas fa-dollar-sign text-green-600"></i>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Payment received</p>
                                            <p className="text-sm text-gray-500">$120 from Jane Smith</p>
                                            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                                        </div>
                                    </div>
                                </a>

                                <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <i className="fas fa-exclamation-triangle text-yellow-600"></i>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Session reminder</p>
                                            <p className="text-sm text-gray-500">You have a session in 30 minutes</p>
                                            <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                    View all notifications
                                </a>
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