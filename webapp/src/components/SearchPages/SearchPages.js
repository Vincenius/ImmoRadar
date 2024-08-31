import React from 'react'
import Link from 'next/link'
import { List, ThemeIcon, rem, Flex , Grid} from '@mantine/core'
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

export default function SearchPages({ data }) {
  return <List
    mb="lg"
    listStyleType="none"
  >
    <Grid>
      {splitArray(data).map((row, index) => (
        <Grid.Col span={{ base: 6, lg: 3 }} key={`search-pages-col-${index}`}>
          { row.map(d => <Flex gap="sm" align="center" key={d.label}>
            <ThemeIcon color='teal.2' size={16} radius="xl">
              <IconMapPinFilled style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
            <Link href={d.url}>{d.label}</Link>
          </Flex> )}
        </Grid.Col>
      ))}
    </Grid>
  </List>
}
