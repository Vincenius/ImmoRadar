import Layout from '@/components/Layout/Layout';
import { Container, Title, Text, List } from '@mantine/core';

const AGB = () => {
    return (
        <Layout
            title="AGBs"
            description={`AGBs von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}
            withBackground={true}
            noindex={true}
        >
            <Container my="xl" size="sm">
                <Title order={1} my="xl">
                    Allgemeine Geschäftsbedingungen von Förderhaus24
                </Title>

                <List mb="md" type='ordered'>
                    <List.Item>Geltungsbereich</List.Item>
                    <List.Item>Vertragspartner</List.Item>
                    <List.Item>Vertragsschluss</List.Item>
                    <List.Item>Widerrufsrecht</List.Item>
                    <List.Item>Eigentumsvorbehalt</List.Item>
                    <List.Item>Sachmängelgewährleistung</List.Item>
                    <List.Item>Datenschutz</List.Item>
                    <List.Item>Änderungen der Allgemeinen Geschäftsbedingungen</List.Item>
                    <List.Item>Gerichtsstand</List.Item>
                    <List.Item>Schlussbestimmungen</List.Item>
                </List>

                <Title order={2} my="lg">
                    Allgemeine Geschäftsbedingungen
                </Title>

                <Title order={2} mt="xl" mb="md">1. Geltungsbereich</Title>
                <Text>
                    Für alle Lieferungen und Leistungen von Förderhaus24 an Verbraucher gelten diese Allgemeinen Geschäftsbedingungen (AGB).<br />
                    Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu einem Zwecke abschließt, der überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden kann.<br />
                    Für die Nutzung der Online-Plattform von Förderhaus24 ist eine kostenfreie Registrierung durch den Nutzer notwendig. Die Nutzung der Online-Plattform für Mitglieder ist nur im Rahmen der gesetzlichen Vorschriften sowie dieser AGB zulässig.
                </Text>

                <Title order={2} mt="xl" mb="md">2. Vertragspartner</Title>
                <Text>
                    Der Kaufvertrag kommt zustande mit Förderhaus24. Inhaber: Katja Wegener, Friedrichstrasse 9, 50321 Brühl.
                </Text>

                <Title order={2} mt="xl" mb="md">3. Vertragsschluss</Title>
                <Text>
                    Die Darstellung der Produkte im Förderhaus24 Online-Shop stellt kein rechtlich bindendes Angebot, sondern nur eine Aufforderung zur Bestellung dar.<br />
                    Durch Anklicken des Buttons [Kaufen/kostenpflichtig bestellen] geben Sie eine verbindliche Bestellung der auf der Bestellseite aufgelisteten Waren ab. Ihr Kaufvertrag kommt zustande, wenn wir Ihre Bestellung durch eine Auftragsbestätigung per E-Mail unmittelbar nach dem Erhalt Ihrer Bestellung annehmen.<br />
                    <br />
                    Wenn alle Angaben zutreffen und Sie die Checkbox zur sofortigen Vertragsausführung bei gleichzeitigem Erlöschen des Widerrufsrechts angeklickt haben, klicken Sie auf „Bezahlen und freischalten“. Bis zu diesem Zeitpunkt können Sie Eingabefehler jederzeit durch erneute Eingabe korrigieren.<br />
                    <br />
                    Das Widerrufsrecht erlischt, wenn der Verbraucher die Ausführung des Vertrages vor Ablauf der Widerrufsfrist ausdrücklich zustimmt und der Händler ihn über das Erlöschen des Widerrufsrechts nach Vertragsschluss informiert. Dies ist beispielsweise der Fall, wenn der Verbraucher eine für ihn individuell erstellte PDF-Datei, ein E-Book oder eine Software herunterlädt, bevor die 14-tägige Widerrufsfrist abgelaufen ist.<br />
                    <br />
                    Dieser Vorgang erfolgt, indem der Verbraucher die beiden entsprechenden Checkboxen anklickt und entsprechend bestätigt.<br />
                    Die gesetzliche Grundlage dafür ist § 356 Abs. 5 BGB.
                </Text>

                <Title order={2} mt="xl" mb="md">4. Widerrufsrecht</Title>
                <Text>
                    Wenn Sie Verbraucher sind (also eine natürliche Person, die die Bestellung zu einem Zweck abgibt, der weder Ihrer gewerblichen oder selbständigen beruflichen Tätigkeit zugerechnet werden kann), steht Ihnen nach Maßgabe der gesetzlichen Bestimmungen ein Widerrufsrecht zu.<br />
                    <br />
                    Machen Sie als Verbraucher von Ihrem Widerrufsrecht nach Ziffer 4.1 Gebrauch, so haben Sie die regelmäßigen Kosten der Rücksendung zu tragen, falls es auf Ihre Bestellung zutreffend ist.<br />
                    <br />
                    Im Übrigen gelten für das Widerrufsrecht die Regelungen, die im Einzelnen wiedergegeben sind in der folgenden:
                </Text>

                <Text fw="bold" mt="md">Widerrufsbelehrung</Text>
                <Text fw="bold" mt="md">Widerrufsrecht</Text>
                <Text mt="md">
                    Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.<br />
                    Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.<br />
                    <br />
                    Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses. Um Ihr Widerrufsrecht auszuüben, müssen Sie (Katja Wegener
                    Friedrichstrasse 9, 50321 Brühl und info@foerderhaus24.de) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail)
                    Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen nicht notwendigen Umgang zurückzuführen ist.<br /><br />
                    Über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
                    <br /><br />
                    Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
                </Text>

                <Title order={3} mt="md" mb="md">Folgen des Widerrufs</Title>
                <Text mt="md">
                    Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.<br />
                    <br />
                    Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrages unterrichten, an uns oder an (hier sind gegebenenfalls der Name und die Anschrift der von Ihnen zur Entgegennahme der Ware ermächtigten Person einzufügen) zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.<br /><br />
                    Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.<br /><br />
                    Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
                </Text>

                <Title order={3} mt="md" mb="md">Ausschluss des Widerrufsrechts</Title>
                <Text>
                    Das Widerrufsrecht besteht nicht, sofern Sie bei Abschluss des Rechtsgeschäfts in Ausübung einer gewerblichen oder selbständigen beruflichen Tätigkeit handeln und somit als Unternehmer gemäß § 14 BGB gelten.
                </Text>

                <Title order={3} mt="md" mb="md">Vorlage Muster-Widerrufsformular</Title>
                <Text>
                    (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)<br /><br />
                    – An Katja Wegener, Friedrichstrasse 9, 50321 Brühl, info@foerderhaus24.de:<br />
                    – Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)<br />
                    – Bestellt am (*)/erhalten am (*)<br />
                    – Name des/der Verbraucher(s)<br />
                    – Anschrift des/der Verbraucher(s)<br />
                    – Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)<br />
                    – Datum __________<br /><br />
                    (*) Unzutreffendes streichen
                </Text>

                <Title order={2} mt="xl" mb="md">5. Eigentumsvorbehalt</Title>
                <Text>
                    Bis zur vollständigen Zahlung bleiben die im Foerderhaus24-Shop erworbenen Produkte unser Eigentum.
                </Text>

                <Title order={2} mt="xl" mb="md">6. Sachmängelgewährleistung</Title>
                <Text>
                    Förderhaus24 haftet für Sachmängel nach den hierfür geltenden gesetzlichen Vorschriften, insbesondere §§ 434 ff BGB.<br />
                    Die Haftung von Förderhaus24 für vertragsuntypische oder unvorhersehbare Schäden ist ausgeschlossen. Dies gilt nicht, sofern der Schaden Leben, Körper oder die Gesundheit betrifft, vorsätzlich oder grob fahrlässig herbeigeführt wurde, aus dem Nichtvorhandensein einer garantierten Beschaffenheit oder aus der schuldhaften Verletzung einer vertragswesentlichen Pflicht resultiert, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglichen und auf deren Einhaltung der Vertragspartner regelmäßig vertrauen dar.
                    <br />
                    Die Haftung nach dem Produkthaftungsgesetz bleibt davon unberührt. Die Förderhaus24 haftet im gesetzlichen Rahmen nicht für Produktfehler, falsche oder irreführende Informationen des Herstellers oder solchen, die vom Hersteller zu einzelnen Produkten übernommen werden.
                </Text>

                <Title order={3} mt="md" mb="md">Haftungsausschluss für technische Schäden</Title>
                <Text>
                    Für Schäden an Geräten, Software oder Daten, die durch die Nutzung unserer Dienste oder Inhalte entstehen, haftet Förderhaus24 ungeachtet des Rechtsgrunds nur bei vorsätzlichem oder grob fahrlässigem Verhalten oder bei Verletzung wesentlicher Vertragspflichten (sog. Kardinalpflichten).<br /><br />
                    Bei leicht fahrlässiger Verletzung von Kardinalpflichten ist die Haftung auf den vertragstypisch vorhersehbaren Schaden begrenzt. <br /><br />
                    Eine weitergehende Haftung, insbesondere für mittelbare Schäden, Folgeschäden oder entgangenen Gewinn wird ausgeschlossen.
                </Text>

                <Title order={2} mt="xl" mb="md">7. Datenschutz</Title>
                <Text>
                    Alle Informationen zu Datenschutz und Datensicherheit findest du in unserer Datenschutzerklärung: <a href="https://www.foerderhaus24.de/datenschutz" target="_blank" rel="noopener noreferrer">https://www.foerderhaus24.de/datenschutz</a>
                </Text>

                <Title order={2} mt="xl" mb="md">8. Änderungen der Allgemeinen Geschäftsbedingungen</Title>
                <Text>
                    Diese AGB stehen unter dem Vorbehalt jederzeitiger Änderung durch Förderhaus24.<br /><br />
                    Die Änderungen und die neuen AGB werden dir per E-Mail mitgeteilt. Die neuen AGB gelten als vereinbart, wenn Sie ihrer Geltung nicht innerhalb von sechs Wochen nach Zugang der E-Mail widersprechen. Der Widerspruch bedarf der Textform. Förderhaus24 wird dich in der E-Mail auf die Widerspruchsmöglichkeit, die Frist, die Form und die Folgen deiner Untätigkeit gesondert hinweisen.
                </Text>

                <Title order={2} mt="xl" mb="md">9. Gerichtsstand</Title>
                <Text>
                    Ist der Kunde Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, so ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis der Sitz unseres Unternehmens.<br /><br />
                    Für Verbraucher gilt das gesetzliche Gerichtsstandsrecht.
                </Text>

                <Title order={2} mt="xl" mb="md">10. Schlussbestimmungen</Title>
                <Text>
                    Auf das Vertragsverhältnis zwischen dir und der Anbieterin sowie auf diese Nutzungsbedingungen findet ausschließlich das Recht der Bundesrepublik Deutschland Anwendung. Die Anwendung des deutschen Internationalen Privatrechts und UN-Kaufrechts ist ausgeschlossen.
                </Text>
            </Container>
        </Layout>
    );
};

export default AGB;
