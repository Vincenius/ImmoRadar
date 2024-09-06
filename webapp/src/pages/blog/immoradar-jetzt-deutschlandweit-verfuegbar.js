import React from 'react';
import Link from 'next/link';
import { Text } from '@mantine/core';
import BlogLayout from '@/components/Layout/BlogLayout';
import { posts } from '@/utils/blog';

const BlogPost = () => {
    const post = posts.find(post => post.slug === 'immoradar-jetzt-deutschlandweit-verfuegbar');

    return (
        <BlogLayout post={post}>
            <Text my="md">
                Nach einer <Link href="/blog/immoradar-startet-in-die-beta-phase">mehrwöchigen Testphase in Berlin</Link> sind nun die ersten Immobilienportale
                für ganz Deutschland verfügbar. Es werden Immobilien von Immobilienscout24, Immowelt und Kleinanzeigen aus allen Gebieten Deutschlands aufgenommen
                und gelistet. Weitere Webseiten werden bald folgen.
            </Text>

            <Text my="md">
                ImmoRadar befindet sich weiterhin in der Beta Phase. Die Suchmaschine beginnt stabil zu laufen und zuverlässig Immobilien von den
                verschiedenen Seiten aufzunehmen und zu Listen. Es kann jedoch weiterhin zu kleinen Fehlern kommen. Sollte dir etwas auffallen
                schreibe mir gern eine E-Mail:
            </Text>

            <Text my="md">
                <a target="mailto:vincent@immoradar.xyz">vincent@immoradar.xyz</a>
            </Text>
        </BlogLayout>
    );
};

export default BlogPost;