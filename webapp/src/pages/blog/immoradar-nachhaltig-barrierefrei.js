import React from 'react';
import { Text } from '@mantine/core';
import BlogLayout from '@/components/Layout/BlogLayout';
import { posts } from '@/utils/blog';

const BlogPost = () => {
    const post = posts.find(post => post.slug === 'immoradar-nachhaltig-barrierefrei');

    return (
        <BlogLayout post={post}>
            <Text my="md">
                Ich freue mich, euch mitteilen zu können, dass alle Probleme, die die Barrierefreiheit unserer Webseite eingeschränkt haben, nun
                vollständig behoben sind. Wir haben nicht nur die Kontrastverhältnisse korrekt konfiguriert, um sicherzustellen,
                dass Texte für alle Nutzer gut lesbar sind, sondern auch dafür gesorgt, dass sämtliche Inhalte nahtlos mit <a href="https://de.wikipedia.org/wiki/Screenreader">Screenreadern</a> zugänglich
                sind. Damit möchten wir sicherstellen, dass jeder, unabhängig von seinen individuellen Fähigkeiten, ImmoRadar problemlos nutzen kann. 
            </Text>

            <Text my="md">
                Ein weiteres Highlight: ImmoRadar wird bewusst auf den Servern von IONOS gehostet, einem Anbieter, der großen Wert auf  <a href="https://www.ionos.de/umwelt">klimaneutrales Hosting</a> legt. Damit
                tragen wir aktiv zum Schutz der Umwelt bei und reduzieren unseren ökologischen Fußabdruck. Das Tool, das täglich neue
                Immobilienangebote auf den wichtigsten Plattformen durchsucht, läuft auf einem energieeffizienten Home-Server, der ausschließlich
                mit <a href="https://www.naturstrom.de/">Naturstrom</a> betrieben wird. So sorgen wir dafür, dass auch der Betrieb im Hintergrund so
                umweltschonend wie möglich abläuft.
            </Text>

            <Text my="md">
                Wir sind stolz darauf, einen positiven Beitrag sowohl für unsere Nutzer als auch für die Umwelt zu leisten.
                Viel Erfolg bei der Wohnungssuche!
            </Text>
        </BlogLayout>
    );
};

export default BlogPost;