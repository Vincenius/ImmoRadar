import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { Blockquote } from '@mantine/core';
import { IconQuote } from '@tabler/icons-react';
import Autoplay from 'embla-carousel-autoplay';
import classes from './QuoteSlider.module.css'

function QuoteSlider({ quotes }) {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  return (
    <Carousel
      height={250}
      controlSize={20}
      slideSize={{ base: '90%', sm: '70%', md: '33.333333%' }}
      slideGap={{ base: 'md', sm: 'xl' }}
      style={{ overflow: 'visible' }}
      align="center"
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      classNames={classes}
    >
      {quotes.map((quote, index) => (
        <Carousel.Slide key={`quote-${index}`}>
          <Blockquote h="100%" icon={<IconQuote />} radius="sm" color="cyan" cite={quote.author} w="100%" styles={{ root: { backgroundColor: 'var(--mantine-primary-color-0)' } }}>
            {quote.text}
          </Blockquote>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export default QuoteSlider
