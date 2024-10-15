import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Box, Card, Flex, Image, Title, ThemeIcon, Text, Badge, Skeleton, rem } from '@mantine/core';
import { Carousel } from '@mantine/carousel'
import { IconMapPin, IconLink, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { featureMap } from '@/utils/featureMap';
import styles from './SearchItem.module.css'
import 'react-lazy-load-image-component/src/effects/blur.css';

const GalleryImage = ({ item, image }) => {
  return <Image component={LazyLoadImage}
    src="/fallback.jpg"
    srcSet={image?.url}
    alt={image?.alt || item.title}
    height={230}
    width="100%"
    effect="blur"
    radius="sm"
    placeholder={<Skeleton height={230} />}
  />
}

const ProviderLink = ({ provider, isLink }) => {
  return <Flex gap="xs" align="center" mb="xs">
  <ThemeIcon variant="white" size="xs">
    <IconLink />
  </ThemeIcon>
  <Text size="sm" c={isLink ? "cyan.9" : "default"}>
    {provider}
  </Text>
</Flex>
}

const SearchItem = ({ item, hidePrice = false, hideLink = false }) => {
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
          { item.gallery.length <= 1 && <GalleryImage item={item} image={item.gallery[0]} /> }
          { item.gallery.length > 1 && <Carousel
            h={230}
            withIndicators
            align="start"
            controlSize={18}
            loop
            nextControlIcon={<IconArrowRight aria-label="Nächstes Bild" style={{ width: rem(16), height: rem(16) }} />}
            previousControlIcon={<IconArrowLeft aria-label="Vorheriges Bild" style={{ width: rem(16), height: rem(16) }} />}
          >
            {item.gallery.map((img, i) => <Carousel.Slide key={`carousel-slide-${i}`}>
              <GalleryImage key={`${item._id}-img-${i}`} item={item} image={img} />
            </Carousel.Slide>)}
          </Carousel> }
        </Box>

        <Flex w={{ base: "100%", xs: "50%" }} direction="column" justify="space-between" gap="sm">
          <Box>
            <Title order={2} size="h4" mb="sm" className={styles.headline} title={item.title}>{item.title}</Title>

            <Flex gap="xs" align="center" mb="xs">
              <ThemeIcon variant="white" size="xs">
                <IconMapPin />
              </ThemeIcon>
              <Text size="sm">{address}</Text>
            </Flex>

            { !hideLink && <a href={item.url} target="_blank" rel="noopener noreferrer nofollow">
              <ProviderLink provider={item.provider} isLink={true} />
            </a> }
            { hideLink && <ProviderLink provider={item.provider} isLink={false} /> }

            <Flex wrap="wrap" gap={2}>
              {features.map((f, i) => <Badge key={`${item._id}-feature-${i}`} variant="default" size="md" radius="sm" mr="4px">
                {f}
              </Badge>)}
              {!showAllFeatures && features.length < allFeatures.length &&
                <Badge className={styles.moreFeatures} variant="outline" size="md" radius="sm" mr="4px" c="cyan.9" onClick={() => setShowAllFeatures(true)}>
                  ...
                </Badge>}
            </Flex>
          </Box>

          <Flex justify={hidePrice ? "space-around" : "space-between"}>
            {!hidePrice &&<Box>
              <Text size="md" fw="bold">
                (item.price.value || 'N/A') €
              </Text>
              <Text size="sm">{priceType}</Text>
            </Box> }
            <Box>
              <Text size="md" fw="bold">{item.livingSpace || 'N/A'} m²</Text>
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
