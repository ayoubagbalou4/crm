import React from 'react'

const LandingPage = () => {
    return (
        <div className="font-sans antialiased text-gray-800">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <i className="fas fa-calendar-check text-indigo-600 text-2xl mr-2"></i>
                                <span className="text-xl font-bold text-indigo-600">Coachly</span>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
                            <a href="#features" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Features</a>
                            <a href="#testimonials" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Testimonials</a>
                            <a href="#pricing" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Pricing</a>
                        </div>
                        <div className="flex items-center">
                            <a href="/login" className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Start Free Trial
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Your Clients. Your Calendar.</span>
                            <span className="block text-indigo-600">All in One Place.</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            The complete booking and client management system designed specifically for coaches, therapists, and wellness professionals.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <a href="#cta" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                    Try Free for 14 Days
                                </a>
                            </div>
                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                    Watch Demo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">
                        Trusted by professionals worldwide
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
                        <div className="col-span-1 flex justify-center">
                            <img className="h-12" src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Tuple" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <img className="h-12" src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg" alt="Mirage" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <img className="h-12" src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="StaticKit" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <img className="h-12" src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg" alt="Transistor" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <img className="h-12" src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg" alt="Workcation" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="features" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage your practice
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Designed specifically for coaches, trainers, and therapists to save time and look professional.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <i className="fas fa-users text-xl"></i>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Client Management</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Keep all client information organized in one place:
                                    </p>
                                    <ul className="mt-2 list-disc list-inside text-gray-500">
                                        <li>Contact details & history</li>
                                        <li>Session notes & progress tracking</li>
                                        <li>Quick access to past interactions</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <i className="fas fa-calendar-alt text-xl"></i>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Smart Booking System</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        A calendar that works the way you do:
                                    </p>
                                    <ul className="mt-2 list-disc list-inside text-gray-500">
                                        <li>Set your availability in seconds</li>
                                        <li>Automatic double-booking prevention</li>
                                        <li>Views for day, week, or month</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <i className="fas fa-bell text-xl"></i>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Automated Reminders</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Reduce no-shows with automatic reminders:
                                    </p>
                                    <ul className="mt-2 list-disc list-inside text-gray-500">
                                        <li>Email or SMS notifications</li>
                                        <li>Customizable timing and messages</li>
                                        <li>Confirmations when appointments are booked</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <i className="fas fa-chart-line text-xl"></i>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Dashboard & Analytics</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Understand your business at a glance:
                                    </p>
                                    <ul className="mt-2 list-disc list-inside text-gray-500">
                                        <li>Upcoming appointments</li>
                                        <li>Client retention metrics</li>
                                        <li>Revenue tracking (with payments)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <i className="fas fa-credit-card text-xl"></i>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Processing</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Optional integrations to get paid faster:
                                    </p>
                                    <ul className="mt-2 list-disc list-inside text-gray-500">
                                        <li>Stripe and PayPal ready</li>
                                        <li>Secure client payment details</li>
                                        <li>Automated invoices and receipts</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <i className="fas fa-mobile-alt text-xl"></i>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Mobile Friendly</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Manage your practice from anywhere:
                                    </p>
                                    <ul className="mt-2 list-disc list-inside text-gray-500">
                                        <li>Fully responsive design</li>
                                        <li>Add appointments on-the-go</li>
                                        <li>Client lookup from your phone</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="testimonials" className="bg-indigo-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="block">Trusted by professionals like you</span>
                    </h2>
                </div>
                <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-8 sm:p-10 sm:pb-6">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                        <div className="-mt-6">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500">
                                                    <i className="fas fa-user text-white text-xl"></i>
                                                </span>
                                                <span className="ml-4 text-base font-medium text-gray-900">Sarah K.</span>
                                                <span className="ml-auto text-sm font-medium text-indigo-600">Life Coach</span>
                                            </div>
                                            <blockquote className="mt-6">
                                                <p className="text-base text-gray-600">
                                                    &ldquo;Coachly has cut my admin time in half. I can now focus on my clients instead of paperwork. The booking system is intuitive and my clients love how professional it looks.&rdquo;
                                                </p>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                        <div className="-mt-6">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500">
                                                    <i className="fas fa-user text-white text-xl"></i>
                                                </span>
                                                <span className="ml-4 text-base font-medium text-gray-900">Michael T.</span>
                                                <span className="ml-auto text-sm font-medium text-indigo-600">Personal Trainer</span>
                                            </div>
                                            <blockquote className="mt-6">
                                                <p className="text-base text-gray-600">
                                                    &ldquo;The automatic reminders have reduced my no-shows by 80%. I've tried other systems but Coachly is the only one that understands what fitness professionals need.&rdquo;
                                                </p>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                        <div className="-mt-6">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500">
                                                    <i className="fas fa-user text-white text-xl"></i>
                                                </span>
                                                <span className="ml-4 text-base font-medium text-gray-900">Dr. Lisa M.</span>
                                                <span className="ml-auto text-sm font-medium text-indigo-600">Therapist</span>
                                            </div>
                                            <blockquote className="mt-6">
                                                <p className="text-base text-gray-600">
                                                    &ldquo;My practice runs smoother than ever. Having client notes and scheduling in one secure place has been a game-changer. The dashboard helps me track my business health at a glance.&rdquo;
                                                </p>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="pricing" className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Simple, transparent pricing</h2>
                        <p className="mt-5 text-xl text-gray-500 text-center">Start for free. Upgrade when you're ready.</p>
                        <div className="relative mt-12 bg-white rounded-lg shadow-lg">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    Limited Time Offer
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Starter</h3>
                                    <p className="mt-4">
                                        <span className="text-4xl font-extrabold text-gray-900">$0</span>
                                        <span className="text-base font-medium text-gray-500">/month</span>
                                    </p>
                                    <p className="mt-4 text-sm text-gray-500">
                                        Perfect for getting started
                                    </p>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Up to 5 active clients</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Basic scheduling</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Client notes</p>
                                        </li>
                                    </ul>
                                    <div className="mt-8">
                                        <a href="#cta" className="block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                            Get Started
                                        </a>
                                    </div>
                                </div>

                                <div className="border-2 border-indigo-500 rounded-lg shadow-xl p-6 relative">
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white">
                                            Most Popular
                                        </span>
                                    </div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Professional</h3>
                                    <p className="mt-4">
                                        <span className="text-4xl font-extrabold text-gray-900">$29</span>
                                        <span className="text-base font-medium text-gray-500">/month</span>
                                    </p>
                                    <p className="mt-4 text-sm text-gray-500">
                                        Everything you need to grow
                                    </p>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Unlimited clients</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Advanced scheduling</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Email/SMS reminders</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Dashboard analytics</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Payment integrations</p>
                                        </li>
                                    </ul>
                                    <div className="mt-8">
                                        <a href="#cta" className="block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                            Start Free Trial
                                        </a>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Lifetime</h3>
                                    <p className="mt-4">
                                        <span className="text-4xl font-extrabold text-gray-900">$499</span>
                                        <span className="text-base font-medium text-gray-500">one time</span>
                                    </p>
                                    <p className="mt-4 text-sm text-gray-500">
                                        Pay once, use forever
                                    </p>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">All Professional features</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">No monthly fees</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Priority support</p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                            <p className="ml-3 text-base text-gray-500">Future updates included</p>
                                        </li>
                                    </ul>
                                    <div className="mt-8">
                                        <a href="#cta" className="block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                            Grab This Deal
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="cta" className="bg-indigo-700">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to simplify your practice?</span>
                        <span className="block">Start your free trial today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200">
                        No credit card required. Cancel anytime.
                    </p>
                    <a href="#" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto">
                        Sign up for free
                    </a>
                </div>
            </div>

            <footer className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
                        <div className="flex justify-center space-x-6 md:order-2">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Facebook</span>
                                <i className="fab fa-facebook text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Instagram</span>
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                        </div>
                        <div className="mt-8 md:mt-0 md:order-1">
                            <p className="text-center text-base text-gray-400">
                                &copy; 2023 Coachly. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage