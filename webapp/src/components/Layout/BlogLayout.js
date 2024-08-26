import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import Layout from '@/components/Layout/Layout';

const BlogPost = ({ post, children }) => {
    return (
        <Layout
            title={`${post.title} | ImmoRadar Blog`}
            description={post.description}
            date={post.isoDate}
            // todo meta image
        >
            <Container py="xl" size="sm">
                <Text fs="italic" component="time" datetime={post.isoDate}>{post.date}</Text>
                <Title order={1} dangerouslySetInnerHTML={{__html: post.title}}></Title>

                {/* todo image */}

                { children }
            </Container>
        </Layout>
    );
};

export default BlogPost;