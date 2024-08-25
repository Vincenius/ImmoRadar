import { Flex, Text, Group, ThemeIcon, Title, Box, Card, List, rem } from '@mantine/core';
import { IconArrowMergeBoth, IconList, IconBell, IconArrowUp, IconMapPinFilled } from '@tabler/icons-react';
import Link from 'next/link'
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import SearchBar from '@/components/SearchBar/SearchBar';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import FAQs from '@/components/FAQ/FAQ';
import styles from '@/styles/Home.module.css'
import { Button } from '@mantine/core';

const ListItem = ({ isPrimary, title, link, children }) => (
  <List.Item>
    <Flex gap="sm" align="center">
      <ThemeIcon color={ isPrimary ? 'teal' : 'teal.2'} size={isPrimary ? 24 : 16} radius="xl">
        <IconMapPinFilled style={{ width: rem(16), height: rem(16) }} />
      </ThemeIcon>
      <Link href={link}>{title}</Link>
    </Flex>

    {children}
  </List.Item>
)

export default function Home() {
  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      <Box className={styles.header}>
        <div className={styles.background}></div>

        <Flex mih="600px" h="calc(100vh - 70px - 64px)" direction="column" justify="space-evenly">
          <Box>
            <Title order={1} ta={{ base: 'center', md: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" mb="lg" textWrap="balance">
              Alle <span className={styles.gradientText}>Immobilienangebote</span> an einem Ort
            </Title>

            <Group position="center">
              <SearchBar showFilter={true} />
              <Card fs="sm" p="sm" bg="cyan.1" radius="sm" mb="sm" shadow="none" opacity={0.7} w="100%">
                <Text size="sm" fs="italic">
                  ImmoRadar befindet sich aktuell in der Beta-Phase. Aktuell werden nur Suchanfragen für &quot;Berlin&quot; unterstützt.<br/>Alle anderen Städte / Gemeinden werden in Kürze hinzugefügt.
                </Text>
              </Card>
            </Group>
          </Box>
          <Flex justify="space-between" align={{ base: 'left', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 'xl', sm: 'xl'}} maw={{ base: "350px", sm: "100%"}} m="0 auto">
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconArrowMergeBoth size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Kombiniert Ergebnisse von <b>9 Immobilien-Webseiten</b></Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconList size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}>Eine einzige, gut sortierte Liste <b>ohne Duplikate</b></Text>
            </Flex>
            <Flex align={{ base: 'left', sm: 'center'}} direction={{ base: 'row', sm: 'column' }} gap="sm" maw={{ base: "auto", sm: "250px"}}>
              <ThemeIcon radius="sm" size="lg" variant="filled"><IconBell size={24} /></ThemeIcon>
              <Text ta={{ base: 'left', sm: 'center'}}><b>Benachrichtigungen</b> bei neuen Angeboten</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Logos />

      <Box my="6em">
        <FeatureCards />
      </Box>

      <FAQs />

      <Box my="6em">
        <Title order={2} fz={36} fw={700} mb="lg" ta="center">Finde Wohnungen in folgenden Regionen</Title>

        <List 
          mb="lg"
          listStyleType="none"
        >
          <ListItem isPrimary={true} title="Berlin" link="/berlin">

            <List withPadding mt="xs" listStyleType="none" style={{ paddingLeft: '1.6rem' }}>
              <ListItem isPrimary={false} title="Mitte" link="/berlin/mitte"></ListItem>
              <ListItem isPrimary={false} title="Spandau" link="/berlin/spandau"></ListItem>

              <List.Item>
                <Flex gap="sm" align="center">
                    <ThemeIcon color="teal.2" size={16} radius="xl">
                      <IconMapPinFilled style={{ width: rem(16), height: rem(16) }} />
                    </ThemeIcon>
                    <span>Weitere folgen...</span>
                </Flex>
              </List.Item>
            </List>
          </ListItem>
        </List>
      </Box>
      
      <Box my="6em">
        <Button
          variant="filled"
          color="cyan.9"
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
