import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home({ user }) {
  // const { data: session } = useSession()
  // const router = useRouter()
  // useEffect(() => {
  //   console.log({ session })
  //   if (!session && router) {
  //     router.push('/login')
  //   }
  // }, [session, router])

  // if (!session && !router) {
  //   return <>loading...</>
  // }

  return (
    <>
      <Head>
        <title>Dashboard | ImmoRadar</title>
        <meta name="description" content="TODO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        TODO DASHBOARD
      </main>
    </>
  );
}
