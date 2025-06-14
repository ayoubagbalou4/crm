import React, { useContext } from 'react'
import { GlobalContext } from '../GlobalContext';

const Header = () => {

    const { user } = useContext(GlobalContext);


    return (
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
                <button className="md:hidden text-gray-500 focus:outline-none">
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="ml-4 text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button className="text-gray-500 focus:outline-none">
                        <i className="fas fa-bell"></i>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                </div>
                <div className="relative">
                    <button className="text-gray-500 focus:outline-none">
                        <i className="fas fa-envelope"></i>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500"></span>
                    </button>
                </div>
                <div className="relative">
                    <button className="flex items-center text-sm focus:outline-none">
                        {
                            user &&
                            user.picture ?
                                <img className="h-8 w-8 rounded-full" src={user?.picture} alt="User avatar" />
                                :
                                <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`} alt="User avatar" />
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header