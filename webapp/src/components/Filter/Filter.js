import { useState, useEffect } from 'react';
import { Flex, NumberInput, Text, Button, Collapse, Checkbox, TextInput, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCurrencyEuro } from '@tabler/icons-react'
import { featureMap } from '@/utils/featureMap'
import { providers } from '@/utils/providers'

const eurIcon = <IconCurrencyEuro style={{ width: rem(20), height: rem(20) }} stroke={1.5} />;

const Filter = ({ defaultFilter, applyFilter, loading }) => {
  const [opened, { toggle }] = useDisclosure(false);

  const [filter, setFilter] = useState({
    minPrice: null,
    maxPrice: null,
    minSize: null,
    maxSize: null,
    minRooms: null,
    maxRooms: null,
    titleIncludes: '',
    titleExcludes: '',
    features: [],
    providers: [],
  })

  useEffect(() => {
    if (defaultFilter) {
      setFilter(defaultFilter)
    }
  }, [defaultFilter, setFilter]);

  return <>
    <Flex gap="sm" align="center" mb="sm">
      <NumberInput
        label="Min. Preis"
        placeholder="Beliebig"
        rightSection={eurIcon}
        min={0}
        max={filter.maxPrice || Infinity}
        value={filter.minPrice}
        onChange={(value) => setFilter({ ...filter, minPrice: value })}
      />
      <Text mt="md">bis</Text>
      <NumberInput
        label="Max. Preis"
        placeholder="Beliebig"
        rightSection={eurIcon}
        min={filter.minPrice || 1}
        value={filter.maxPrice}
        onChange={(value) => setFilter({ ...filter, maxPrice: value })}
      />
    </Flex>

    <Flex gap="sm" align="center" mb="sm">
      <NumberInput
        label="Min. Fläche"
        placeholder="Beliebig"
        min={0}
        max={filter.maxSize || Infinity}
        value={filter.minSize}
        onChange={(value) => setFilter({ ...filter, minSize: value })}
      />
      <Text mt="md">bis</Text>
      <NumberInput
        label="Max. Fläche"
        placeholder="Beliebig"
        min={filter.minSize || 1}
        value={filter.maxSize}
        onChange={(value) => setFilter({ ...filter, maxSize: value })}
      />
    </Flex>

    <Flex gap="sm" align="center" mb="sm">
      <NumberInput
        label="Min. Zimmer"
        placeholder="Beliebig"
        min={0}
        max={filter.maxRooms || Infinity}
        value={filter.minRooms}
        onChange={(value) => setFilter({ ...filter, minRooms: value })}
      />
      <Text mt="md">bis</Text>
      <NumberInput
        label="Max. Zimmer"
        placeholder="Beliebig"
        min={filter.minRooms || 1}
        value={filter.maxRooms}
        onChange={(value) => setFilter({ ...filter, maxRooms: value })}
      />
    </Flex>

    {!opened &&
      <Text c="blue" td="underline"onClick={toggle} style={{ cursor: 'pointer' }}>Erweiterte Filter</Text>
    }

    <Collapse in={opened}>
      <TextInput
        label="Titel enthält"
        placeholder="Suche nach bestimmten Text"
        value={filter.titleIncludes}
        onChange={(event) => setFilter({ ...filter, titleIncludes: event.currentTarget.value })}
        mb="sm"
      />
      <TextInput
        label="Titel enthält nicht"
        placeholder="Schließe bestimmten Text aus"
        value={filter.titleExcludes}
        onChange={(event) => setFilter({ ...filter, titleExcludes: event.currentTarget.value })}
        mb="sm"
      />

      <Text size="sm" fw={500} mb="sm">Anbieter</Text>

      {providers.map(p => <Checkbox
        mb="sm"
        key={p.id}
        label={p.label}
        checked={!filter.providers?.includes(p.id)}
        onChange={(event) => {
          if (!event.currentTarget.checked) {
            setFilter((prevFilter) => ({
              ...prevFilter,
              providers: [...(prevFilter.providers || []), p.id],
            }));
          } else {
            setFilter((prevFilter) => ({
              ...prevFilter,
              providers: prevFilter.providers?.filter((f) => f !== p.id),
            }));
          }
        }}
      />)}

      <Text size="sm" fw={500} mb="sm">Ausstattung</Text>

      <Flex wrap="wrap" gap="xs">
        {Object.entries(featureMap).map(([featureKey, featureValue]) => (
          <Checkbox
            key={featureKey}
            label={featureValue}
            checked={filter.features?.includes(featureKey)}
            onChange={(event) => {
              if (event.currentTarget.checked) {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  features: [...(prevFilter.features || []), featureKey],
                }));
              } else {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  features: prevFilter.features?.filter((f) => f !== featureKey),
                }));
              }
            }}
          />
        ))}
      </Flex>
    </Collapse>

    <Button onClick={() => applyFilter(filter)} mt="md" loading={loading}>
      Filter Anwenden
    </Button>
  </>
}

export default Filter;