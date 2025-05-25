import React, { useState } from 'react';
import Head from "next/head";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { Container, Text, Flex, Box, Burger, Menu, Button } from '@mantine/core'
import Logo from './logo.svg';
import styles from './Layout.module.css';
import { useRouter } from 'next/router';
import Footer from './Footer';
import Image from 'next/image';

const authMenu = [
  {
    label: 'Login',
    url: '/login'
  }, {
    label: 'Registrieren',
    url: '/registrieren'
  }
];


const Layout = ({ children, title, description, date, noindex, image, noPadding }) => {
  const router = useRouter();
  const { query } = router;
  const ogImage = image || '/og-image.jpg';
  const [opened, setOpened] = useState(false);
  const setNoIndex = noindex || process.env.NEXT_PUBLIC_NOINDEX === 'true';
  const { data: session, status } = useSession()
  const token = query?.token
  const isLoggedIn = status === "authenticated"

  const menu = isLoggedIn ? [{
    label: 'Dashboard',
    url: '/app'
  }, {
    label: 'Logout',
    onClick: () => signOut()
  }] : authMenu.map(m => ({ ...m, url: token ? `${m.url}?token=${token}` : m.url }));

  return <>
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
    <Flex direction="column" mih="100vh" h="100%" justify="space-between" style={{ overflow: 'hidden' }}>
      <Box as="header" height={60} className={styles.header}>
        <Container size={1060}>
          <Flex justify="space-between" component="nav" py="sm">
            <Link href={isLoggedIn ? '/app' : '/'} className={styles.headerLink}>
              <Flex align="center" gap="sm">
                <Image src={Logo} width={40} height={40} alt="Logo" priority />
                <Text fw="bold" size="xl" className={styles.headerTitle}>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</Text>
              </Flex>
            </Link>

            {/* desktop menu */}
            <Flex justify="flex-end" align="center" gap="xl" display={{ base: "none", xs: "flex" }}>
              {menu.map(menuItem =>
                menuItem.onClick
                  ? <Button key={menuItem.label} onClick={menuItem.onClick} variant="outline">{menuItem.label}</Button>
                  : <Button key={menuItem.label} component={Link} href={menuItem.url} variant="white">{menuItem.label}</Button>)
              }
            </Flex>

            {/* mobile menu */}
            <Menu shadow="md" display={{ base: "block", xs: "none" }} opened={opened} onChange={setOpened}>
              <Menu.Target>
                <Burger opened={opened} aria-label="Menü" />
              </Menu.Target>

              <Menu.Dropdown px="sm">
                {menu.map(menuItem => {
                  return menuItem.onClick
                    ? <Button my="sm" key={menuItem.label} onClick={menuItem.onClick} variant="outline" fullWidth>{menuItem.label}</Button>
                    : <Menu.Item key={menuItem.label} my="sm">
                      <Button fullWidth component={Link} href={menuItem.url} variant="transparent">{menuItem.label}</Button>
                    </Menu.Item>
                }
                )}
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Container>
      </Box>

      <Container as="main" size={1060} w="100%" pos="relative" py={noPadding ? '0' : 'xl'}>
        {children}
      </Container>

      <Footer />
    </Flex>
  </>
}

export default Layout
