import Head from 'next/head'
import Link from 'next/link'
import Banner from '../components/Banner'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Posts {
  posts: Post[]
}

export default function Home({ posts }: Posts) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link
          rel="icon"
          href="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Medium_logo_Monogram.svg/1200px-Medium_logo_Monogram.svg.png"
        />
      </Head>
      <div>
        <Header />
        <Banner />
        <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:p-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group cursor-pointer overflow-hidden rounded-lg border">
                {post.mainImage && (
                  <img
                    className="ease-in-ou h-60 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    src={urlFor(post.mainImage).url()!}
                    alt={post.title}
                  />
                )}
                <div className="flex justify-between bg-white p-5">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  {post.author.image && (
                    <img
                      className="h-12 w-12 rounded-full"
                      src={urlFor(post.author.image).url()!}
                      alt={post.author.name}
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
   
    author -> {
    name,
    image
  },
  description,
  mainImage,
  slug,
  }`

  const posts = await sanityClient.fetch(query)

  return { props: { posts } }
}
