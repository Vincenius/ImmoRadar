import React from 'react'
import Image from 'next/image';
import { Flex, Text } from '@mantine/core';
import immowelt from './immowelt.png';
import immoscout24 from './immoscout24.png';
import kleinanzeigen from './kleinanzeigen.png';

const Logos = () => {
  return <Flex justify="space-between" align="center" my="lg">
    <Image src={immowelt} alt="Immowelt Logo" height={30} width="100%" />
    <Image src={immoscout24} alt="Immobilienscout24 Logo" height={30} width="100%" />
    <Image src={kleinanzeigen} alt="Kleinanzeigen Logo" height={30} width="100%" />
    <Text>Weitere folgen...</Text>
  </Flex>
}

export default Logos
