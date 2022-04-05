import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import type { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typing'
import Link from 'next/link'
import { BigNumber } from 'ethers'

// Code CSS Style with Mobile First
interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [unclaimedSupply, setUnclaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)

  // Authentication
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)
      const claimed = await nftDrop.getAllClaimed()
      const unclaimed = await nftDrop.getAllUnclaimed()
      const total = await nftDrop.totalSupply()
      setClaimedSupply(claimed.length)
      setUnclaimedSupply(unclaimed.length)
      setTotalSupply(total)
      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-200 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-1.5">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.mainImage).url()}
              alt="nothing"
            />
          </div>
          <div className="space-y-3 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-800">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* Righr Side */}
      <div className="flex flex-1 flex-col p-8 lg:col-span-6 lg:p-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{' '}
              <span className="font-extrabold underline decoration-pink-600/50">
                Soraly NFT
              </span>{' '}
              Market Place
            </h1>
          </Link>
          {address ? (
            <>
              <button
                className="rounded-full bg-rose-400 py-2 px-4 text-xs font-bold text-white lg:w-56 lg:px-5 lg:py-3 lg:text-base"
                onClick={disconnect}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="rounded-full bg-rose-400 py-2 px-4 text-xs font-bold text-white lg:w-56 lg:px-5 lg:py-3 lg:text-base"
              onClick={connectWithMetamask}
            >
              Connect to Metamask
            </button>
          )}
        </header>
        <hr className="my-3 border" />

        {address && (
          <p className="text-center text-sm text-red-600">
            You're logged in with wallet {address.substring(0, 4)}.....
            {address.substring(address.length - 5)}
          </p>
        )}
        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-60"
            src={urlFor(collection.previewImage).url()}
            alt=""
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {' '}
            {collection.title}
          </h1>
          {loading ? (
            <p className="animate-bounce pt-2 text-xl text-rose-500">
              Loading Supply Count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply}/{totalSupply?.toString()} NFT's claimed -{' '}
              {unclaimedSupply} NFT's remaining
            </p>
          )}

          {loading && (
            <img
              className="h-20 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt=""
            />
          )}
        </div>
        {/* Footer */}
        <button
          disabled={loading || claimedSupply === totalSupply?.toNumber() || !address}
          className="disabled:bg-gray-400 mt-10 h-16 w-full rounded-full bg-red-500 font-bold text-white"
        >
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type=="collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage{
    asset
  },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator->{
      _id,
      bio,
      image{
        asset
      },
      name,
      address,
      slug{
      current
    },
    },
  }
  `

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
