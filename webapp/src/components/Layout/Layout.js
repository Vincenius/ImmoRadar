import React from 'react';
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import { Container, Text, Flex, Indicator } from '@mantine/core';
import Logo from './logo.svg';
import styles from './Layout.module.css';

const Layout = ({ children, title, description }) => {
  return <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div>
      <header height={60} mb={30} p="md" className={styles.header}>
        <Container>
          <Flex justify="space-between" component="nav" py="sm">
            <Link href="/">
              <Flex align="center" gap="sm">
                <Image src={Logo} width={40} height={40} />
                <Indicator inline label="Beta" size={16}>
                  <Text weight={700} size="xl">ImmoRadar</Text>
                </Indicator>
              </Flex>
            </Link>

            <Flex justify="flex-end" align="center">
              <a>Über uns</a>
            </Flex>
          </Flex>
        </Container>
      </header>

      <Container as="main">
        {children}
      </Container>
    </div>
  </>
}

export default Layout
