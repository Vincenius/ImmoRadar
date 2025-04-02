import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Box, Title, Text, Button, Image, List } from '@mantine/core';

// Function to map HTML elements to Mantine components
export const mapToMantineComponents = (htmlString) => {
  let listDepth = 0;

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
              <Text my={listDepth > 0 ? 0 : 'md'}>
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
          case 'ol':
          case 'ul': {
            listDepth++;
            const list = <List type={name === 'ol' ? 'ordered' : 'unordered'}>{domToReact(children, options)}</List>;
            listDepth--;
            return list;
          }
          case 'li':
            return (
              <List.Item mb={listDepth === 1 ? 'md' : 0}>
                {domToReact(children, options)}
              </List.Item>
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
