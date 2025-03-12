import React from 'react';
import { Container, Text, Title, Accordion } from '@mantine/core';

const FAQ = () => {
    return (
        <Container size="sm">
            <Title order={2} fz={36} fw={700} mb="lg" ta="center">Häufig gestellte Fragen</Title>
            <Accordion variant="contained" bg="white">
              <Accordion.Item value="frage1">
                <Accordion.Control><Text fw={500}>Welche Förderungen kann ich mit dem Förderungscheck finden?</Text></Accordion.Control>
                <Accordion.Panel>Unser Förderungscheck hilft Ihnen, staatliche Zuschüsse, zinsgünstige Kredite und regionale Förderprogramme zu entdecken, die speziell für den Hausbau oder Immobilienkauf verfügbar sind.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage2">
                <Accordion.Control><Text fw={500}>Kann ich die Förderungen direkt über Fertighaus Radar beantragen?</Text></Accordion.Control>
                <Accordion.Panel>Fertighaus Radar zeigt Ihnen verfügbare Förderungen auf, jedoch erfolgt der Antrag direkt bei der zuständigen Institution oder Bank. Wir stellen Ihnen die nötigen Informationen zur Verfügung.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage3">
                <Accordion.Control><Text fw={500}>Wie kann ich ein Grundstück kaufen?</Text></Accordion.Control>
                <Accordion.Panel>Sie können unser Suchtool nutzen, um das passende Grundstück zu finden. Sobald Sie ein interessantes Grundstück entdeckt haben, stellen wir Ihnen die Kontaktdaten des Verkäufers zur Verfügung, damit Sie direkt in Kontakt treten können.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage4">
                <Accordion.Control><Text fw={500}>Wie verkaufe ich mein Grundstück über Fertighaus Radar?</Text></Accordion.Control>
                <Accordion.Panel>Verkäufer können ihr Grundstück einfach auf unserer Plattform inserieren. Füllen Sie das Formular mit den wichtigsten Informationen zum Grundstück aus, und Ihr Angebot wird in unserer Börse gelistet.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage5">
                <Accordion.Control><Text fw={500}>Was wird beim Vergleich der Fertighaus-Anbieter berücksichtigt?</Text></Accordion.Control>
                <Accordion.Panel>Wir berücksichtigen Faktoren wie Preis, Bauzeit, Hausgrößen und -stile, Ausstattung sowie Kundenbewertungen, um Ihnen den bestmöglichen Vergleich zu bieten.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="frage6">
                <Accordion.Control><Text fw={500}>Kann ich über Fertighaus Radar direkt einen Fertighaus-Anbieter kontaktieren?</Text></Accordion.Control>
                <Accordion.Panel>Ja, nachdem Sie Ihren Favoriten ausgewählt haben, stellen wir Ihnen die Kontaktdaten des Anbieters zur Verfügung, damit Sie ihn direkt kontaktieren und weiterführende Informationen anfordern können.</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default FAQ;
