import React from 'react';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Container, Title, Box, Card, Flex, Image, Text, Skeleton, Button } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css'
import { mapToMantineComponents } from '@/utils/convertHtmlToMantine';
import GhostContentAPI from '@tryghost/content-api';

// Initialisiere die Ghost API
const api = new GhostContentAPI({
    url: process.env.NEXT_PUBLIC_GHOST_API_URL,
    key: process.env.NEXT_PUBLIC_GHOST_API_KEY,
    version: 'v5.0'
});

const Blog = ({ post }) => {
    console.log(post)
    return (
        <Layout
            title={`${post.title} | ImmoRadar`}
            description={`${post.excerpt}`}
            image={post.feature_image}
        >
            <Container py="6rem" size="md" pos="relative">
                <div className={styles.background}></div>
                <Box p={{ base: "sm", sm: "0" }}>
                    <Text c="gray.7" mb="md" size="xl" ta="center">{new Date(post.created_at).toLocaleString('de-DE', { dateStyle: 'long' })}</Text>
                    <Title order={1} ta="center" fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" textWrap="balance">
                        {post.title}
                    </Title>
                </Box>
            </Container>
            <Container py="3rem" size="sm">
                {mapToMantineComponents(post.html)}
            </Container>
        </Layout>
    );
};

export async function getStaticPaths() {
  const posts = await api.posts.browse({ limit: 'all' });
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const post = await api.posts.read({ slug: params.slug });

  return { props: { post } };
}
export default Blog;