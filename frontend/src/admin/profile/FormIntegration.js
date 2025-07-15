import React, { useState , useContext } from 'react'
import axios from 'axios'
import Layout from '../Layout'
import { toast } from 'react-toastify'
import { GlobalContext } from '../../GlobalContext';
import API from '../../services/axios';

const FormIntegration = () => {
    const { user, setUser } = useContext(GlobalContext);
    const [formLink, setFormLink] = useState('')
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleGenerateUrl = async (e) => {
        e.preventDefault()
        if (!formLink) {
            toast.error('Please enter a form link')
            return
        }

        setLoading(true)
        try {
            const response = await API.post('/forms', { 
                link: formLink 
            })
            
            setGeneratedUrl(response.data)
            toast.success('Authorized form URL generated successfully')
        } catch (error) {
            console.error('Error generating form URL:', error)
            toast.error('Failed to generate authorized URL')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedUrl)
        toast.success('URL copied to clipboard!')
    }

    return (
        <Layout active="formIntegration" content={
            <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Form Integration</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Generate authorized URLs for Tally or other form platforms
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleGenerateUrl}>
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Form Link Configuration
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Generate an authorized URL for form submissions
                                </p>

                                <div className="mt-4">
                                    <label htmlFor="form-link" className="block text-sm font-medium text-gray-700">
                                        Form Link
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="url"
                                            name="form-link"
                                            id="form-link"
                                            className="p-3 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                            placeholder="https://tally.so/forms/your-form-id"
                                            value={formLink}
                                            onChange={(e) => setFormLink(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {generatedUrl && (
                                    <div className="mt-4">
                                        <label htmlFor="generated-url" className="block text-sm font-medium text-gray-700">
                                            Authorized Form URL
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="generated-url"
                                                id="generated-url"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                                value={generatedUrl}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={copyToClipboard}
                                                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            This URL includes an authorization token that will expire in 7 days.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-5">
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating...
                                            </>
                                        ) : 'Generate Authorized URL'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Integration Instructions</h3>
                        <div className="mt-4 text-sm text-gray-700">
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Enter your Tally or other form platform URL above</li>
                                <li>Click "Generate Authorized URL" to create a token-secured link</li>
                                <li>Use this URL in your form platform's redirect settings</li>
                                <li>When users submit the form, our system will verify the token</li>
                            </ol>
                            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                <h4 className="font-medium text-gray-900">Example Tally.so Setup:</h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    1. In Tally, go to your form's "Connect" tab<br />
                                    2. Under "Redirect after submit", paste your generated URL<br />
                                    3. Save the form settings
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } />
    )
}

export default FormIntegration