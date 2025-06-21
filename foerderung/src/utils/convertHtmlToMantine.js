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
              <Title order={1} my="md" size="h5">
                {domToReact(children, options)}
              </Title>
            );
          case 'h2':
            return (
              <Title order={2} my="md" size="h5">
                {domToReact(children, options)}
              </Title>
            );
          case 'h3':
            return (
              <Title order={3} my="md" size="h5">
                {domToReact(children, options)}
              </Title>
            );
          case 'h4':
            return (
              <Title order={4} my="md" size="h5">
                {domToReact(children, options)}
              </Title>
            );
          case 'h5':
            return (
              <Title order={5} my="md" size="h5">
                {domToReact(children, options)}
              </Title>
            );
          case 'p':
            return (
              <Text my={listDepth > 0 ? 0 : 'md'} size="xs">
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
            const flattenChildren = (nodes) => {
              let all = [];
              for (const node of nodes) {
                all.push(node);
                if (node.children) {
                  all = all.concat(flattenChildren(node.children));
                }
              }
              return all;
            };

            const allDescendants = flattenChildren(children);
            const hasDot = allDescendants.some(
              (node) => node.type === 'text' && node.data.trim().startsWith('⬜')
            );

            listDepth++;
            const list = <List
              type={name === 'ol' ? 'ordered' : 'unordered'}
              mb="md"
              size="xs"
              withPadding={!hasDot}
              listStyleType={hasDot ? 'none' : 'disc'}
            >
              {domToReact(children, options)}
            </List>;
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
