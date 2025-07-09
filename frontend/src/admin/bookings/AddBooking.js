import React, { useEffect, useState } from "react";
import API from "../../services/axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Layout from '../Layout';
import moment from 'moment';
import Swal from 'sweetalert2';

const AddBooking = () => {
    const { id } = useParams()
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        clientId: id ? id : "",
        SessionPricingId: "",
        date: "",
        time: "",
        notes: ""
    });
    const [trainerSettings, setTrainerSettings] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availableDays, setAvailableDays] = useState([]);
    const [sessionPricing, setSessionPricing] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [clientsRes, settingsRes, pricingRes] = await Promise.all([
                    API.get("/clients"),
                    API.get("/settings"),
                    API.get("/pricing")
                ]);
                setClients(clientsRes.data.clients || []);
                setTrainerSettings(settingsRes.data);
                setSessionPricing(pricingRes.data);
                
                // Set available days based on trainer settings
                if (settingsRes.data) {
                    const days = Object.entries(settingsRes.data.daysAvailable)
                        .filter(([day, available]) => available)
                        .map(([day]) => day);
                    setAvailableDays(days);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Generate available time slots based on selected date and trainer settings
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
                display: timeDisplay
            });
            
            currentSlot.add(duration + buffer, 'minutes');
        }
        
        return slots;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // When date changes, update available time slots
        if (name === 'date') {
            const slots = generateAvailableSlots(value);
            setAvailableSlots(slots);
            
            // Reset time if no slots available or if current time isn't in available slots
            if (slots.length === 0 || !slots.some(slot => slot.value === form.time)) {
                setForm(prev => ({ ...prev, time: slots[0]?.value || '' }));
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        // Check if selected day is available
        const dayName = moment(form.date).format('dddd').toLowerCase();
        if (!trainerSettings.daysAvailable[dayName]) {
            Swal.fire({
                title: 'Day Not Available',
                text: 'The trainer is not available on the selected day',
                icon: 'error'
            });
            return;
        }
        
        // Check if selected time is within available slots
        const isValidTime = availableSlots.some(slot => slot.value === form.time);
        if (!isValidTime) {
            Swal.fire({
                title: 'Time Not Available',
                text: 'The selected time is not available for booking',
                icon: 'error'
            });
            return;
        }

        try {
            setLoading(true);
            await API.post("/bookings", form);
            Swal.fire({
                title: 'Success!',
                text: 'Booking created successfully',
                icon: 'success'
            }).then(() => {
                navigate("/bookings");
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    // Check if a date is available (not in the past and on an available day)
    const isDateAvailable = (date) => {
        if (!date) return false;
        
        const selectedDate = moment(date);
        const today = moment().startOf('day');
        
        // Date must be today or in the future
        if (selectedDate.isBefore(today)) return false;
        
        // Check if day is available
        const dayName = selectedDate.format('dddd').toLowerCase();
        return trainerSettings?.daysAvailable[dayName] || false;
    };

    return (
        <Layout active="bookings" content={
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Booking</h2>
                    <Link
                        to="/bookings"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <i className="fas fa-arrow-left mr-2"></i> Back to Bookings
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                                <select
                                    name="clientId"
                                    value={form.clientId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select client</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.fullName} {c.phone ? `(${c.phone})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
                                <select
                                    name="SessionPricingId"
                                    value={form.SessionPricingId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select Session</option>
                                    {sessionPricing.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.sessionType} - {s.duration} min - {s.price} $
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                    disabled={loading}
                                    min={moment().format('YYYY-MM-DD')}
                                />
                                {form.date && !isDateAvailable(form.date) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        Trainer is not available on this day
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                                {form.date && isDateAvailable(form.date) ? (
                                    <select
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        required
                                        disabled={loading || availableSlots.length === 0}
                                    >
                                        <option value="">Select time</option>
                                        {availableSlots.map(slot => (
                                            <option key={slot.value} value={slot.value}>
                                                {slot.display}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="time"
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        disabled
                                    />
                                )}
                                {form.date && isDateAvailable(form.date) && availableSlots.length === 0 && (
                                    <p className="mt-1 text-sm text-red-600">
                                        No available time slots for this day
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate("/bookings")}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading || !form.date || !isDateAvailable(form.date) || availableSlots.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i> Save Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default AddBooking;