import { Card, Image, Flex, Box } from '@mantine/core';
import NextImage from 'next/image';

export default function LoginCard({ children }) {
  return (
    <Flex px="lg" py="3rem" align="center" justify="center">
      <Card shadow="md" padding="lg" radius="md" withBorder w="100%" maw="400px" pos="rel" style={{ overflow: "visible" }}>
        {/* <Card pos="absolute" left="50%" top="-45px" radius="full" style={{ transform: "translateX(-50%)", borderRadius: "100%" }} p="xs">
          <Image component={NextImage} src="/logo.png" height={70} width={70} w={70} alt="ImmoRadar Logo" />
        </Card> */}
       
        <Box>
          {children}
        </Box>
      </Card>
    </Flex>
  );
}
