import React, { useState } from 'react';
import Head from "next/head";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { Text, Flex, Group, Burger, Box, Button, AppShell, Loader, Alert } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import Logo from './logo.svg';
import styles from './Layout.module.css';
import { useRouter } from 'next/router';
import Footer from './Footer';
import { IconClipboardText, IconDashboard, IconHome, IconInfoCircle, IconLogout, IconSettings } from '@tabler/icons-react';
import Image from 'next/image';

const Layout = ({ children, title, description, date, noindex, image, noPadding }) => {
  const router = useRouter();
  const ogImage = image || '/og-image.jpg';
  const [opened, { toggle }] = useDisclosure();
  const setNoIndex = noindex || process.env.NEXT_PUBLIC_NOINDEX === 'true';
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login')
    },
  })

  const isAuthenticated = session?.user?.plan === 'year'
  const isEmailConfirmed = session?.user?.confirmed

  return <>
    {/* todo move head to separate file */}
    <Head>
      <title>{`${title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {/* <meta property="og:url" content="TODO" /> */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {date && <meta property="article:published_time" content={date}></meta>}
      {date && <meta name="author" content="Vincent Will"></meta>}
      {setNoIndex && <meta name="robots" content="noindex" />}
      <link rel="icon" href="/favicon.svg" />
      {/* only add script if on prod */}
      {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
        <script defer src="https://analytics.immoradar.xyz/script.js" data-website-id="acb3ae01-3f15-496f-84f8-0d5050566fc8"></script>
      )}
      <meta name="google-adsense-account" content="ca-pub-1087144186006114"></meta>
    </Head>
    <div style={{ overflow: 'hidden' }}>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Link href="/" className={styles.headerLink}>
              <Flex align="center" gap="sm">
                <Image src={Logo} width={40} height={40} alt="Logo" priority />
                <Text fw="bold" size="xl" className={styles.headerTitle}>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</Text>
              </Flex>
            </Link>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Button fullWidth leftSection={<IconDashboard size={14} />} component={Link} href="/app" mb="md" variant={router.pathname === '/app' ? 'light' : 'white'}>
            Dashboard
          </Button>
          <Button fullWidth leftSection={<IconHome size={14} />} component={isAuthenticated ? Link : 'span'} href="/app/immobilien" mb="md" variant={router.pathname === '/app/immobilien' ? 'light' : 'white'} disabled={!isAuthenticated}>
            Immobilien
          </Button>
          <Button fullWidth leftSection={<IconClipboardText size={14} />} component={isAuthenticated ? Link : 'span'} href="/app/vertraege" mb="md" variant={router.pathname === '/app/vertraege' ? 'light' : 'white'} disabled={!isAuthenticated}>
            Mietverträge
          </Button>
          <Button fullWidth leftSection={<IconSettings size={14} />} component={isAuthenticated ? Link : 'span'} href="/app/settings" mb="md" variant={router.pathname === '/app/settings' ? 'light' : 'white'} disabled={!isAuthenticated}>
            Einstellungen
          </Button>
          <Button fullWidth leftSection={<IconLogout size={14} />} onClick={() => signOut()} variant="outline" mb="md">
            Logout
          </Button>
        </AppShell.Navbar>
        <AppShell.Main maw="1400px">
          {status === 'loading'
            ? <Flex h="70vh" w="100%" align="center" justify="center">
              <Loader size={30} />
            </Flex>
            : <Box>
              {!isEmailConfirmed && <Alert variant="light" color="orange" title="Bitte bestätige deine E-Mail Adresse" icon={<IconInfoCircle />} mb="md"></Alert>}
              {children}
            </Box>
          }
        </AppShell.Main>
      </AppShell>
      <Box pos="relative" style={{ zIndex: 1000 }} w="100%">
        <Footer />
      </Box>
    </div>
  </>
}

export default Layout
