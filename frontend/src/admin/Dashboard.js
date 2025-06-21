import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import API from "../services/axios";

const Dashboard = () => {

    const [stats, setStats] = useState({ clients: 0, bookings: 0 });

    useEffect(() => {
        API.get("/stats")
            .then((res) => setStats(res.data))
            .catch((err) => console.error(err));
    }, []);


    return (
        <>
            <Layout active="dashboard" content={
                <>
                    {/* Main content area */}
                    <div className="flex-1 overflow-auto p-4 bg-gray-50">
                        {/* Stats cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Clients</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.clients}</p>
                                        <p className="text-xs text-green-500 mt-1">
                                            <i className="fas fa-arrow-up mr-1"></i> 12.5% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-primary-50 text-primary-600">
                                        <i className="fas fa-users text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Bookingd</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.bookings}</p>
                                        <p className="text-xs text-green-500 mt-1">
                                            <i className="fas fa-arrow-up mr-1"></i> 5.3% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                                        <i className="fas fa-calendar-alt text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Revenue</p>
                                        <p className="text-2xl font-semibold text-gray-900">$124,850</p>
                                        <p className="text-xs text-red-500 mt-1">
                                            <i className="fas fa-arrow-down mr-1"></i> 2.1% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                        <i className="fas fa-dollar-sign text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                                        <p className="text-2xl font-semibold text-gray-900">36/48</p>
                                        <p className="text-xs text-green-500 mt-1">
                                            <i className="fas fa-arrow-up mr-1"></i> 8.7% from last month
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                                        <i className="fas fa-check-circle text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts and main content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Revenue chart */}
                            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                                    <div className="flex items-center space-x-2">
                                        <button className="px-3 py-1 text-xs bg-primary-50 text-primary-600 rounded-full">Monthly</button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Quarterly</button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Yearly</button>
                                    </div>
                                </div>
                                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                    {/* Chart placeholder - would be replaced with actual chart library */}
                                    <p className="text-gray-400">Revenue chart visualization</p>
                                </div>
                            </div>

                            {/* Sales funnel */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Prospects</span>
                                            <span className="font-medium">1,248</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Qualified Leads</span>
                                            <span className="font-medium">842</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Meetings</span>
                                            <span className="font-medium">492</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "39%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Proposals</span>
                                            <span className="font-medium">184</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Closed Won</span>
                                            <span className="font-medium">84</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "7%" }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Conversion Rate</span>
                                        <span className="font-medium text-primary-600">6.7%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent activities and top customers */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent activities */}
                            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                <i className="fas fa-check"></i>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Deal closed</p>
                                            <p className="text-sm text-gray-500">Acme Corp - $12,500</p>
                                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Call with client</p>
                                            <p className="text-sm text-gray-500">John Smith - Follow up meeting scheduled</p>
                                            <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                                <i className="fas fa-exclamation"></i>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Task overdue</p>
                                            <p className="text-sm text-gray-500">Send proposal to Tech Solutions Inc</p>
                                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                                <i className="fas fa-calendar-check"></i>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Meeting completed</p>
                                            <p className="text-sm text-gray-500">Discovery call with Global Enterprises</p>
                                            <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                <i className="fas fa-times"></i>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Deal lost</p>
                                            <p className="text-sm text-gray-500">XYZ Corporation - $8,000</p>
                                            <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">View all activities</button>
                                </div>
                            </div>

                            {/* Top customers */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Acme+Corp&background=0ea5e9&color=fff" alt="Acme Corp" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Acme Corp</p>
                                            <p className="text-sm text-gray-500">$42,500 total</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">VIP</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Global+Tech&background=0ea5e9&color=fff" alt="Global Tech" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Global Tech</p>
                                            <p className="text-sm text-gray-500">$28,750 total</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Innovate+Inc&background=0ea5e9&color=fff" alt="Innovate Inc" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Innovate Inc</p>
                                            <p className="text-sm text-gray-500">$19,200 total</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Tech+Solutions&background=0ea5e9&color=fff" alt="Tech Solutions" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Tech Solutions</p>
                                            <p className="text-sm text-gray-500">$15,800 total</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Digital+Wave&background=0ea5e9&color=fff" alt="Digital Wave" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Digital Wave</p>
                                            <p className="text-sm text-gray-500">$12,300 total</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">View all customers</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            />
        </>
    )
}

export default Dashboard