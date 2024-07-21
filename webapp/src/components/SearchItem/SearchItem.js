import React, { useState } from 'react'
import NextImage from 'next/image'
import { Box, Card, Flex, Image, Title, ThemeIcon, Text, Badge } from '@mantine/core';
import { Carousel } from '@mantine/carousel'
import { IconMapPin, IconLink } from '@tabler/icons-react';
import { featureMap } from '@/utils/featureMap';
import styles from './SearchItem.module.css'

const imgPlaceholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAIAAADdvUsCAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpSIVByuIOGSourQgKuKoVShChVArtOpg8tIfoUlDkuLiKLgWHPxZrDq4OOvq4CoIgj8gzg5Oii5S4n1JoUWMDy7v47x3DvfdBwj1MtOsjjFA020znUyI2dyKGHpFCP1Uo4jJzDJmJSkF3/V1jwDf7+I8y//en6tHzVsMCIjEM8wwbeJ14qlN2+C8TxxhJVklPieOmdQg8SPXFY/fOBddFnhmxMyk54gjxGKxjZU2ZiVTI54kjqqaTvlC1mOV8xZnrVxlzT75C8N5fXmJ61RDSGIBi5AgQkEVGyjDRpx2nRQLaTpP+PgHXb9ELoVcG2DkmEcFGmTXD/4Hv2drFSbGvaRwAuh8cZyPYSC0CzRqjvN97DiNEyD4DFzpLX+lDkx/kl5radEjoHcbuLhuacoecLkDDDwZsim7UpBKKBSA9zP6phzQdwt0r3pza57j9AHI0KxSN8DBITBSpOw1n3d3tc/t3zvN+f0Amvlytw7oP/YAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfoBxUHKBHRhtAvAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAbFJREFUeNrt0zENAEAIwMDn/WtkYEAHMhi4k9CkkdUP2PMlABOCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggkBE4IJAROCCQETggnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEgAnBhIAJwYSACcGEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQsCEYELAhGBCwIRgQjAhYEIwIWBCuGkAdeMENq40MU8AAAAASUVORK5CYII="

const SearchItem = ({ item }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const address = [item.address.street, item.address.district, item.address.zipCode, item.address.city].filter(Boolean).join(', ')
  const priceType = item.price.additionalInfo === 'WARM_RENT'
    ? 'Warmmiete'
    : item.price.additionalInfo === 'COLD_RENT' ? 'Kaltmiete' : 'Miete'
  const allFeatures = (item.features || []).map(f => featureMap[f]).filter(Boolean)
  const shortFeaturs = allFeatures.slice(0, 4);
  const features = showAllFeatures ? allFeatures : shortFeaturs;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
      <Flex justify="space-between" gap="sm" direction={{ base: "column", xs: "row" }}>
        <Box w={{ base: "100%", xs: "50%" }}>
          { item.gallery.length <= 1 && <Image component={NextImage} fallbackSrc="/fallback.jpg" src={item.gallery[0]?.url} alt={item.gallery[0]?.alt || item.title} height={230} width={500} radius="sm" placeholder={imgPlaceholder} /> }
          { item.gallery.length > 1 && <Carousel h={230} withIndicators align="start" controlSize={18} loop>
            {item.gallery.map((img, i) => <Carousel.Slide key={`carousel-slide-${i}`}>
              <Image component={NextImage} key={`${item._id}-img-${i}`} fallbackSrc="/fallback.jpg" src={img.url} alt={img.alt || item.title} height={230} width={500} radius="sm" placeholder={imgPlaceholder} />
            </Carousel.Slide>)}
          </Carousel> }
        </Box>

        <Flex w={{ base: "100%", xs: "50%" }} direction="column" justify="space-between" gap="sm">
          <Box>
            <Title order={4} mb="sm" className={styles.headline}>{item.title}</Title>

            <Flex gap="xs" align="center" mb="xs">
              <ThemeIcon variant="white" size="xs">
                <IconMapPin />
              </ThemeIcon>
              <Text size="sm">{address}</Text>
            </Flex>

            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <Flex gap="xs" align="center" mb="xs">
                <ThemeIcon variant="white" size="xs">
                  <IconLink />
                </ThemeIcon>
                <Text size="sm" c="cyan">
                  {item.provider}
                </Text>
              </Flex>
            </a>

            <Box>
              {features.map((f, i) => <Badge key={`${item._id}-feature-${i}`} variant="default" size="sm" radius="sm" mr="4px">
                {f}
              </Badge>)}
              {!showAllFeatures && features.length < allFeatures.length &&
                <Badge className={styles.moreFeatures} variant="outline" size="sm" radius="sm" mr="4px" onClick={() => setShowAllFeatures(true)}>
                  ...
                </Badge>}
            </Box>
          </Box>

          <Flex justify="space-between">
            <Box>
              <Text size="md" fw="bold">{item.price.value} €</Text>
              <Text size="sm">{priceType}</Text>
            </Box>
            <Box>
              <Text size="md" fw="bold">{item.livingSpace} m²</Text>
              <Text size="sm">Wohnfläche</Text>
            </Box>
            { item.rooms && <Box>
              <Text size="md" fw="bold">{item.rooms}</Text>
              <Text size="sm">Zimmer</Text>
            </Box> }
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

export default SearchItem
