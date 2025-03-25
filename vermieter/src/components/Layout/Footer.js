import React from 'react'
import { Box, Container, Flex, Text } from '@mantine/core'
import Link from 'next/link'
import Image from 'next/image';
import GreenEnergyLogo from './green-energy-logo.png';
import styles from './Layout.module.css';

function Footer() {
  return (
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
  )
}

export default Footer
