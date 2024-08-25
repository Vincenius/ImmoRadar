import React from 'react';
import Link from 'next/link';
import { Container, Title, Text, Box } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import { posts } from '@/utils/blog';

const Blog = () => {
    return (
        <Layout
            title="Blog - News, Artikel und mehr | ImmoRadar Blog"
            description="Der ImmoRadar Blog. News, Artikel und mehr rund um ImmoRadar."
        >
            <Container py="xl" size="sm">
                <Title order={1} mb="xl">Blog</Title>
                {posts.reverse().map(post => <Box key={post.slug} my="md">
                  <Text fs="italic" component="time" datetime={post.isoDate}>{post.date}</Text>
                  <Link href={`/blog/${post.slug}`}>
                    <Title order={2} mb="sm">{post.title}</Title>
                  </Link>
                  <Text>{post.description}</Text>
                </Box>)}

            </Container>
        </Layout>
    );
};

export default Blog;