import React from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import { Container, Text, Flex, Indicator, Box, ActionIcon } from '@mantine/core'
import { IconBrandFacebook, IconBrandX, IconBrandLinkedin } from '@tabler/icons-react';
import Logo from './logo.svg';
import styles from './Layout.module.css';

function useCannonical() {
  const router = useRouter();
  const { query, pathname } = router;

  // Clone the query object and track if any parameter was removed
  const canonicalQuery = { ...query };
  let parametersRemoved = false;

  if (canonicalQuery.page === '1') {
    delete canonicalQuery.page;
    parametersRemoved = true;
  }
  if (canonicalQuery.sort === 'date') {
    delete canonicalQuery.sort;
    parametersRemoved = true;
  }

  // If no parameters were removed, return null
  if (!parametersRemoved) {
    return null;
  }

  // Generate the canonical URL
  const canonicalUrl = new URL(pathname, 'https://immoradar.xyz');
  Object.keys(canonicalQuery).forEach((key) => {
    canonicalUrl.searchParams.append(key, canonicalQuery[key]);
  });

  return canonicalUrl.href;
}

const Layout = ({ children, title, description, date, noindex }) => {
  const canonicalUrl = useCannonical();

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
      { date && <meta property="article:published_time" content={date}></meta> }
      { date && <meta name="author" content="Vincent Will"></meta> }
      { noindex && <meta name="robots" content="noindex" /> }
      { canonicalUrl && <link rel="canonical" href={canonicalUrl} /> }
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

            <Flex justify="flex-end" align="center" gap="lg">
              <Link href="/blog">Blog</Link>
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
            <Box>
              <Flex mb="xs" gap="sm">
                <ActionIcon
                  component="a"
                  href="https://www.facebook.com/profile.php?id=61566536998327"
                  variant="outline"
                  aria-label="Facebook"
                  size="sm"
                >
                  <IconBrandFacebook />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://x.com/ImmoRadar_DE"
                  variant="outline"
                  aria-label="X / Twitter"
                  size="sm"
                >
                  <IconBrandX />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://www.linkedin.com/company/immoradar-xyz/"
                  variant="outline"
                  aria-label="LinkedIn"
                  size="sm"
                >
                  <IconBrandLinkedin />
                </ActionIcon>
              </Flex>
              <Text size="sm" c="gray.7">© {new Date().getFullYear()} ImmoRadar</Text>
            </Box>

            <Box>
              <Link href="/imprint"><Text size="sm" c="gray.7">Impressum</Text></Link>
              <Link href="/privacy"><Text size="sm" c="gray.7">Datenschutz</Text></Link>
            </Box>
          </Flex>
        </Container>
      </Box>
    </div>
  </>
}

export default Layout
