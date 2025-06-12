import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { Blockquote, Box, Flex, Image, Text } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import classes from './QuoteSlider.module.css'
import NextImage from 'next/image';

const QuoteContent = ({ quote }) => {
  if (!quote.img) return quote.text

  return (
    <Flex gap="md" direction={{ base: 'column', sm: 'row' }} align={{ base: 'center', sm: 'flex-start' }}>
      <Image
        component={NextImage}
        src={quote.img}
        alt={quote.author}
        height={75}
        width={75}
        w="75px"
        h="75px"
        radius="100%"
      />
      <Text>{quote.text}</Text>
    </Flex>
  )
}

function QuoteSlider({ quotes }) {
  const hasImages = quotes.some(quote => quote.img);
  const autoplay = useRef(Autoplay({ delay: hasImages ? 5000 : 2000 }));

  return (
    <Box>
      <Carousel
        height={hasImages ? { base: 350, md: 250 } : 250}
        controlSize={20}
        slideSize={hasImages ? { base: '90%', md: '70%' } : { base: '90%', sm: '70%', md: '33.333333%' }}
        slideGap={{ base: 'md', sm: 'xl' }}
        align="center"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        classNames={classes}
      >
        {quotes.map((quote, index) => (
          <Carousel.Slide key={`quote-${index}`}>
            <Blockquote h="100%" radius="sm" color="cyan.6" c="#fff" cite={quote.author} w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-9)' } }}>
              <QuoteContent quote={quote} />
            </Blockquote>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  )
}

export default QuoteSlider
