import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import API from '../../services/axios';
import Swal from 'sweetalert2';

const PaymentSettings = () => {
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState([]);
    const [pricing, setPricing] = useState([]);
    const [taxSettings, setTaxSettings] = useState({
        isEnabled: false,
        taxRate: 0
    });
    const [payoutSettings, setPayoutSettings] = useState({
        frequency: 'weekly',
        method: 'bank_transfer'
    });

    // Form states
    const [newPricing, setNewPricing] = useState({
        sessionType: '',
        duration: 60,
        price: 0,
        currency: 'USD'
    });

    useEffect(() => {
        fetchPaymentSettings();
    }, []);

    const fetchPaymentSettings = async () => {
        try {
            setLoading(true);

            const [providersRes, pricingRes, taxRes, payoutRes] = await Promise.all([
                API.get('/providers'),
                API.get('/pricing'),
                API.get('/tax'),
                API.get('/payout')
            ]);

            setProviders(providersRes.data);
            setPricing(pricingRes.data);
            setTaxSettings(taxRes.data);
            setPayoutSettings(payoutRes.data);
        } catch (err) {
            console.error('Error fetching payment settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProviderToggle = async (providerName, isConnected) => {
        try {
            if (isConnected) {
                // For demo, we're just toggling the state without real OAuth flow
                await API.post('/providers/disconnect', { providerName });
            } else {
                // In a real app, you would redirect to OAuth flow or open a modal for API keys
                await API.post('/providers/connect', {
                    providerName,
                    accountId: 'demo_account_id',
                    credentials: { token: 'demo_token' }
                });
            }
            fetchPaymentSettings();
        } catch (err) {
            console.error('Error toggling payment provider:', err);
        }
    };

    const handleAddPricing = async (e) => {
        e.preventDefault();
        try {
            await API.post('/pricing', newPricing);
            fetchPaymentSettings();
            setNewPricing({
                sessionType: '',
                duration: 60,
                price: 0,
                currency: 'USD'
            });
        } catch (err) {
            console.error('Error adding pricing:', err);
        }
    };

    const handleTaxSettingsChange = async (e) => {
        const { name, value } = e.target;

        let newValue;
        if (name === 'isEnabled') {
            newValue = value === true || value === 'true';
        } else if (name === 'taxRate') {
            newValue = parseFloat(value);
        } else {
            newValue = value;
        }

        const updatedSettings = {
            ...taxSettings,
            [name]: newValue
        };

        setTaxSettings(updatedSettings);

        try {
            await API.put('/tax', updatedSettings);
        } catch (err) {
            console.error('Error updating tax settings:', err);
        }
    };



    const handlePayoutSettingsChange = async (e) => {
        const { name, value } = e.target;

        const updatedSettings = {
            ...payoutSettings,
            [name]: value
        };

        setPayoutSettings(updatedSettings);

        try {
            await API.put('/payout', updatedSettings);

        } catch (err) {
            console.error('Error updating payout settings:', err);
        }
    };

    const handleSaveAll = async (e) => {
        e.preventDefault();
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
    };


    const deleteSession = async (id) => {
        try {
            await API.delete(`/pricing/${id}`)
            fetchPaymentSettings()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteSessionConfirm = (id) => {
        Swal.fire({
            title: "Do you want to delete This Session?",
            showDenyButton: true,
            confirmButtonText: "delete",
            denyButtonText: "Don't delete"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "", "success");
                deleteSession(id)
            }
        });
    }

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
                        <form onSubmit={handleSaveAll}>
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Providers</h3>
                                <p className="mt-1 text-sm text-gray-500">Connect your payment accounts to accept online payments</p>

                                <div className="mt-4 space-y-4">
                                    {['stripe', 'paypal'].map((provider) => {
                                        const providerData = providers.find(p => p.providerName === provider) || {
                                            providerName: provider,
                                            isConnected: false
                                        };

                                        return (
                                            <div key={provider} className="relative flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id={provider}
                                                        name={`payment-providers`}
                                                        type="checkbox"
                                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                        checked={providerData.isConnected}
                                                        onChange={() => handleProviderToggle(provider, providerData.isConnected)}
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={provider === 'stripe'
                                                                ? "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                                                                : "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"}
                                                            alt={provider}
                                                            className="h-6"
                                                        />
                                                        <span className="ml-2 font-medium text-gray-700 capitalize">{provider}</span>
                                                    </div>
                                                    <p className="text-gray-500">
                                                        {provider === 'stripe' ? 'Credit card payments' : 'PayPal payments'}
                                                    </p>
                                                    <div className="mt-2">
                                                        {providerData.isConnected ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                                                                    <circle cx={4} cy={4} r={3} />
                                                                </svg>
                                                                Connected
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                onClick={() => handleProviderToggle(provider, false)}
                                                            >
                                                                Connect Account
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
                                                            {pricing.map((item) => (
                                                                <tr key={item._id}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sessionType}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.duration} mins</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <a onClick={() => deleteSessionConfirm(item._id)} className="text-red-600 hover:text-red-900 cursor-pointer"><i className="fas fa-trash"></i></a>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Pricing Tier</h4>
                                            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700">
                                                        Session Type
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="sessionType"
                                                        id="sessionType"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        value={newPricing.sessionType}
                                                        onChange={(e) => setNewPricing({ ...newPricing, sessionType: e.target.value })}
                                                    />
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                                        Duration (mins)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="duration"
                                                        id="duration"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        value={newPricing.duration}
                                                        onChange={(e) => setNewPricing({ ...newPricing, duration: parseInt(e.target.value) })}
                                                    />
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                                        Price
                                                    </label>
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            id="price"
                                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                                            placeholder="0.00"
                                                            value={newPricing.price}
                                                            onChange={(e) => setNewPricing({ ...newPricing, price: parseFloat(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-1 flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddPricing}
                                                        className="inline-flex items-center pl-7 pr-12 sm:text-sm border-gray-300 py-2 px-3 text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Tax Settings</h3>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="isEnabled" className="block text-sm font-medium text-gray-700">Enable Taxes</label>
                                        <select
                                            id="isEnabled"
                                            name="isEnabled"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={taxSettings.isEnabled ? 'true' : 'false'} // ✅ controlled component
                                            onChange={(e) => {
                                                const newValue = e.target.value === 'true';
                                                handleTaxSettingsChange({
                                                    target: {
                                                        name: 'isEnabled',
                                                        value: newValue
                                                    }
                                                });
                                            }}
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            name="taxRate"
                                            id="taxRate"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={taxSettings.taxRate}
                                            onChange={handleTaxSettingsChange}
                                            disabled={!taxSettings.isEnabled}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Payout Settings</h3>

                                <div className="mt-4">
                                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Payout Frequency</label>
                                    <select
                                        id="frequency"
                                        name="frequency"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={payoutSettings.frequency}
                                        onChange={handlePayoutSettingsChange}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="bi-weekly">Bi-weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="method" className="block text-sm font-medium text-gray-700">Default Payout Method</label>
                                    <select
                                        id="method"
                                        name="method"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={payoutSettings.method}
                                        onChange={handlePayoutSettingsChange}
                                    >
                                        <option value="stripe_balance">Stripe Balance</option>
                                        <option value="bank_transfer">Bank Transfer (••••1234)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-5">
                                <div className="flex justify-end">
                                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Cancel
                                    </button>
                                    <button onClick={handleSaveAll} type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        } />
    );
};

export default PaymentSettings;