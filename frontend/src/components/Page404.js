import React from 'react'

const Page404 = () => {
    return (
        <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
            <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex-shrink-0 flex justify-center">
                    <i className="fas fa-exclamation-circle text-6xl text-indigo-600"></i>
                </div>
                <div className="py-8 text-center">
                    <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found.</h1>
                    <p className="mt-4 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
                    <div className="mt-6">
                        <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <i className="fas fa-home mr-2"></i> Go back home
                        </a>
                    </div>
                </div>
            </main>
            <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-center space-x-4">
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">Contact Support</a>
                    <span className="inline-block border-l border-gray-300" aria-hidden="true"></span>
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">Status</a>
                    <span className="inline-block border-l border-gray-300" aria-hidden="true"></span>
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">Twitter</a>
                </nav>
            </footer>
        </div>
    )
}

export default Page404