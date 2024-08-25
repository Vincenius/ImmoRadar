import React from 'react';
import { Container, Title, Text, Blockquote } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import { posts } from '@/utils/blog';

const BlogPost = () => {
    const post = posts.find(post => post.slug === 'immoradar-startet-in-die-beta-phase');
    return (
        <Layout
            title={`${post.title} | ImmoRadar Blog`}
            description={post.description}
            date={post.isoDate}
            // todo meta image
        >
            <Container py="xl" size="sm">
                <Text fs="italic" component="time" datetime={post.isoDate}>{post.date}</Text>
                <Title order={1}>{post.title}</Title>

                {/* todo image */}

                <Text my="md">
                    Nach etwa einem Monat Entwicklungszeit habe ich heute den Schritt gewagt und ImmoRadar
                    auf <a href="https://old.reddit.com/r/berlin/comments/1erwaxp/i_built_a_free_search_engine_for_flat_hunting_in/" rel="noopener noreferrer">Reddit</a> veröffentlicht. In
                    der Beta Phase wird nur eine kleine Anzahl von Immobilien Webseiten durchsucht. Desweiteren ist die Suche auf Berlin beschränkt.
                </Text>

                <Blockquote color="cyan" my="xl">
                    Das Ziel von ImmoRadar ist es die Wohnungssuche zu erleichtern, indem die Ergebnisse der größten Immobilien-Webseiten zusammengefasst werden.
                </Blockquote>

                <Text my="md">
                    In den nächsten Tagen werde ich anhand des Feedbacks eine Roadmap erstellen und
                    Funktionen sowie weitere Immobilien Webseiten priorisieren. In der ersten Version
                    werden <a href="https://www.immobilienscout24.de/" rel="noopener noreferrer">Immobilienscout24</a>, <a href="https://www.immowelt.de/" rel="noopener noreferrer">Immowelt</a>, <a href="https://www.wg-gesucht.de/" rel="noopener noreferrer">WG-Gesucht</a>, und <a href="https://www.kleinanzeigen.de/" rel="noopener noreferrer">Kleinanzeigen</a> durchsucht.
                </Text>

                <Text my="md">
                    Desweiteren ist das Ziel der Beta Phase, Fehler zu finden und zu beheben um eine Stabile Version der
                    Webseite zur Verfügung zu stellen.
                </Text>

                <Text>
                    Bei Fragen und Anregungen schreibt mir gerne eine E-Mail:
                </Text>
                <Text>
                    <a href="mailto:vincent@immoradar.xyz">vincent@immoradar.xyz</a>
                </Text>
            </Container>
        </Layout>
    );
};

export default BlogPost;