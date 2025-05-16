import { Flex, Indicator, Popover, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconInfoSmall } from '@tabler/icons-react'
import React from 'react'

const InfoPopover = ({ infoText }) => {
  const [opened, { close, open }] = useDisclosure(false);

  return <Popover width={300} position="bottom" withArrow shadow="md" opened={opened}>
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
  </Popover>
}

function WithInfo({ children, infoText, inline = false, originalWidth = false, offset = 7 }) {
  if (inline) {
    return (
      <Flex gap="xs" align="start" justify="center">
        {children}
        <InfoPopover infoText={infoText} />
      </Flex>
    )
  }
  return (
    <Indicator
      inline={inline}
      size={26}
      label={<InfoPopover infoText={infoText} />}
      w={originalWidth ? 'auto' : "100%"}
      offset={offset}
      color="white"
      styles={{ indicator: { cursor: 'pointer' } }}
    >
      {children}
    </Indicator>
  )
}

export default WithInfo
