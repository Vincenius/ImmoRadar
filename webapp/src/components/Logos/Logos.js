import React, { useRef } from 'react'
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import styles from './Logos.module.css';
import immowelt from './immowelt.png';
import immoscout24 from './immoscout24.png';
import kleinanzeigen from './kleinanzeigen.png';
import wgGesucht from './wg-gesucht.png';
import degewo from './degewo.png';
import gesobau from './gesobau.png';
import gewobag from './gewobag.png';
import howoge from './howoge.png';
import stadtundland from './stadtundland.png';
import wbm from './wbm.png';
import ohneMakler from './ohne-makler.png';

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
      <Carousel.Slide><Image src={immowelt} alt="Immowelt Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={immoscout24} alt="Immobilienscout24 Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={kleinanzeigen} alt="Kleinanzeigen Logo" height={30} width="100%" /></Carousel.Slide>
      {/* <Carousel.Slide><Image src={wgGesucht} alt="WG Gesucht Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={howoge} alt="Howoge Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={ohneMakler} alt="Ohne Makler Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={gesobau} alt="Gesobau Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={degewo} alt="Degewo Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={gewobag} alt="Gewobag Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={stadtundland} alt="STADT UND LAND Logo" height={30} width="100%" /></Carousel.Slide>
      <Carousel.Slide><Image src={wbm} alt="wbm Logo" height={30} width="100%" /></Carousel.Slide> */}

    </Carousel>
  </Box>
}

export default Logos
