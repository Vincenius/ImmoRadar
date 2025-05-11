import { Indicator, Popover, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconInfoSmall } from '@tabler/icons-react'
import React from 'react'

function WithInfo({ children, infoText }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Indicator
      size={26}
      label={<Popover width={200} position="bottom" withArrow shadow="md" opened={opened}>
        <Popover.Target>
          <ThemeIcon
            variant="outline"
            radius="xl"
            size="sm"
            style={{ cursor: 'pointer' }}
            onMouseEnter={open}
            onMouseLeave={close}
            onClick={() => {
              if (opened) close();
              else open();
            }}
          >
            <IconInfoSmall width="100%" height="100%" color="var(--mantine-color-cyan-9)" />
          </ThemeIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">{infoText}</Text>
        </Popover.Dropdown>
      </Popover>}
      w="100%"
      offset={7}
      color="white"
      styles={{ indicator: { cursor: 'pointer' } }}
    >
      {children}
    </Indicator>
  )
}

export default WithInfo
