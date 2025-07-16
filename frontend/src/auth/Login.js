import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import API from '../services/axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            })
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsSubmitting(true)

        try {
            const response = await API.post('/login', {
                email: formData.email,
                password: formData.password
            }
            )

            const data = await response.data

            if (!data.token) {
                throw new Error(data.message || 'Login failed')
            }

            localStorage.setItem('token', data.token)

            if (formData.rememberMe) {
                localStorage.setItem('rememberMe', 'true')
            } else {
                localStorage.removeItem('rememberMe')
            }

            navigate('/dashboard')
            window.location.reload()
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message ||
                    error.message ||
                    'Login failed. Please try again.'
            })
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }


    const handleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        const res = await API.post('/api/auth/google', {
            token: credential,
        });

        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
        window.location.reload();
    };

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <i className="fas fa-cube text-blue-600 text-5xl"></i>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">start your 14-day free trial</Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {errors.submit && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                                {errors.submit}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-envelope text-gray-400"></i>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`py-2 pl-10 block w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-gray-400"></i>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`py-2 pl-10 block w-full border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div>
                                    {/* <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <i className="fab fa-google text-red-500"></i>
                                    </a> */}
                                    <GoogleLogin
                                        onSuccess={handleSuccess}
                                        onError={() => console.log('Login Failed')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login