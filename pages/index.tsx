import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typing'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT Drop Collection</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-10 text-4xl font-extralight">
        The{' '}
        <span className="font-extrabold underline decoration-pink-600/50">
          Soraly NFT
        </span>{' '}
        Market Place
      </h1>

      <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => {
            return (
              <Link href={`/nft/${collection.slug.current}`}>
                <div className="flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-75">
                  <img
                    className="h-96 w-60 rounded-xl object-cover"
                    src={urlFor(collection.mainImage).url()}
                    alt=""
                  />

                  <div>
                    <h2 className="mt-2 text-3xl font-bold text-center ">
                      {collection.nftCollectionName}
                    </h2>
                    <p className="mt-2 text-center text-sm  font-extralight text-gray-700">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `
  *[_type=="collection"]{
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
  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}
