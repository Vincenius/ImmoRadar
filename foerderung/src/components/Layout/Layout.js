import React, { useEffect, useState } from 'react';
import Script from 'next/script'
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import { Container, Text, Flex, Box, Burger, Menu } from '@mantine/core'
import * as CookieConsent from "vanilla-cookieconsent";
import Logo from './logo.svg';
import GreenEnergyLogo from './green-energy-logo.png';
import styles from './Layout.module.css';


const menu = [
  // {
  //   label: 'Home',
  //   url: '/home'
  // },
];


const Layout = ({ children, title, description, date, noindex, image, withBackground }) => {
  const ogImage = image || '/og-image.jpg';
  const [opened, setOpened] = useState(false);
  const setNoIndex = noindex || process.env.NEXT_PUBLIC_NOINDEX === 'true';

  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,  // Diese Kategorie ist standardmäßig aktiviert
          readOnly: true  // Diese Kategorie kann nicht deaktiviert werden
        },
        analytics: {}
      },

      language: {
        default: 'de',
        translations: {
          de: {
            consentModal: {
              title: 'Wir verwenden Cookies',
              description: 'Klicke auf „Alle akzeptieren“, um Cookies zur Personalisierung und Analyse über den Google Tag Manager zuzulassen. Du kannst deine Einstellungen jederzeit anpassen.',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige akzeptieren',
              showPreferencesBtn: 'Individuelle Einstellungen verwalten'
            },
            preferencesModal: {
              title: 'Cookie-Einstellungen verwalten',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige akzeptieren',
              savePreferencesBtn: 'Auswahl übernehmen',
              closeIconLabel: 'Einstellungen schließen',
              sections: [
                // {
                //   title: 'Wer hat „Cookies“ gesagt?',
                //   description: 'Ich will einen!'
                // },
                {
                  title: 'Unbedingt erforderliche Cookies',
                  description: 'Diese Cookies sind für die grundlegende Funktion der Website erforderlich und können nicht deaktiviert werden.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Leistung und Analyse (GTM)',
                  description: 'Diese Cookies erfassen anonymisierte Informationen darüber, wie du unsere Website nutzt. Sie helfen uns dabei, das Angebot über den Google Tag Manager zu verbessern.',
                  linkedCategory: 'analytics'
                },
                {
                  title: 'Weitere Informationen',
                  description: 'Bei Fragen zu unserer Cookie-Richtlinie oder deinen Auswahlmöglichkeiten kontaktiere uns bitte über die <a href="#contact-page">Kontaktseite</a>.'
                }
              ]
            }
          }
        }
      }
    });
  }, []);

  return <>
    <Head>
      <title>{`${title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
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
      {process.env.NEXT_PUBLIC_ANALYTICS_ID && (
        <script defer src="https://analytics.immoradar.xyz/script.js" data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID}></script>
      )}
      <script
        type="text/plain"
        data-category="analytics"
      >
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N3L75KCB');`}
      </script>

    </Head>
    <Flex direction="column" mih="100vh" h="100%" justify="space-between" className={withBackground ? styles.background : ''}>
      <Box as="header" height={60} className={styles.header}>
        <Container size={1060}>
          <Flex justify="space-between" component="nav" py="sm">
            <Link href="/" className={styles.headerLink}>
              <Flex align="center" gap="sm">
                <Image src={Logo} width={40} height={40} alt="Logo" priority />
                <Text size="xl" className={styles.gradientText} fw="bold">{process.env.NEXT_PUBLIC_WEBSITE_NAME}</Text>
              </Flex>
            </Link>

            {/* desktop menu */}
            <Flex justify="flex-end" align="center" gap="xl" display={{ base: "none", xs: "flex" }}>
              {menu.map(menuItem =>
                <Link key={menuItem.label} href={menuItem.url}>{menuItem.label}</Link>)
              }
            </Flex>

            {/* mobile menu */}
            {menu.length > 0 && <Menu shadow="md" display={{ base: "block", xs: "none" }} opened={opened} onChange={setOpened}>
              <Menu.Target>
                <Burger opened={opened} aria-label="Menü" />
              </Menu.Target>

              <Menu.Dropdown>
                {menu.map(menuItem =>
                  <Menu.Item key={menuItem.label}>
                    <Link href={menuItem.url}>{menuItem.label}</Link>
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>}
          </Flex>
        </Container>
      </Box>

      <Container as="main" pos="relative" size={1060} w="100%">
        {children}
      </Container>

      <Box as="footer" className={styles.footer} p="md" pt="xl" pb="md">
        <Container size={1060}>
          <Flex direction={{ base: "column-reverse", xs: "row" }} justify="space-between" align={{ base: "center", xs: "flex-start" }} gap="md">
            <Box>

              <Flex gap="sm">
                <Image src={GreenEnergyLogo} width={40} height={40} alt="Erneuerbare Energien Logo" />
                <Text weight={700} size="xs" c="gray.7" maw="200px">Diese Webseite wird mit erneuerbarer Energie betrieben.</Text>
              </Flex>
            </Box>

            <Flex gap="xl" direction={{ base: "column", xs: "row" }}>
              <Box>
                <Link href="/impressum"><Text size="sm" c="gray.7" mb="xs">Impressum</Text></Link>
                <Link href="/datenschutz"><Text size="sm" c="gray.7" mb="xs">Datenschutz</Text></Link>
                <Link href="/kontakt"><Text size="sm" c="gray.7" mb="xs">Kontakt</Text></Link>
                <Link href="/ueber-uns"><Text size="sm" c="gray.7" mb="xs">Über uns</Text></Link>
              </Box>
            </Flex>
          </Flex>
          <Text size="sm" c="gray.7" align="center" mt="md">© {new Date().getFullYear()} {process.env.NEXT_PUBLIC_WEBSITE_NAME}</Text>
        </Container>
      </Box>
    </Flex>
  </>
}

export default Layout
