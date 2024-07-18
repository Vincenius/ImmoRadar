import React, { useRef } from 'react'
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import styles from './Logos.module.css';
import immowelt from './immowelt.png';
import immoscout24 from './immoscout24.png';
import kleinanzeigen from './kleinanzeigen.png';

const Logos = () => {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return <Box py="lg" bg="white" className={styles.container}>
    <Carousel
      height={30}
      slideSize={{ base: '50%', sm: '33.333333%' }}
      slideGap={{ base: 0, sm: 'md' }}
      loop
      align="start"
      withControls={false}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      <Carousel.Slide><Image src={immowelt} alt="Immowelt Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={immoscout24} alt="Immobilienscout24 Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={kleinanzeigen} alt="Kleinanzeigen Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Text>Weitere folgen...</Text></Carousel.Slide>
    </Carousel>
  </Box>
}

export default Logos
