import React from 'react';
import { Container, Title, Text, Blockquote } from '@mantine/core';
import BlogLayout from '@/components/Layout/BlogLayout';
import { posts } from '@/utils/blog';

const BlogPost = () => {
    const post = posts.find(post => post.slug === 'plz-suche-und-blog-hinzugefuegt');
    return (
        <BlogLayout post={post}>
            <Text my="md">
                Seit heute kann über das Suchfeld auch nach Immobilien anhand der Postleitzahl gesucht werden.
                Einfach die Fünfstellige Zahl eingeben und mit Enter bestätigen um alle Immobilien einer PLZ anzuzeigen.
            </Text>
            <Text my="md">
                Zusätzlich wurde der Blog zu ImmoRadar hinzugefügt um über Neuerungen zu informieren.
                Es ist geplant in Zukunft neben Informationen zu Aktualisierungen auf ImmoRadar auch Blog Beiträge
                rund um Immobilien und übers Mieten zu erstellen.
            </Text>
            <Text>
                Viel Erfolg bei der Immobilien Suche!
            </Text>
        </BlogLayout>
    );
};

export default BlogPost;