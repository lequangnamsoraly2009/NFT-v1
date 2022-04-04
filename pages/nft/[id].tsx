import React from 'react'

// Code CSS Style with Mobile First

function NFTDropPage() {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-200 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-1.5">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="nothing"
            />
          </div>
          <div className="space-y-3 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">Soraly</h1>
            <h2 className="text-xl text-gray-800">
              A collection of Soraly who live & breathe React!
            </h2>
          </div>
        </div>
      </div>
      {/* Righr Side */}
      <div className="flex flex-1 flex-col p-8 lg:col-span-6 lg:p-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              Soraly NFT
            </span>{' '}
            Market Place
          </h1>

          <button className="rounded-full bg-rose-400 py-2 px-4 text-xs font-bold text-white lg:w-56 lg:px-5 lg:py-3 lg:text-base">
            Connect to Metamask
          </button>
        </header>
        <hr className="my-3 border" />
        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://links.papareact.com/bdy"
            alt=""
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            NFT Drop | Free To Claim
          </h1>

          <p className='text-green-500 text-xl pt-2'>13/21 NFT's claimed</p>
        </div>
        {/* Footer */}
        <button className='mt-10 h-16 w-full bg-red-500 rounded-full text-white'>Mint NFT (0.01 ETH)</button>
      </div>
    </div>
  )
}

export default NFTDropPage
