import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Layout = (props) => {
    return (
        <>
            <div className="bg-gray-50 font-sans">
                <div className="flex h-screen overflow-hidden">
                    <Sidebar active={props.active} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {/* Top navigation */}
                        <Header />
                        {props.content}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout