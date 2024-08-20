import React from 'react'
import { Box, Card, Flex, Skeleton, ThemeIcon } from '@mantine/core';
import { IconMapPin, IconLink } from '@tabler/icons-react';

const SearchItemLoader = ({ index }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
      <Flex justify="space-between" gap="sm" direction={{ base: "column", xs: "row" }}>
        <Box w={{ base: "100%", xs: "50%" }}>
          <Skeleton height={230} />
        </Box>

        <Flex w={{ base: "100%", xs: "50%" }} direction="column" justify="space-between" gap="sm">
          <Box>
            <Skeleton height={20} mb="sm" radius="xl" />
            <Skeleton height={20} mb="sm" width="70%" radius="xl" />

            <Flex gap="xs" align="center" mb="xs">
              <ThemeIcon variant="white" size="xs">
                <IconMapPin />
              </ThemeIcon>
              <Skeleton height={12} width={120} radius="xl" />
            </Flex>

            <Flex gap="xs" align="center" mb="xs">
              <ThemeIcon variant="white" size="xs">
                <IconLink />
              </ThemeIcon>
              <Skeleton height={12} width={100} radius="xl" />
            </Flex>

            <Flex mb={4}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`loader-${index}-0-${i}`} height={16} width={80} radius="xs" mr={2} />
              ))}
            </Flex>
            <Flex>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={`loader-${index}-1-${i}`} height={16} width={90} radius="xs" mr={2} />
              ))}
            </Flex>
          </Box>

          <Flex justify="space-between">
            <Box>
              <Skeleton height={16} width={30} radius="xl" mb="sm" />
              <Skeleton height={12} width={60} radius="xl" />
            </Box>
            <Box>
              <Skeleton height={16} width={30} radius="xl" mb="sm" />
              <Skeleton height={12} width={60} radius="xl" />
            </Box>
            <Box>
              <Skeleton height={16} width={30} radius="xl" mb="sm" />
              <Skeleton height={12} width={60} radius="xl" />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

export default SearchItemLoader
