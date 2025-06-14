import React, { useContext } from 'react'
import { GlobalContext } from '../GlobalContext';
import { Link } from 'react-router-dom';

const Sidebar = (props) => {

    const { user } = useContext(GlobalContext);

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                <div className="flex items-center h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <i className="fas fa-cube text-primary-600 text-xl mr-2"></i>
                        <span className="text-xl font-semibold text-gray-900">CRMPro</span>
                    </div>
                </div>
                <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        <Link to="/dashboard" className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${props.active == 'dashboard' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} group`}>
                            <i className={`fas fa-tachometer-alt mr-3 ${props.active == 'dashboard' ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'}`}></i>
                            Dashboard
                        </Link>
                        <Link to="/clients" className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${props.active == 'clients' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} group`}>
                            <i className={`fas fa-users mr-3 ${props.active == 'clients' ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'}`}></i>
                            Clients
                        </Link>
                        <a href="#" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 group">
                            <i className="fas fa-shopping-cart mr-3 text-gray-500 group-hover:text-gray-600"></i>
                            Deals
                        </a>
                        <a href="#" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 group">
                            <i className="fas fa-calendar-alt mr-3 text-gray-500 group-hover:text-gray-600"></i>
                            Activities
                        </a>
                        <a href="#" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 group">
                            <i className="fas fa-chart-line mr-3 text-gray-500 group-hover:text-gray-600"></i>
                            Reports
                        </a>
                        <a href="#" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 group">
                            <i className="fas fa-cog mr-3 text-gray-500 group-hover:text-gray-600"></i>
                            Settings
                        </a>
                    </nav>
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <div className="flex items-center px-2">
                            {
                                user &&
                                    user.picture ?
                                    <img className="h-8 w-8 rounded-full" src={user?.picture} alt="User avatar" />
                                    :
                                    <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`} alt="User avatar" />
                            }
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                <p className="text-xs font-medium text-gray-500">Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar