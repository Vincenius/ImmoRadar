import React from 'react';
import { Container, Text, Title, Accordion } from '@mantine/core';

const faqs = [
    {
      question: 'Ist die Nutzung von ImmoRadar kostenlos?',
      answer: 'Ja, die Nutzung von ImmoRadar ist völlig kostenlos. Es fallen keine Gebühren oder versteckten Kosten an.',
    },
    {
      question: 'Welche Immobilien-Webseiten werden von ImmoRadar durchsucht?',
      answer: 'ImmoRadar durchsucht alle großen und relevanten Immobilien-Webseiten in Deutschland. Dazu gehören aktuell Immobilienscout24, Immowelt, WG-Gesucht und Kleinanzeigen. Die Liste wird in Zukunft noch erweitert. Fehlt eine wichtige Immobilien-Webseite? Schreibe mir eine E-Mail.',
    },
    {
      question: 'Wie kann ich Benachrichtigungen für neue Angebote aktivieren?',
      answer: 'Um Benachrichtigungen zu aktivieren, geben Sie einfach Ihre Suchkriterien ein und klicken Sie auf den Button "Benachrichtigungen aktivieren". Sie erhalten dann eine E-Mail, sobald eine neue Wohnung, die Ihren Kriterien entspricht, gelistet wird.',
    },
    {
      question: 'Wie oft werden die Suchergebnisse aktualisiert?',
      answer: 'Aktuell werden die Immobilien-Webseiten etwa alle 10 Minuten auf neue Einträge überprüft. In Zukunft wird diese Frequenz erhöht um sicherzustellen, dass Sie immer die aktuellsten Einträge sehen können.',
    },
    {
      question: 'Warum ist ein Inserat auf ImmoRadar sichtbar, obwohl es auf dem Immobilien-Portal nicht mehr verfügbar ist?',
      answer: 'Das Abgleichen unserer Datenbank mit den Immobilienseiten findet mehrmals Täglich statt. Trotzdem können durch die Verzögerung bei der Aktualisierung alte Einträge angezeigt werden, die bereits nicht mehr verfügbar sind.',
    }
  ];

const FAQ = () => {
    return (
        <Container my="6em" size="sm">
            <Title order={2} fz={36} fw={700} mb="lg" ta="center">Häufig gestellte Fragen</Title>
            <Accordion variant="contained">
            {faqs.map((item) => (
                <Accordion.Item key={item.question} value={item.question}>
                    <Accordion.Control><Text fw={500}>{item.question}</Text></Accordion.Control>
                    <Accordion.Panel>{item.answer}</Accordion.Panel>
                </Accordion.Item>
            ))}
            </Accordion>
        </Container>
    );
};

export default FAQ;
