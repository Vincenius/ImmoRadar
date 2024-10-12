import React from 'react';
import { Text } from '@mantine/core';
import BlogLayout from '@/components/Layout/BlogLayout';
import { posts } from '@/utils/blog';

const BlogPost = () => {
    const post = posts.find(post => post.slug === 'ohne-makler-hinzugefuegt');

    return (
        <BlogLayout post={post}>
            <Text my="md">
              Wir haben unser Immobilien Angebot um alle Wohnungen von <a href="ohne-makler.net" rel="noopener noreferrer">ohne-makler.net</a> ergänzt. Damit unterstützt ImmoRadar nun 10 verschiedene Immobilien-Portale.
            </Text>

            <Text my="md">
              Damit wurde unser Angebot um über 1900 Wohnungen aus ganz Deutschland ergänzt.
            </Text>

            <Text my="md">
              Viel Erfolg bei der Wohnungssuche! Wir hoffen bei den neuen Angeboten ist etwas passendes dabei.
            </Text>
        </BlogLayout>
    );
};

export default BlogPost;