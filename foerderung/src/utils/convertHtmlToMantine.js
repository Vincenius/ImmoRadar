import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Box, Title, Text, Button, Image } from '@mantine/core';

// Function to map HTML elements to Mantine components
export const mapToMantineComponents = (htmlString) => {
  const options = {
    replace: (domNode) => {
      if (domNode.type === 'tag') {
        const { name, attribs, children } = domNode;

        // Map HTML elements to Mantine components
        switch (name) {
          case 'div':
            return (
              <Box {...attribs}>
                {domToReact(children, options)}
              </Box>
            );
          case 'h1':
            return (
              <Title order={1}>
                {domToReact(children, options)}
              </Title>
            );
          case 'h2':
            return (
              <Title order={2}>
                {domToReact(children, options)}
              </Title>
            );
          case 'h3':
            return (
              <Title order={3}>
                {domToReact(children, options)}
              </Title>
            );
          case 'h4':
            return (
              <Title order={4}>
                {domToReact(children, options)}
              </Title>
            );
          case 'h5':
            return (
              <Title order={5}>
                {domToReact(children, options)}
              </Title>
            );
          case 'p':
            return (
              <Text my="md">
                {domToReact(children, options)}
              </Text>
            );
          case 'button':
            return (
              <Button>
                {domToReact(children, options)}
              </Button>
            );
          case 'img':
            return (
              <Image
                src={attribs.src}
                alt={attribs.alt || 'Image'}
                width="100%"
                height="auto"
                fit="cover"
                radius="md"
              />
            );

          // Add more cases as needed for other HTML elements

          default:
            return undefined; // Allow non-mapped elements to render as they are
        }
      }
    },
  };

  return parse(htmlString, options);
};
