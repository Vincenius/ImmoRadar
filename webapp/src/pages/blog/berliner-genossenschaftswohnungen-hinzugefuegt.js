import React from 'react';
import { Container, Title, Text, Blockquote } from '@mantine/core';
import Layout from '@/components/Layout/Layout';
import { posts } from '@/utils/blog';

const BlogPost = () => {
    return (
        <Layout
            title={`${posts[1].title} | ImmoRadar Blog`}
            description={posts[1].description}
            date={posts[1].isoDate}
            // todo meta image
        >
            <Container py="xl" size="sm">
                <Text fs="italic" component="time" datetime={posts[1].isoDate}>{posts[1].date}</Text>
                <Title order={1}>{posts[1].title}</Title>

                {/* todo image */}

                <Text my="md">
                    Seit heute können auch Wohnungen von <a href="https://www.howoge.de/" rel="noreferrer noopener">Howoge</a>, <a href="https://www.gewobag.de/" rel="noreferrer noopener">Gewobag</a>, <a href="https://www.degewo.de/" rel="noreferrer noopener">Degewo</a>, <a href="https://www.gewobag.de/" rel="noreferrer noopener">Gewobag</a>, <a href="https://www.gesobau.de/" rel="noreferrer noopener">Gesobau</a>, <a href="https://www.wbm.de/" rel="noreferrer noopener">WBM</a> und <a href="https://stadtundland.de/" rel="noreferrer noopener">Stadt und Land</a> auf
                    ImmoRadar gefunden werden.
                </Text>

                <Text my="md">
                    Damit wird unser Angebot für bezahlbaren Wohnraum in Berlin umfassend erweitert. Durch die Aufnahme von Wohnungen der genannten Genossenschaften
                    bieten wir nicht nur eine größere Auswahl, sondern auch die Sicherheit, dass diese Wohnungen zu fairen und transparenten Konditionen vermietet werden.
                </Text>

                <Text my="md">
                    Viel Erfolg bei der Wohnungssuche!
                </Text>
            </Container>
        </Layout>
    );
};

export default BlogPost;