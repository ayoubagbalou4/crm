import React from 'react'
import Layout from '../Layout'

const Settings = () => {
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
                        <form>
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Weekly Schedule</h3>
                                <p className="mt-1 text-sm text-gray-500">Select your regular working days</p>

                                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-7 sm:gap-x-4">

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="monday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="monday" className="font-medium text-gray-700">Monday</label>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="tuesday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="tuesday" className="font-medium text-gray-700">Tuesday</label>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="wednesday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="wednesday" className="font-medium text-gray-700">Wednesday</label>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="thursday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="thursday" className="font-medium text-gray-700">Thursday</label>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="friday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="friday" className="font-medium text-gray-700">Friday</label>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="saturday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="saturday" className="font-medium text-gray-700">Saturday</label>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="sunday" name="days[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="sunday" className="font-medium text-gray-700">Sunday</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Working Hours</h3>
                                <p className="mt-1 text-sm text-gray-500">Set your available hours for selected days</p>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label for="start-time" className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <div className="mt-1">
                                            <input type="time" id="start-time" name="start-time" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" value="08:00" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="end-time" className="block text-sm font-medium text-gray-700">End Time</label>
                                        <div className="mt-1">
                                            <input type="time" id="end-time" name="end-time" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" value="18:00" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Lunch Break</h3>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label for="break-start" className="block text-sm font-medium text-gray-700">Break Start</label>
                                        <div className="mt-1">
                                            <input type="time" id="break-start" name="break-start" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" value="12:00" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="break-end" className="block text-sm font-medium text-gray-700">Break End</label>
                                        <div className="mt-1">
                                            <input type="time" id="break-end" name="break-end" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" value="13:00" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label for="session-duration" className="block text-sm font-medium text-gray-700">Default Session Duration</label>
                                <select id="session-duration" name="session-duration" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option>30 minutes</option>
                                    <option selected>60 minutes</option>
                                    <option>90 minutes</option>
                                    <option>120 minutes</option>
                                </select>
                            </div>

                            <div className="mt-8">
                                <label for="buffer-time" className="block text-sm font-medium text-gray-700">Buffer Time Between Sessions</label>
                                <select id="buffer-time" name="buffer-time" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option>0 minutes</option>
                                    <option selected>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>45 minutes</option>
                                    <option>60 minutes</option>
                                </select>
                            </div>

                            <div className="mt-8">
                                <label for="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                                <select id="timezone" name="timezone" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option>(GMT-12:00) International Date Line West</option>
                                    <option>(GMT-11:00) Midway Island, Samoa</option>
                                    <option>(GMT-10:00) Hawaii</option>
                                    <option>(GMT-09:00) Alaska</option>
                                    <option selected>(GMT-08:00) Pacific Time (US & Canada)</option>
                                    <option>(GMT-07:00) Mountain Time (US & Canada)</option>
                                </select>
                            </div>

                            <div className="mt-8 pt-5 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Cancel
                                    </button>
                                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        }
        />
    )
}

export default Settings