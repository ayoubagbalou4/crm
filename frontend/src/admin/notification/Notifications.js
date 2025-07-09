import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import { GlobalContext } from '../../GlobalContext';
import API from '../../services/axios';

const Notifications = () => {

    const { user, setUser } = useContext(GlobalContext);
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

    const markAsRead = async (notificationId) => {
        try {
            await API.patch(`/notifications/${notificationId}/read`);
            setNotifications(notifications.map(notification =>
                notification._id === notificationId ? { ...notification, read: true } : notification
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await API.patch(`/notifications/mark-all-read`, { userId: user._id });
            setNotifications(notifications.map(notification =>
                ({ ...notification, read: true })
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark all as read');
        }
    };

    const archiveNotification = async (notificationId) => {
        try {
            await API.patch(`/notifications/${notificationId}/archive`);
            setNotifications(notifications.filter(notification => notification._id !== notificationId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to archive notification');
        }
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

    const groupByDate = (notifications) => {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        const groups = {
            today: [],
            yesterday: [],
            older: []
        };

        notifications.forEach(notification => {
            const notificationDate = new Date(notification.createdAt).toDateString();
            if (notificationDate === today) {
                groups.today.push(notification);
            } else if (notificationDate === yesterdayStr) {
                groups.yesterday.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'archived') return notification.archived;
        return true;
    });

    const groupedNotifications = groupByDate(filteredNotifications);

    return (
        <Layout active="notifications" content={
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="w-full mx-auto py-6 px-4">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'unread' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                            >
                                Unread
                            </button>
                            <button
                                onClick={() => setFilter('archived')}
                                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'archived' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                            >
                                Archived
                            </button>
                        </div>
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                            disabled={loading}
                        >
                            Mark all as read
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {groupedNotifications.today.length > 0 && (
                                <>
                                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                        <h3 className="text-sm font-medium text-gray-900">Today</h3>
                                    </div>
                                    {groupedNotifications.today.map(notification => (
                                        <NotificationItem
                                            key={notification._id}
                                            notification={notification}
                                            markAsRead={markAsRead}
                                            archiveNotification={archiveNotification}
                                            getIcon={getIcon}
                                        />
                                    ))}
                                </>
                            )}

                            {groupedNotifications.yesterday.length > 0 && (
                                <>
                                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                        <h3 className="text-sm font-medium text-gray-900">Yesterday</h3>
                                    </div>
                                    {groupedNotifications.yesterday.map(notification => (
                                        <NotificationItem
                                            key={notification._id}
                                            notification={notification}
                                            markAsRead={markAsRead}
                                            archiveNotification={archiveNotification}
                                            getIcon={getIcon}
                                        />
                                    ))}
                                </>
                            )}

                            {groupedNotifications.older.length > 0 && (
                                <>
                                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                        <h3 className="text-sm font-medium text-gray-900">Older</h3>
                                    </div>
                                    {groupedNotifications.older.map(notification => (
                                        <NotificationItem
                                            key={notification._id}
                                            notification={notification}
                                            markAsRead={markAsRead}
                                            archiveNotification={archiveNotification}
                                            getIcon={getIcon}
                                        />
                                    ))}
                                </>
                            )}

                            {filteredNotifications.length === 0 && (
                                <div className="px-4 py-12 text-center">
                                    <p className="text-gray-500">No notifications found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        } />
    );
};

const NotificationItem = ({ notification, markAsRead, archiveNotification, getIcon }) => {
    const { icon, color } = getIcon(notification.type);
    const date = new Date(notification.createdAt).toLocaleString();

    return (
        <div className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}>
            <div className="flex items-start">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${color}-100 flex items-center justify-center`}>
                    <i className={`${icon} text-${color}-600`}></i>
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-400">{date}</p>
                        <div className="space-x-2">
                            {!notification.read && (
                                <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="text-xs text-indigo-600 hover:text-indigo-900"
                                >
                                    Mark as read
                                </button>
                            )}
                            <button
                                onClick={() => archiveNotification(notification._id)}
                                className="text-xs text-gray-500 hover:text-gray-900"
                            >
                                Archive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;