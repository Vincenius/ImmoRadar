import React from 'react';
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import { Container, Text, Flex, Indicator, Box } from '@mantine/core';
import Logo from './logo.svg';
import styles from './Layout.module.css';

const Layout = ({ children, title, description }) => {
  return <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-image.jpg" />
      <meta property="og:url" content="https://immoradar.xyz" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/og-image.jpg" />
      <link rel="icon" href="/favicon.svg" />
      {/* only add script if on prod */}
      {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
        <script defer src="https://analytics.vincentwill.com/script.js" data-website-id="70bfc215-0eff-4c0e-8cf0-eef7202b8af5"></script>
      )}
    </Head>
    <div>
      <Box as="header" height={60} className={styles.header}>
        <Container>
          <Flex justify="space-between" component="nav" py="sm">
            <Link href="/" className={styles.headerLink}>
              <Flex align="center" gap="sm">
                <Image src={Logo} width={40} height={40} alt="ImmoRadar Logo" priority />
                <Indicator inline label="Beta" size={16}>
                  <Text weight={700} size="xl">ImmoRadar</Text>
                </Indicator>
              </Flex>
            </Link>

            <Flex justify="flex-end" align="center">
              <Link href="/about">Über uns</Link>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container as="main" mih="calc(100vh - 64px - 52px - 16px)">
        {children}
      </Container>

      <Box as="footer" className={styles.footer} p="md" mt="md">
        <Container>
          <Flex justify="space-between" gap="md">
            <Text size="sm" c="dimmed">© {new Date().getFullYear()} ImmoRadar</Text>

            <Flex gap="md" ml="auto">
              <Link href="/imprint"><Text size="sm" c="dimmed">Impressum</Text></Link>
              <Link href="/privacy"><Text size="sm" c="dimmed">Datenschutz</Text></Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </div>
  </>
}

export default Layout
