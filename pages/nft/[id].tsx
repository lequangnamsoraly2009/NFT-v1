import React from 'react'

// Code CSS Style with Mobile First

function NFTDropPage() {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-200 to-rose-500 lg:col-span-4">
        <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
          <div className='bg-gradient-to-br from-yellow-400 to-purple-600 p-1.5 rounded-xl'>
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="nothing"
            />
          </div>
          <div className='text-center p-5 space-y-3'>
            <h1 className="text-4xl font-bold text-white">Soraly</h1>
            <h2 className="text-xl text-gray-800">
              A collection of Soraly who live & breathe React!
            </h2>
          </div>
        </div>
      </div>
      {/* Righr Side */}
      <div className="flex flex-col"></div>
    </div>
  )
}

export default NFTDropPage
