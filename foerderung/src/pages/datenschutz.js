import Layout from '@/components/Layout/Layout';
import { Container, Title, Text, List } from '@mantine/core';
import styles from '@/styles/Privacy.module.css';

const Privacy = () => {
    return <Layout
        title="Datenschutzerklärung"
        description={`Datenschutzerklärung von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}
        withBackground={true}
        noindex={true}
    >
        <Container my="xl">
            <Title order={1} my="xl">Datenschutzerklärung</Title>

            <Text mt="md" fw={700}>Name und Kontaktdaten der für Datenschutz verantwortlichen Person:</Text>
            <Text mt="xs">Vincent Will<br />Landsberger Allee 171D<br />10369 Berlin<br />E-Mail: <a href="mailto:info@foerderhaus24.de">info@foerderhaus24.de</a></Text>
            <Text mt="md">Katja Wegener<br />Friedrichstrasse 9<br />50321 Brühl<br />E-Mail: <a href="mailto:info@foerderhaus24.de">info@foerderhaus24.de</a></Text>

            <Title order={2} mt="xl">A. Umfang der Verarbeitung personenbezogener Daten</Title>
            <Text mt="md">
                Die Betreiber der Seite Förderhaus24 nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </Text>
            <Text mt="md">
                Förderhaus24 verarbeitet personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten unserer Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.
            </Text>
            <Text mt="md">
                Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adresse) erhoben werden, erfolgt dies auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. Förderhaus24 weist darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
            </Text>
            <Text mt="md">
                "Personenbezogene Daten" im Sinne dieser Datenschutzinformationen sind Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.
            </Text>
            <Text mt="md">
                "Verarbeiten" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführter Vorgang im Zusammenhang mit personenbezogenen Daten wie z. B. das Erheben, die Speicherung, die Anpassung oder Veränderung, die Verwendung oder die Offenlegung durch Übermittlung.
            </Text>

            <Title order={2} mt="xl">B Rechtsgrundlage für die Verarbeitung personenbezogener Daten </Title>
            <Text mt="md">
                Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der betroffenen Person einholen, dient Art. 6 Abs. 1a EU-Datenschutzgrundverordnung (DSGVO) als Rechtsgrundlage.
            </Text>
            <Text mt="md">
                Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen Vertragspartei die betroffene Person ist, erforderlich ist, dient Art. 6 Abs. 1b DSGVO als Rechtsgrundlage. Dies gilt auch für Verarbeitungsvorgänge, die zur Durchführung vorvertraglicher Maßnahmen erforderlich sind.
            </Text>
            <Text mt="md">
                Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, der Förderhaus24 unterliegt, dient Art. 6 Abs. 1c DSGVO als Rechtsgrundlage.
            </Text>
            <Text mt="md">
                Für den Fall, dass lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person eine Verarbeitung personenbezogener Daten erforderlich machen, dient Art. 6 Abs. 1d DSGVO als Rechtsgrundlage.
            </Text>
            <Text mt="md">
                Ist die Verarbeitung zur Wahrung eines berechtigten Interesses von Förderhaus24 oder eines Dritten erforderlich und überwiegen die Interessen, Grundrechte und Grundfreiheiten des Betroffenen dem erstgenannten Interesse nicht, so dient Art. 6 Abs. 1f DSGVO als Rechtsgrundlage für die Verarbeitung.
            </Text>

            <Title order={2} mt="xl">C Auskunftsrecht </Title>
            <Text mt="md">
                Sie können von den oben genannten verantwortlichen Personen eine Bestätigung darüber verlangen, ob personenbezogene Daten, die Sie betreffen, von uns verarbeitet werden. Bitte kontaktieren Sie uns, wenn Sie Ihr Recht zur Auskunft geltend machen möchten.
            </Text>
            <Text mt="md">
                Liegt eine solche Verarbeitung vor, können Sie von uns gemäß Art. 15 DSGVO über folgende Informationen Auskunft verlangen:
            </Text>
            <List listStyleType='lower-alpha' mt="md">
                <List.Item>Zweck: die Zwecke, zu denen die personenbezogenen Daten verarbeitet werden;</List.Item>
                <List.Item>Kategorien: die Kategorien von personenbezogenen Daten, welche verarbeitet werden;</List.Item>
                <List.Item>Offenlegung: die Empfänger bzw. die Kategorien von Empfängern, gegenüber denen die Sie betreffenden personenbezogenen Daten offengelegt wurden oder noch offengelegt werden;</List.Item>
                <List.Item>Dauer der Speicherung: die geplante Dauer der Speicherung der Sie betreffenden personenbezogenen Daten oder, falls konkrete Angaben hierzu nicht möglich sind, Kriterien für die Festlegung der Speicherdauer;</List.Item>
                <List.Item>Recht auf Berichtigung oder Löschung: das Bestehen eines Rechts auf Berichtigung oder Löschung der Sie betreffenden personenbezogenen Daten, eines Rechts auf Einschränkung der Verarbeitung durch die Verantwortlichen oder eines Widerspruchsrechts gegen diese Verarbeitung;</List.Item>
                <List.Item>Recht auf Beschwerde: das Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde;</List.Item>
                <List.Item>Herkunft der Daten: alle verfügbaren Informationen über die Herkunft der Daten, wenn die personenbezogenen Daten nicht bei der betroffenen Person erhoben werden;</List.Item>
                <List.Item>automatisierte Entscheidungsfindung: das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling gemäß Art. 22 Abs. 1 und 4 DSGVO und – zumindest in diesen Fällen – aussagekräftige Informationen über die involvierte Logik sowie die Tragweite und die angestrebten Auswirkungen einer derartigen Verarbeitung für die betroffene Person;</List.Item>
                <List.Item>Einschränkung der Verarbeitung: eine Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen, solange und soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen oder Förderhaus24 die Daten nicht mehr benötigt, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung eingelegt haben.</List.Item>
                <List.Item>Widerrufsrecht: Sie haben das Recht, Ihre datenschutzrechtliche Einwilligungserklärung jederzeit mit Wirkung für die Zukunft zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.</List.Item>
                <List.Item>Auskunft über Weitergabe: Sie haben das Recht, Auskunft darüber zu verlangen, ob die betreffenden personenbezogenen Daten in ein Drittland oder an eine internationale Organisation übermittelt werden. In diesem Zusammenhang können Sie verlangen, über die geeigneten Garantien gem. Art. 46 DSGVO im Zusammenhang mit der Übermittlung unterrichtet zu werden</List.Item>
            </List>
            <Text mt="md">Weitere Informationen zu Ihren Rechten in Bezug auf Ihre personenbezogenen Daten finden Sie exemplarisch. bei der Europäischen Kommission unter</Text>
            <Text mt="md"><a href="https://ec.europa.eu/info/law/law-topic/data-protection/reform/rights-citizens_de">https://ec.europa.eu/info/law/law-topic/data-protection/reform/rights-citizens_de</a>.</Text>

            <Title order={2} mt="xl">D Nutzung des Kontaktformulars</Title>
            <Text mt="md">
                Kontaktieren sie uns über das Kontaktformular, werden Ihre Angaben aus dem Anfrageformular einschließlich der von Ihnen angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten gibt Förderhaus24 nicht ohne Ihre Einwilligung weiter. Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt somit auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1a DSGVO). Sie können diese Einwilligung jederzeit widerrufen.
            </Text>
            <Text mt="md">
                Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z.B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen wie z.B. Aufbewahrungsfristen bleiben davon unberührt.
            </Text>

            <Title order={2} mt="xl">E Cookies</Title>
            <Text mt="md">
                Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </Text>
            <Text mt="md">
                Die meisten der von uns verwendeten Cookies sind sogenannte „Session-Cookies“. Sie werden nach Ihrem Besuch automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Diese Cookies ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
            </Text>
            <Text mt="md">
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen, sowie das automatische Löschen der Cookies beim Schließen des Browser aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
            </Text>
            <Text mt="md">
                Förderhaus24 verwendet auf der Website die folgenden Kategorien von Cookies:
            </Text>
            <List listStyleType='lower-alpha' mt="md">
                <List.Item>Erforderliche Cookies: Erforderliche Cookies umfassen sowohl technisch notwendige als auch funktionale Cookies. Die Notwendigkeit besteht darin, dass Sie sich auf der Website bewegen und ihre Funktionen umfassend nutzen können. Wir nutzen diese Cookies nicht zu Werbezwecken noch um von Ihnen ein Besucher- oder Nutzerprofil zu erstellen. Wir verarbeiten durch technisch notwendige Cookies erhobene Daten auf Basis von Art. 6 Abs. 1 lit. f DSGVO (Interessenabwägung).</List.Item>
                <List.Item>Funktionale Cookies: Funktionale Cookies speichern von Ihnen gewählte Optionen, z. B. die Region, von der aus Sie die Website besuchen. Dadurch haben wir die Möglichkeit, Ihnen die Website auf Ihre Bedürfnisse angepasst zur Verfügung zu stellen und Ihren Besuch möglichst angenehm zu gestalten. Die Daten, die dieser Typ Cookie erhebt, sind grundsätzlich anonymisiert und lassen keine Rückschlüsse auf Ihre Aktivitäten auf anderen Websites zu. Wir verarbeiten durch funktionale Cookies erhobene Daten auf Basis von Art. 6 Abs.1 lit. f DSGVO (Interessenabwägung).</List.Item>
                <List.Item>Performance-Cookies: Performance-Cookies erheben Daten über das Nutzungsverhalten der Websitebesucher auf der Website, z. B. welche Unterseiten häufig aufgerufen werden oder Fehlermeldungen auftreten. Die Interhyp AG erhebt und speichert diese Daten, um die Funktion der Website stetig zu verbessern. Förderhaus24 verarbeitet durch Performance-Cookies erhobene Daten auf der Basis Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</List.Item>
                <List.Item>Personalisierungs-Cookies: Personalisierungs-Cookies erheben Daten über Ihre Besuchsgewohnheiten auf der Website. Wir nutzen diese Daten, damit wir Ihnen interessante und relevante Werbung anbieten können. Zudem nutzen wir  die erhobenen Daten, um die Häufigkeit, mit der Sie eine Anzeige sehen, zu beschränken. Diese Cookies "merken" Ihre Besuche der Website. Wir verarbeiten durch Personalisierungs-Cookies erhobene Daten auf Basis Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</List.Item>
            </List>
        </Container>
    </Layout>
};

export default Privacy;