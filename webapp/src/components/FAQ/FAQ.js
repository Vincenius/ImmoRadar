import React from 'react';
import { Container, Text, Title, Accordion } from '@mantine/core';

const FAQ = () => {
    return (
        <Container my="6em" size="sm">
            <Title order={2} fz={36} fw={700} mb="lg" ta="center">Häufig gestellte Fragen</Title>
            <Accordion variant="contained">
              <Accordion.Item value="frage1">
                <Accordion.Control><Text fw={500}>Ist die Nutzung von ImmoRadar kostenlos?</Text></Accordion.Control>
                <Accordion.Panel>Ja, die Nutzung von ImmoRadar ist völlig kostenlos. Es fallen keine Gebühren oder versteckten Kosten an.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage2">
                <Accordion.Control><Text fw={500}>Welche Immobilien-Webseiten werden von ImmoRadar durchsucht?</Text></Accordion.Control>
                <Accordion.Panel>ImmoRadar durchsucht alle großen und relevanten Immobilien-Webseiten in Deutschland. Dazu gehören aktuell <b>Immobilienscout24</b>, <b>Immowelt</b>, <b>WG-Gesucht</b>, <b>Howoge</b>, <b>Gewobag</b>, <b>Stadt und Land</b>, <b>Degewo</b>, <b>WBM</b>, <b>Gesobau</b> und <b>Kleinanzeigen</b>. Die Liste wird in Zukunft noch erweitert. Aboniere unsere Social Media Kanäle um Updates zu erhalten.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage3">
                <Accordion.Control><Text fw={500}>Wie kann ich Benachrichtigungen für neue Angebote aktivieren?</Text></Accordion.Control>
                <Accordion.Panel>Um Benachrichtigungen zu aktivieren, geben Sie einfach Ihre Suchkriterien ein und klicken Sie auf den Button "Benachrichtigungen aktivieren". Sie erhalten dann eine E-Mail, sobald eine neue Wohnung, die Ihren Kriterien entspricht, gelistet wird.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage4">
                <Accordion.Control><Text fw={500}>Wie oft werden die Suchergebnisse aktualisiert?</Text></Accordion.Control>
                <Accordion.Panel>Aktuell werden die Immobilien-Webseiten etwa alle 10 Minuten auf neue Einträge überprüft. In Zukunft wird diese Frequenz erhöht um sicherzustellen, dass Sie immer die aktuellsten Einträge sehen können.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage5">
                <Accordion.Control><Text fw={500}>Warum ist ein Inserat auf ImmoRadar sichtbar, obwohl es auf dem Immobilien-Portal nicht mehr verfügbar ist?</Text></Accordion.Control>
                <Accordion.Panel>Das Abgleichen unserer Datenbank mit den Immobilienseiten findet mehrmals Täglich statt. Trotzdem können durch die Verzögerung bei der Aktualisierung alte Einträge angezeigt werden, die bereits nicht mehr verfügbar sind.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage6">
                <Accordion.Control><Text fw={500}>Wie kann ich meine Benachrichtigungen verwalten?</Text></Accordion.Control>
                <Accordion.Panel>Es befindet sich ein Link am Ende der E-Mail mit den Benachrichtigungen, mit dem Sie die Einstellungen verwalten und aktualisieren können.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage7">
                <Accordion.Control><Text fw={500}>Kann ich auf ImmoRadar eine Immobilien Inserat erstellen?</Text></Accordion.Control>
                <Accordion.Panel>Aktuell ist es nicht möglich Inserate online zu erstellen. Besteht Interesse ein Inserat auf ImmoRadar zu veröffentlichen? <a href="mailto:vincent@immoradar.xyz">Schreibe mir eine E-Mail</a>.</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default FAQ;
