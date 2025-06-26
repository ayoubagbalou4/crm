import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import API from '../../services/axios';
import Swal from 'sweetalert2';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        daysAvailable: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false
        },
        startTime: '08:00',
        endTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        sessionDuration: 60,
        bufferTime: 15,
        timezone: '(GMT-08:00) Pacific Time (US & Canada)'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await API.get('/settings')
                setSettings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching settings:', error);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleDayChange = (day) => {
        setSettings(prev => ({
            ...prev,
            daysAvailable: {
                ...prev.daysAvailable,
                [day]: !prev.daysAvailable[day]
            }
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };


    const [loadingUpdate, setLoadingUpdate] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true)
        try {
            await API.put('/settings', settings);
            setLoadingUpdate(false)

            const Toast = await Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Settings saved successfully!"
            });
            window.location.reload();
        } catch (error) {
            console.error('Error saving settings:', error);
            setLoadingUpdate(false)
            alert('Failed to save settings.');
        }
    };

    if (loading) {
        return (
            <Layout active="settings" content={
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div className="flex justify-center items-center h-96">
                        <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
                    </div>
                </div>
            } />
        );
    }

    return (
        <Layout active="settings" content={
            <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Availability Settings</h1>
                        <p className="mt-2 text-sm text-gray-700">Set your available days and hours for client bookings</p>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Weekly Schedule</h3>
                                <p className="mt-1 text-sm text-gray-500">Select your regular working days</p>

                                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-7 sm:gap-x-4">
                                    {Object.entries(settings.daysAvailable).map(([day, isChecked]) => (
                                        <div key={day} className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={day}
                                                    name="daysAvailable"
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleDayChange(day)}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor={day} className="font-medium text-gray-700">
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Working Hours</h3>
                                <p className="mt-1 text-sm text-gray-500">Set your available hours for selected days</p>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <div className="mt-1">
                                            <input
                                                type="time"
                                                id="start-time"
                                                name="startTime"
                                                value={settings.startTime}
                                                onChange={handleInputChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">End Time</label>
                                        <div className="mt-1">
                                            <input
                                                type="time"
                                                id="end-time"
                                                name="endTime"
                                                value={settings.endTime}
                                                onChange={handleInputChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Lunch Break</h3>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="break-start" className="block text-sm font-medium text-gray-700">Break Start</label>
                                        <div className="mt-1">
                                            <input
                                                type="time"
                                                id="break-start"
                                                name="breakStart"
                                                value={settings.breakStart}
                                                onChange={handleInputChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="break-end" className="block text-sm font-medium text-gray-700">Break End</label>
                                        <div className="mt-1">
                                            <input
                                                type="time"
                                                id="break-end"
                                                name="breakEnd"
                                                value={settings.breakEnd}
                                                onChange={handleInputChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label htmlFor="session-duration" className="block text-sm font-medium text-gray-700">Default Session Duration</label>
                                <select
                                    id="session-duration"
                                    name="sessionDuration"
                                    value={settings.sessionDuration}
                                    onChange={handleNumberInputChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={90}>90 minutes</option>
                                    <option value={120}>120 minutes</option>
                                </select>
                            </div>

                            <div className="mt-8">
                                <label htmlFor="buffer-time" className="block text-sm font-medium text-gray-700">Buffer Time Between Sessions</label>
                                <select
                                    id="buffer-time"
                                    name="bufferTime"
                                    value={settings.bufferTime}
                                    onChange={handleNumberInputChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value={0}>0 minutes</option>
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>60 minutes</option>
                                </select>
                            </div>

                            <div className="mt-8">
                                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option>(GMT-12:00) International Date Line West</option>
                                    <option>(GMT-11:00) Midway Island, Samoa</option>
                                    <option>(GMT-10:00) Hawaii</option>
                                    <option>(GMT-09:00) Alaska</option>
                                    <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                                    <option>(GMT-07:00) Mountain Time (US & Canada)</option>
                                </select>
                            </div>

                            <div className="mt-8 pt-5 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loadingUpdate}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {loadingUpdate ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i> Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save mr-2"></i> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        } />
    );
}

export default Settings;