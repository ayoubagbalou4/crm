import React from 'react'
import Layout from '../Layout'

const PaymentSettings = () => {
    return (
        <Layout active="payments" content={
            <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Payment Settings</h1>
                        <p className="mt-2 text-sm text-gray-700">Configure your payment methods and pricing</p>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form>
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Providers</h3>
                                <p className="mt-1 text-sm text-gray-500">Connect your payment accounts to accept online payments</p>

                                <div className="mt-4 space-y-4">

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="stripe" name="payment-providers[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <div className="flex items-center">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                                                <span className="ml-2 font-medium text-gray-700">Stripe</span>
                                            </div>
                                            <p className="text-gray-500">Credit card payments</p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <i className="fas fa-check-circle text-green-500 mr-1"></i>
                                                    Connected
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="paypal" name="payment-providers[]" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <div className="flex items-center">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                                                <span className="ml-2 font-medium text-gray-700">PayPal</span>
                                            </div>
                                            <p className="text-gray-500">PayPal payments</p>
                                            <div className="mt-2">
                                                <button type="button" className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Connect Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Session Pricing</h3>
                                <p className="mt-1 text-sm text-gray-500">Set your default pricing for different session types</p>

                                <div className="mt-4">
                                    <div className="flex flex-col">
                                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Type</th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                                <th scope="col" className="relative px-6 py-3">
                                                                    <span className="sr-only">Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Personal Training</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">60 mins</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$120.00</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Group Class</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">60 mins</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$80.00</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nutrition Consultation</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45 mins</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$90.00</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <i className="fas fa-plus mr-1"></i> Add Pricing Tier
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Tax Settings</h3>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label for="tax-enabled" className="block text-sm font-medium text-gray-700">Enable Taxes</label>
                                        <select id="tax-enabled" name="tax-enabled" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                            <option>No</option>
                                            <option selected>Yes</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label for="tax-rate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                                        <input type="text" name="tax-rate" id="tax-rate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="8.25" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Payout Settings</h3>

                                <div className="mt-4">
                                    <label for="payout-frequency" className="block text-sm font-medium text-gray-700">Payout Frequency</label>
                                    <select id="payout-frequency" name="payout-frequency" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option>Daily</option>
                                        <option selected>Weekly</option>
                                        <option>Bi-weekly</option>
                                        <option>Monthly</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label for="payout-method" className="block text-sm font-medium text-gray-700">Default Payout Method</label>
                                    <select id="payout-method" name="payout-method" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option>Stripe Balance</option>
                                        <option selected>Bank Transfer (••••1234)</option>
                                    </select>
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

export default PaymentSettings