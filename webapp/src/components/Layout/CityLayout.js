import { Flex, Text, ThemeIcon, Title, Box, List, rem } from '@mantine/core';
import { IconClock, IconBell, IconArrowUp, IconCircleCheck, IconMapPinFilled } from '@tabler/icons-react';
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from '@/styles/Cities.module.css'
import { Button } from '@mantine/core';

export default function CityLayout({
    title,
    description,
    headerImage,
    city,
    titleContent,
    cta,
    children
}) {
  return (
    <Layout title={title} description={description}>
      <Box className={styles.header}>
        <Image src={headerImage} alt={city} layout="fill" className={styles.background} />

        <Flex mih="600px" h="calc(100vh - 70px - 64px)" direction="column" justify="space-evenly">
          <Box>
            <Title order={1} ta={{ base: 'center', md: 'center' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" mb="lg" textWrap="balance" c="white">
              {titleContent}
            </Title>

            { cta === 'search' && <SearchBar city={city} /> }
            { cta === 'button' && <Button variant="filled" radius="md" size="lg" fullWidth href={`/search?q=${city}`} component={Link}>
                Jetzt alle 110+ Wohnungen in Spandau anzeigen
            </Button> }
          </Box>
          <Flex justify="space-between" align={{ base: 'left', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'xl'}} maw={{ base: "350px", sm: "100%"}} m="0 auto">
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconMapPinFilled size={24} /></ThemeIcon>
              <Text c="white" ta={{ base: 'left', sm: 'center'}}>Alle Immobilienangebote an einem Ort</Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconClock size={24} /></ThemeIcon>
              <Text c="white" ta={{ base: 'left', sm: 'center'}}>Kein mühsames Durchsuchen mehrerer Webseiten</Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconBell size={24} /></ThemeIcon>
              <Text c="white" ta={{ base: 'left', sm: 'center'}}>Benachrichtigungen bei neuen Angeboten</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Logos />

      <Box my="6em">
        {children}
      </Box>

      <Box my="6em">
        <Button
          variant="filled"
          size="lg"
          fullWidth
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          JETZT SUCHEN
          <IconArrowUp size={20} ml="sm"/>
        </Button>
      </Box>
    </Layout>
  );
}
