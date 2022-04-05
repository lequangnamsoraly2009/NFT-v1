import Link from 'next/link'
import React from 'react'

function Search() {
  return (
    <div>
      <div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-green-600 shadow-lg ring-1 mt-5 ml-5">
        <div className="w-0 flex-1 p-4">
          <p className="font-mediu text-sm font-bold">
            You successfully claimed your NFT! See your Transaction Details{' '}
            <Link href={`https://rinkeby.etherscan.io/tx/`}>
              <span className="text-white">here</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Search
