import React from 'react'

const Loader = () => {
    return (
        <div class="flex justify-center items-center h-screen">
            <div class="cube-container w-20 h-20 relative perspective-1000">
                <div class="cube animate-spin-slow">
                    <div class="face front bg-blue-500 opacity-90"></div>
                    <div class="face back bg-blue-600 opacity-90"></div>
                    <div class="face right bg-blue-400 opacity-90"></div>
                    <div class="face left bg-blue-700 opacity-90"></div>
                    <div class="face top bg-blue-300 opacity-90"></div>
                    <div class="face bottom bg-blue-800 opacity-90"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader