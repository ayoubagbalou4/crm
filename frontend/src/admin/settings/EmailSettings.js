import React from 'react'
import Layout from '../Layout'

const EmailSettings = () => {
    return (
        <Layout active="emailSettings" content={
            <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Email Settings</h1>
                        <p className="mt-2 text-sm text-gray-700">Configure your email notifications and templates</p>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form>
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
                                <p className="mt-1 text-sm text-gray-500">Select which email notifications you want to receive</p>

                                <div className="mt-4 space-y-4">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="new-booking" name="new-booking" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="new-booking" className="font-medium text-gray-700">New booking notifications</label>
                                            <p className="text-gray-500">Receive an email when a new booking is made</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="booking-changes" name="booking-changes" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="booking-changes" className="font-medium text-gray-700">Booking change notifications</label>
                                            <p className="text-gray-500">Receive an email when a booking is rescheduled or cancelled</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="payment-receipts" name="payment-receipts" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="payment-receipts" className="font-medium text-gray-700">Payment receipts</label>
                                            <p className="text-gray-500">Receive payment confirmation emails</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="newsletter" name="newsletter" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="newsletter" className="font-medium text-gray-700">Newsletter</label>
                                            <p className="text-gray-500">Receive our monthly newsletter with tips and updates</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Reminder Settings</h3>
                                <p className="mt-1 text-sm text-gray-500">Configure automatic reminders sent to clients</p>

                                <div className="mt-4">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="enable-reminders" name="enable-reminders" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="enable-reminders" className="font-medium text-gray-700">Enable automatic reminders</label>
                                        </div>
                                    </div>

                                    <div className="mt-4 ml-8 space-y-4">
                                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                                            <div>
                                                <label for="first-reminder" className="block text-sm font-medium text-gray-700">First Reminder</label>
                                                <select id="first-reminder" name="first-reminder" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                    <option>24 hours before</option>
                                                    <option selected>48 hours before</option>
                                                    <option>72 hours before</option>
                                                    <option>1 week before</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label for="second-reminder" className="block text-sm font-medium text-gray-700">Second Reminder</label>
                                                <select id="second-reminder" name="second-reminder" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                    <option selected>2 hours before</option>
                                                    <option>4 hours before</option>
                                                    <option>6 hours before</option>
                                                    <option>12 hours before</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Email Template</h3>
                                <p className="mt-1 text-sm text-gray-500">Customize the appearance of your emails</p>

                                <div className="mt-4">
                                    <label for="email-signature" className="block text-sm font-medium text-gray-700">Email Signature</label>
                                    <div className="mt-1">
                                        <textarea id="email-signature" name="email-signature" rows="4" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">Best regards,
                                            John Doe
                                            Certified Personal Trainer
                                            Phone: (555) 123-4567</textarea>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Email Header Image</label>
                                    <div className="mt-1 flex items-center">
                                        <span className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                                            <img className="h-full w-full" src="https://via.placeholder.com/150" alt="" />
                                        </span>
                                        <button type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-5">
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

export default EmailSettings