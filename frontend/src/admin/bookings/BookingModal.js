import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { format } from "date-fns";

const BookingModal = ({
    slotInfo,
    booking,
    clients,
    sessionPricing,
    onClose,
    onSave,
    onCancelBooking,
    trainerSettings
}) => {
    const [formData, setFormData] = useState({
        clientId: '',
        SessionPricingId: '',
        date: '',
        time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);

    // Generate available time slots based on trainer settings
    const generateAvailableSlots = (date) => {
        if (!trainerSettings || !date) return [];

        const dayName = moment(date).format('dddd').toLowerCase();
        if (!trainerSettings.daysAvailable[dayName]) return [];

        const slots = [];
        const startTime = moment(trainerSettings.startTime, 'HH:mm');
        const endTime = moment(trainerSettings.endTime, 'HH:mm');
        const breakStart = moment(trainerSettings.breakStart, 'HH:mm');
        const breakEnd = moment(trainerSettings.breakEnd, 'HH:mm');
        const duration = trainerSettings.sessionDuration;
        const buffer = trainerSettings.bufferTime;

        let currentSlot = startTime.clone();

        while (currentSlot.isBefore(endTime)) {
            // Skip break time
            if (currentSlot.isBetween(breakStart, breakEnd)) {
                currentSlot = breakEnd.clone();
                continue;
            }

            // Check if slot would go past end time
            const slotEnd = currentSlot.clone().add(duration, 'minutes');
            if (slotEnd.isAfter(endTime)) break;

            // Format the time for display and value
            const timeValue = currentSlot.format('HH:mm');
            const timeDisplay = currentSlot.format('h:mm A');

            slots.push({
                value: timeValue,
                display: timeDisplay,
                available: true
            });

            currentSlot.add(duration + buffer, 'minutes');
        }

        return slots;
    };

    useEffect(() => {
        if (booking) {
            setFormData({
                clientId: booking.clientId?._id || '',
                SessionPricingId: booking.SessionPricingId?._id || '',
                date: booking.date ? booking.date.split('T')[0] : '',
                time: booking.time,
                notes: booking.notes || ''
            });
        } else if (slotInfo) {
            const date = slotInfo.date ? slotInfo.date.split('T')[0] : '';
            setFormData({
                clientId: '',
                SessionPricingId: '',
                date: date,
                time: slotInfo.time,
                notes: ''
            });

            // Generate available slots when date changes
            if (date) {
                const slots = generateAvailableSlots(date);
                setAvailableSlots(slots);
            }
        }
    }, [booking, slotInfo]);

    // Update available slots when date changes
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'date' && value) {
            const slots = generateAvailableSlots(value);
            setAvailableSlots(slots);

            // Reset time if no slots available or if current time isn't in available slots
            if (slots.length === 0 || !slots.some(slot => slot.value === formData.time)) {
                setFormData(prev => ({ ...prev, time: slots[0]?.value || '' }));
            }
        }
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
                                    onChange={handleDateChange}
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
                                <select
                                    name="SessionPricingId"
                                    value={formData.SessionPricingId}
                                    onChange={handleDateChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    disabled={!!booking}
                                >
                                    <option value="">Select Session</option>
                                    {sessionPricing.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.sessionType} - {s.duration} min - {s.price} $
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
                                        onChange={handleDateChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        disabled={!!booking}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time *
                                    </label>
                                    {booking ? (
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleDateChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            disabled
                                        />
                                    ) : (
                                        <select
                                            name="time"
                                            value={formData.time}
                                            onChange={handleDateChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select time</option>
                                            {availableSlots.length > 0 ? (
                                                availableSlots.map(slot => (
                                                    <option key={slot.value} value={slot.value}>
                                                        {slot.display}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>
                                                    No available slots for this day
                                                </option>
                                            )}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleDateChange}
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
                                    <div className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
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
                                    disabled={loading || availableSlots.length === 0}
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