import React, { useContext, useState, useEffect } from 'react';
import Layout from '../Layout';
import { GlobalContext } from '../../GlobalContext';
import API from '../../services/axios';
import Swal from 'sweetalert2';

const EditProfile = () => {
    const { user, setUser } = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: 'United States',
        timezone: '(GMT-08:00) Pacific Time (US & Canada)',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        profile: '',
        password: '',
        picture: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                country: user.country || 'United States',
                timezone: user.timezone || '(GMT-08:00) Pacific Time (US & Canada)',
                // Don't reset password fields
                currentPassword: prev.currentPassword,
                newPassword: prev.newPassword,
                confirmPassword: prev.confirmPassword
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateProfile = () => {
        if (!formData.name.trim()) {
            setErrors({ ...errors, profile: 'Name is required' });
            return false;
        }
        return true;
    };


    const [loadingProfile, setLoadingProfile] = useState(false)
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        setLoadingProfile(true);
        setErrors({ ...errors, profile: '' });

        const data = {
            name: formData.name,
            phone: formData.phone,
            country: formData.country,
            timezone: formData.timezone,
        }

        try {
            const response = await API.put('/profile', data);
            // console.log(data)

            setUser(response.data);
            if (response.data.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Profile updated successfully',
                    icon: 'success',
                    timer: 2000
                });
                window.location.reload();
            }
        } catch (err) {
            setErrors({
                ...errors,
                profile: err.response?.data?.message || 'Failed to update profile'
            });
            console.log(err)
        } finally {
            setLoadingProfile(false);
        }
    };

    const validatePassword = () => {
        if (!formData.currentPassword) {
            setErrors({ ...errors, password: 'Current password is required' });
            return false;
        }
        if (!formData.newPassword) {
            setErrors({ ...errors, password: 'New password is required' });
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setErrors({ ...errors, password: 'New passwords do not match' });
            return false;
        }
        return true;
    };


    const [loadingPassword, setLoadingPassword] = useState(false)
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoadingPassword(true);
        setErrors({ ...errors, password: '' });

        const data = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }

        try {

            console.log(data)
            const response = await API.put('/password', data);

            if (response.data && response.data.msg) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.msg,
                    icon: 'success',
                    timer: 2000
                });

                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
            setLoadingPassword(false);
        } catch (err) {
            setErrors({
                ...errors,
                password: err.response?.data?.message || err.response?.data?.msg || 'Failed to change password'
            });
            console.error('Password change error:', err);
            setLoadingPassword(false);
        }
    };



    const [loadingPicture, setLoadingPicture] = useState(false)
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setErrors({ ...errors, picture: 'Please select an image file' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB
            setErrors({ ...errors, picture: 'Image size should be less than 2MB' });
            return;
        }

        const formData = new FormData();
        formData.append('picture', file);

        try {
            setLoadingPicture(true);
            setErrors({ ...errors, picture: '' });

            const response = await API.post('/profile/picture', formData);

            setUser(response.data);
            Swal.fire({
                title: 'Success!',
                text: 'Profile picture updated',
                icon: 'success',
                timer: 2000
            });
            setLoadingPicture(false);
        } catch (err) {
            setErrors({
                ...errors,
                picture: err.response?.data?.message || 'Failed to upload image'
            });
        } finally {
            setLoadingPicture(false);
        }
    };

    return (
        <Layout active="settings" content={
            <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Update your personal information and account settings
                        </p>
                    </div>
                </div>

                {/* Error messages for each section */}
                {errors.profile && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.profile}
                    </div>
                )}

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleProfileUpdate}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Profile Photo
                                    </label>
                                    <div className="mt-2 flex items-center">
                                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">

                                            {user && user.picture ? (
                                                <img className="h-full w-full object-cover" src={user.picture} alt="User picture" />
                                            ) : (
                                                <img className="h-full w-full object-cover" src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`} alt="User picture" />
                                            )}
                                        </span>
                                        <label className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                                            {loadingPicture ? 'Uploading...' : 'Change'}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                disabled={loadingPicture}
                                            />
                                        </label>
                                    </div>
                                    {errors.picture && (
                                        <p className="mt-2 text-sm text-red-600">{errors.picture}</p>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-5">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Personal Information
                                    </h3>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                                                value={formData.email}
                                                disabled
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                Country
                                            </label>
                                            <select
                                                id="country"
                                                name="country"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.country}
                                                onChange={handleChange}
                                            >
                                                <option>United States</option>
                                                <option>Canada</option>
                                                <option>Mexico</option>
                                            </select>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                                                Timezone
                                            </label>
                                            <select
                                                id="timezone"
                                                name="timezone"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.timezone}
                                                onChange={handleChange}
                                            >
                                                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                                                <option>(GMT-07:00) Mountain Time (US & Canada)</option>
                                                <option>(GMT-06:00) Central Time (US & Canada)</option>
                                                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-5">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            disabled={loadingProfile}
                                        >
                                            {loadingProfile ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {!user?.googleId && (
                            <form onSubmit={handlePasswordChange} className="mt-12 border-t border-gray-200 pt-12">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Change Password
                                </h3>

                                {errors.password && (
                                    <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                                        {errors.password}
                                    </div>
                                )}

                                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                            Current Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            id="currentPassword"
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                            New Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            id="newPassword"
                                            required
                                            minLength="6"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        disabled={loadingPassword || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                                    >
                                        {loadingPassword ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        } />
    );
};

export default EditProfile;