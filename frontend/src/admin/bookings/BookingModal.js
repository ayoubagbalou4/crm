import React, { useState, useEffect } from 'react';
import moment from 'moment';

const BookingModal = ({
    slotInfo,
    booking,
    clients,
    onClose,
    onSave,
    onCancelBooking
}) => {
    const [formData, setFormData] = useState({
        clientId: '',
        date: '',
        time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (booking) {
            setFormData({
                clientId: booking.clientId?._id || '',
                date: booking.date,
                time: booking.time,
                notes: booking.notes || ''
            });
        } else if (slotInfo) {
            setFormData({
                clientId: '',
                date: slotInfo.date,
                time: slotInfo.time,
                notes: ''
            });
        }
    }, [booking, slotInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {booking ? 'Booking Details' : 'New Booking'}
                        </h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Close</span>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Client *
                                </label>
                                <select
                                    name="clientId"
                                    value={formData.clientId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    disabled={!!booking}
                                >
                                    <option value="">Select client</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client._id}>
                                            {client.fullName} {client.phone ? `(${client.phone})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        disabled={!!booking}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        disabled={!!booking}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!!booking && booking.status === 'cancelled'}
                                    placeholder="Any special instructions or notes..."
                                />
                            </div>

                            {booking && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <div className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {booking.status.toUpperCase()}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            {booking ? (
                                booking.status === 'confirmed' && (
                                    <button
                                        type="button"
                                        onClick={onCancelBooking}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        disabled={loading}
                                    >
                                        {loading ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )
                            ) : (
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Booking'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;