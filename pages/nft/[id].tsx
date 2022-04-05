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
import toast, { Toaster } from 'react-hot-toast'

// Code CSS Style with Mobile First
interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [unclaimedSupply, setUnclaimedSupply] = useState<number>(0)
  const [priceInETH, setPriceInETH] = useState<string>()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)

  // Authentication
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  // Get NFT Drop Data Price
  useEffect(() => {
    if (!nftDrop) return
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInETH(claimConditions?.[0].currencyMetadata.displayValue)
    }
    fetchPrice()
  }, [nftDrop])

  // Get NFT Drop Data Supply

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

  // Mint NFT Drop
  const minNFT = () => {
    if (!nftDrop || !address) return
    const quantity = 1 //Number NFT to claim
    setLoading(true)
    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: 'green',
        fontSize: '17px',
        fontWeight: 'bolder',
        borderRadius: '5px',
        padding: '20px',
      },
    })

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt //the transaction receipt
        const claimedTokenId = tx[0].id // the id of the NFT claimed
        const claimedNFT = await tx[0].data() // get the claimed NFT metadata

        toast.custom(() => (
          <div className="pointer-events-auto mt-5 ml-5 flex w-full max-w-md rounded-lg bg-green-600 shadow-lg ring-1">
            <div className="w-0 flex-1 p-4">
              <p className="font-mediu text-sm font-bold">
                You successfully claimed your NFT! See your Transaction Details{' '}
                <Link
                  href={`https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`}
                >
                  <a target="_blank" rel="noreferrer">
                    <span className="text-white">here</span>
                  </a>
                </Link>
              </p>
            </div>
          </div>
        ))

        //   toast(
        //     `You successfully claimed your NFT! See your Transaction Details here: https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`,
        //     {
        //       duration: 8000,
        //       style: {
        //         background: 'green',
        //         color: 'white',
        //         fontSize: '17px',
        //         fontWeight: 'bolder',
        //         borderRadius: '5px',
        //         padding: '20px',
        //       },
        //     }
        //   )
      })
      .catch((err) => {
        console.log(err)
        toast('Whoops... Something went wrong.!', {
          style: {
            background: 'red',
            color: 'white',
            fontSize: '17px',
            fontWeight: 'bolder',
            borderRadius: '5px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <Toaster position="bottom-center" />
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
          onClick={minNFT}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 w-full rounded-full bg-red-500 font-bold text-white disabled:bg-gray-400"
        >
          {loading ? (
            <p className="animate-pulse ">Loading</p>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <p>SOLD OUT</p>
          ) : !address ? (
            <>Connect Wallet to Mint</>
          ) : (
            <span>Mint NFT ({priceInETH} ETH)</span>
          )}
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
