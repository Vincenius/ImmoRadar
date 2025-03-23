import React, { useState } from 'react';
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { Container, Text, Flex, Box, Burger, Menu, Button } from '@mantine/core'
// import Logo from './logo.svg';
import GreenEnergyLogo from './green-energy-logo.png';
import styles from './Layout.module.css';
import { useRouter } from 'next/router';

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
      <title>{title} | {process.env.NEXT_PUBLIC_WEBSITE_NAME}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {/* <meta property="og:url" content="TODO" /> */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fertighaus Radar" />
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
      <Box as="header" height={60} className={styles.header}>
        <Container size={1060}>
          <Flex justify="space-between" component="nav" py="sm">
            <Link href={isLoggedIn ? '/app' : '/'} className={styles.headerLink}>
              <Flex align="center" gap="sm">
                {/* <Image src={Logo} width={40} height={40} alt="Logo" priority /> */}
                <Text weight={700} size="xl">{process.env.NEXT_PUBLIC_WEBSITE_NAME}</Text>
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

      <Container as="main" size={1060} mih="calc(100vh - 140px)" pos="relative" py={noPadding ? '0' : 'xl'}>
        {children}
      </Container>

      <Box as="footer" className={styles.footer} p="md" pt="xl" pb="md">
        <Container size={1060}>
          <Flex direction={{ base: "column-reverse", xs: "row" }} justify="space-between" align={{ base: "center", xs: "flex-start" }} gap="md">
            <Box>
              <Flex gap="sm" mt="sm">
                <Image src={GreenEnergyLogo} width={40} height={40} alt="Erneuerbare Energien Logo" />
                <Text weight={700} size="xs" c="gray.7" maw="200px">Diese Webseite wird mit erneuerbarer Energie betrieben.</Text>
              </Flex>
            </Box>

            <Flex gap="xl" direction={{ base: "column", xs: "row" }}>
              <Box>
                <Link href="/impressum"><Text size="sm" c="gray.7" mb="xs">Impressum</Text></Link>
                <Link href="/datenschutz"><Text size="sm" c="gray.7" mb="xs">Datenschutz</Text></Link>
              </Box>
            </Flex>
          </Flex>
          <Text size="sm" c="gray.7" align="center" mt="md">© {new Date().getFullYear()} {process.env.NEXT_PUBLIC_WEBSITE_NAME}</Text>
        </Container>
      </Box>
    </div>
  </>
}

export default Layout
