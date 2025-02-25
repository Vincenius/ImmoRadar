import React from 'react';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Container, Title, Box, Card, Flex, Image, Text, Skeleton, Button } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css'
import GhostContentAPI from '@tryghost/content-api';

function reduceTextToWords(text, wordLimit = 20) {
    const words = text.split(/\s+/); // Split by whitespace
    return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
}

// Initialisiere die Ghost API
const api = new GhostContentAPI({
    url: process.env.NEXT_PUBLIC_GHOST_API_URL,
    key: process.env.NEXT_PUBLIC_GHOST_API_KEY,
    version: 'v5.0'
});

// todo https://github.com/ShortTechDE/headless-placeholder

const Blog = ({ posts }) => {
    return (
        <Layout
            title="Blog | ImmoRadar"
            description="Die Wissensdatenbank rund ums Thema Immobilien"
            image="https://immoradar.xyz/immo-guesser.jpg"
        >
            <Container py="6rem" size="md" pos="relative">
                <div className={styles.background}></div>
                <Box p={{ base: "sm", sm: "0" }}>
                    <Title order={1} ta={{ base: 'center', sm: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" textWrap="balance">
                        Einfach <span className={styles.gradientText}>Finden.</span><br />
                    </Title>
                    <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', sm: 'left' }} mb="xl" fw={300}>
                        Die Wissensdatenbank rund ums Thema Immobilien
                    </Title>
                </Box>
            </Container>
            <Container py="3rem">
                {posts.map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
                            <Flex justify="space-between" gap="lg" direction={{ base: "column", sm: "row" }}>
                                <Box w={{ base: "100%", sm: "50%" }}>
                                    <Image component={LazyLoadImage}
                                        src="/fallback.jpg"
                                        srcSet={p.feature_image}
                                        alt={p.feature_image_alt || p.title}
                                        height="100%"
                                        width="100%"
                                        effect="blur"
                                        radius="sm"
                                        mb="0"
                                        placeholder={<Skeleton height={230} />}
                                    />
                                </Box>

                                <Flex w={{ base: "100%", sm: "50%" }} direction="column" justify="space-between" gap="sm">
                                    <Box>
                                        <Text c="gray.7" mb="xs">{new Date(p.created_at).toLocaleString('de-DE', { dateStyle: 'long' })}</Text>
                                        <Title order={2} size="h2" mb="sm" title={p.title}>{p.title}</Title>
                                        <Text>{reduceTextToWords(p.excerpt)}...</Text>
                                    </Box>
                                    <Button href={`/blog/${p.slug}`} size="sm" variant="outline">Weiterlesen</Button>
                                </Flex>
                            </Flex>
                        </Card>
                    </Link>
                ))}
            </Container>
        </Layout>
    );
};

export async function getStaticProps() {
    const posts = await api.posts.browse({ limit: 'all' })

    return { props: { posts } };
}

export default Blog;