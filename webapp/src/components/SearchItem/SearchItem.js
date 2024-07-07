import React, { useState } from 'react'
import { Box, Card, Flex, Image, Title, ThemeIcon, Text, Badge } from '@mantine/core';
import { Carousel } from '@mantine/carousel'
import { IconMapPin, IconLink } from '@tabler/icons-react';
import { featureMap } from '@/utils/featureMap';
import styles from './SearchItem.module.css'

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
      <Flex justify="space-between" gap="sm">
        <Box w="50%">
          { item.gallery.length <= 1 && <Image fallbackSrc="/fallback.jpg" src={item.gallery[0]?.url} alt={item.gallery[0]?.alt} h={230} radius="sm" /> }
          { item.gallery.length > 1 && <Carousel h={230} withIndicators align="start" controlSize={18} loop>
            {item.gallery.map((img, i) => <Carousel.Slide>
              <Image key={`${item._id}-img-${i}`} fallbackSrc="/fallback.jpg" src={img.url} alt={img.alt} h={230} radius="sm" />
            </Carousel.Slide>)}
          </Carousel> }
        </Box>

        <Flex w="50%" direction="column" justify="space-between" gap="sm">
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
