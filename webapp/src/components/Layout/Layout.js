import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import { Container, Text, Flex, Box, ActionIcon, Burger, Menu } from '@mantine/core'
import { IconBrandFacebook, IconBrandX, IconBrandLinkedin } from '@tabler/icons-react';
import Logo from './logo.svg';
import GreenEnergyLogo from './green-energy-logo.png';
import styles from './Layout.module.css';

const menu = [
  {
    label: 'Grundstückbörse',
    url: '/grundstueckboerse'
  },
  // {
  //   label: 'Förderungscheck',
  //   url: '/foerderung'
  // }
  {
    label: 'Suche',
    url: '/suche'
  },
];

function useCannonical() {
  const router = useRouter();
  const { query, pathname } = router;

  // Clone the query object and track if any parameter was removed
  const canonicalQuery = { ...query };

  if (canonicalQuery.page === '1') {
    delete canonicalQuery.page;
  }
  if (canonicalQuery.sort === 'date') {
    delete canonicalQuery.sort;
  }

  // Generate the canonical URL
  const canonicalUrl = new URL(pathname, 'https://immoradar.xyz');
  Object.keys(canonicalQuery).forEach((key) => {
    canonicalUrl.searchParams.append(key, canonicalQuery[key]);
  });

  let result = canonicalUrl.href;

  // remove trailing slash
  if (result.endsWith('/')) {
    result = result.slice(0, -1);
  }

  return result;
}

const Layout = ({ children, title, description, date, noindex, image }) => {
  const canonicalUrl = useCannonical();
  const ogImage = image || '/og-image.jpg';
  const [opened, setOpened] = useState(false);
  const setNoIndex = noindex || process.env.NEXT_PUBLIC_NOINDEX === 'true';

  return <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content="https://immoradar.xyz" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ImmoRadar" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      { date && <meta property="article:published_time" content={date}></meta> }
      { date && <meta name="author" content="Vincent Will"></meta> }
      { setNoIndex && <meta name="robots" content="noindex" /> }
      { canonicalUrl && <link rel="canonical" href={canonicalUrl} /> }
      <link rel="icon" href="/favicon.svg" />
      {/* only add script if on prod */}
      {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
        <script defer src="https://analytics.vincentwill.com/script.js" data-website-id="70bfc215-0eff-4c0e-8cf0-eef7202b8af5"></script>
      )}
      <meta name="google-adsense-account" content="ca-pub-1087144186006114"></meta>
    </Head>
    <div>
      <Box as="header" height={60} className={styles.header}>
        <Container>
          <Flex justify="space-between" component="nav" py="sm">
            <Link href="/" className={styles.headerLink}>
              <Flex align="center" gap="sm">
                <Image src={Logo} width={40} height={40} alt="ImmoRadar Logo" priority />
                <Text weight={700} size="xl">ImmoRadar</Text>
              </Flex>
            </Link>

            {/* desktop menu */}
            <Flex justify="flex-end" align="center" gap="xl" display={{ base: "none", xs: "flex" }}>
              { menu.map(menuItem =>
                <Link key={menuItem.label} href={menuItem.url}>{menuItem.label}</Link>)
              }
            </Flex>

            {/* mobile menu */}
            <Menu shadow="md" display={{ base: "block", xs: "none" }} opened={opened} onChange={setOpened}>
              <Menu.Target>
                <Burger opened={opened} aria-label="Menü" />
              </Menu.Target>

              <Menu.Dropdown>
                { menu.map(menuItem =>
                  <Menu.Item key={menuItem.label}>
                     <Link href={menuItem.url}>{menuItem.label}</Link>
                  </Menu.Item>
                ) }
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Container>
      </Box>

      <Container as="main" mih="calc(100vh - 64px - 52px - 16px)">
        {children}
      </Container>

      <Box as="footer" className={styles.footer} p="md" pt="xl" pb="md">
        <Container>
          <Flex direction={{ base: "column-reverse", xs: "row" }} justify="space-between" align={{ base: "center", xs: "flex-start" }} gap="md">
            <Box>
              <Flex mb="xl" gap="sm" justify={{ base: "center", xs: "flex-start" }}>
                <ActionIcon
                  component="a"
                  href="https://www.facebook.com/profile.php?id=61566536998327"
                  variant="outline"
                  aria-label="Facebook"
                  size="md"
                >
                  <IconBrandFacebook />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://x.com/ImmoRadar_DE"
                  variant="outline"
                  aria-label="X / Twitter"
                  size="md"
                >
                  <IconBrandX />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://www.linkedin.com/company/immoradar-xyz/"
                  variant="outline"
                  aria-label="LinkedIn"
                  size="md"
                >
                  <IconBrandLinkedin />
                </ActionIcon>
              </Flex>
              <Flex gap="sm" mt="xl">
                <Image src={GreenEnergyLogo} width={40} height={40} alt="Erneuerbare Energien Logo" />
                <Text weight={700} size="xs" c="gray.7" maw="200px">Diese Webseite wird mit erneuerbarer Energie betrieben.</Text>
              </Flex>
            </Box>

            <Flex gap="xl" direction={{ base: "column", xs: "row" }}>
              <Box>
                <Link href="/budgetrechner"><Text size="sm" c="gray.7" mb="xs">Budgetrechner</Text></Link>
              </Box>

              <Box>
                <Link href="/impressum"><Text size="sm" c="gray.7" mb="xs">Impressum</Text></Link>
                <Link href="/privacy"><Text size="sm" c="gray.7" mb="xs">Datenschutz</Text></Link>
                <Link href="/about"><Text size="sm" c="gray.7" mb="xs">Über uns</Text></Link>
              </Box>
            </Flex>
          </Flex>
          <Text size="sm" c="gray.7" align="center" mt="md">© {new Date().getFullYear()} ImmoRadar</Text>
        </Container>
      </Box>
    </div>
  </>
}

export default Layout
