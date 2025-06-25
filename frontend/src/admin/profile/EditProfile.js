import React from 'react'
import Layout from '../Layout'

const EditProfile = () => {
    return (
        <Layout active="settings" content={
            <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
                        <p className="mt-2 text-sm text-gray-700">Update your personal information and account settings</p>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                                    <div className="mt-2 flex items-center">
                                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                            <img className="h-full w-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                        </span>
                                        <button type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Change
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label for="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                            <input type="text" name="first-name" id="first-name" autocomplete="given-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="John" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label for="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                            <input type="text" name="last-name" id="last-name" autocomplete="family-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="Doe" />
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label for="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                            <input type="email" name="email" id="email" autocomplete="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="john.doe@example.com" />
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label for="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                                            <input type="text" name="phone" id="phone" autocomplete="tel" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="(555) 123-4567" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label for="country" className="block text-sm font-medium text-gray-700">Country</label>
                                            <select id="country" name="country" autocomplete="country" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option>United States</option>
                                                <option>Canada</option>
                                                <option>Mexico</option>
                                            </select>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label for="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                                            <select id="timezone" name="timezone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                                                <option>(GMT-07:00) Mountain Time (US & Canada)</option>
                                                <option>(GMT-06:00) Central Time (US & Canada)</option>
                                                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label for="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                                            <input type="password" name="current-password" id="current-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label for="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                                            <input type="password" name="new-password" id="new-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label for="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                            <input type="password" name="confirm-password" id="confirm-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-5">
                                    <div className="flex justify-end">
                                        <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Cancel
                                        </button>
                                        <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Save Changes
                                        </button>
                                    </div>
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

export default EditProfile