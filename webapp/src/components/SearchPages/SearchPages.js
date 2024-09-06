import React from 'react'
import Link from 'next/link'
import { List, ThemeIcon, rem, Flex , Grid, Box, Text} from '@mantine/core'
import { IconMapPinFilled } from '@tabler/icons-react'

function splitArray(arr) {
  const length = arr.length;
  const partSize = Math.ceil(length / 4);
  const parts = [];

  for (let i = 0; i < 4; i++) {
      const start = i * partSize;
      const end = start + partSize;
      parts.push(arr.slice(start, end));
  }

  return parts;
}

function ListItem({ item, secondary = false }) {
  return <Flex gap="sm" key={item.label}>
    <ThemeIcon color={secondary ? 'teal.2' : 'teal.4'} size={16} radius="xl" mt={6}>
      <IconMapPinFilled style={{ width: rem(16), height: rem(16) }} />
    </ThemeIcon>
    { item.url && <Link href={item.url}>{item.label}</Link> }
    { !item.url && <Text>{item.label}</Text>}
  </Flex>
}

export default function SearchPages({ data }) {
  return <List
    mb="lg"
    listStyleType="none"
  >
    <Grid>
      {splitArray(data).map((row, index) => (
        <Grid.Col span={{ base: 6, lg: 3 }} key={`search-pages-col-${index}`}>
          { row.map(d => <Box key={`search-pages-box-${index}-${d.primary.label}`} mb="md">
              <ListItem item={d.primary} />
              { d.secondary && <Box ml="sm">
                { d.secondary.map(s => <ListItem key={s.label} item={s} secondary={true} /> )}
              </Box> }
            </Box> )}
        </Grid.Col>
      ))}
    </Grid>
  </List>
}
