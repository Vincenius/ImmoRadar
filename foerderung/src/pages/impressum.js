import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Title } from '@mantine/core';

const Imprint = () => {
    return (
        <Layout
        title="Impressum"
        description={`Das Impressum von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}
    >
            <Title order={1} my="xl">Impressum</Title>

            <Title order={2} my="md">Angaben gem. § 5 TMG:</Title>
            <p>
                Vincent Will<br />
                Landsberger Allee 171D<br />
                10369 Berlin<br />
                <b>Kontaktaufnahme:</b><br />
                E-Mail: vincent.will@immoradar.xyz<br />
            </p><br/>

            <p>
                Oliver Rausch<br />
                Sprengelstrasse 1<br />
                50735 Köln<br />
                <b>Kontaktaufnahme:</b><br />
                E-Mail: oliver.rausch@immoradar.xyz<br />
            </p><br/>

            {/* Umsatzsteuer-ID
            Umsatzsteuer-Identifikationsnummer gem. § 27 a Umsatzsteuergesetz:
            DE XXX XXX XXX */}

            <Title order={2} my="md">Haftung für Inhalte</Title>

            <p>
                Alle Inhalte unseres Internetauftritts wurden mit größter Sorgfalt und nach bestem Gewissen erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.<br/>
                Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntniserlangung einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von den o.g. Rechtsverletzungen werden wir diese Inhalte unverzüglich entfernen.
            </p>

            <Title order={2} my="md">Haftungsbeschränkung für externe Links</Title>

            <p>
                Unsere Webseite enthält Links auf externe Webseiten Dritter. Auf die Inhalte dieser direkt oder indirekt verlinkten Webseiten haben wir keinen Einfluss. Daher können wir für die „externen Links“ auch keine Gewähr auf Richtigkeit der Inhalte übernehmen. Für die Inhalte der externen Links sind die jeweilige Anbieter oder Betreiber (Urheber) der Seiten verantwortlich.
            </p>
            <p>
                Die externen Links wurden zum Zeitpunkt der Linksetzung auf eventuelle Rechtsverstöße überprüft und waren im Zeitpunkt der Linksetzung frei von rechtswidrigen Inhalten. Eine ständige inhaltliche Überprüfung der externen Links ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht möglich. Bei direkten oder indirekten Verlinkungen auf die Webseiten Dritter, die außerhalb unseres Verantwortungsbereichs liegen, würde eine Haftungsverpflichtung ausschließlich in dem Fall nur bestehen, wenn wir von den Inhalten Kenntnis erlangen und es uns technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern.
            </p>
            <p>
                Diese Haftungsausschlusserklärung gilt auch innerhalb des eigenen Internetauftrittes „fertighausradar.de“ gesetzten Links und Verweise von Fragestellern, Blogeinträgern, Gästen des Diskussionsforums. Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargestellten Informationen entstehen, haftet allein der Diensteanbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige Veröffentlichung lediglich verweist.
            </p>
            <p>
                Werden uns Rechtsverletzungen bekannt, werden die externen Links durch uns unverzüglich entfernt.
            </p>

            <Title order={2} my="md">Urheberrecht</Title>

            <p>Die auf unserer Webseite veröffentlichen Inhalte und Werke unterliegen dem deutschen Urheberrecht (http://www.gesetze-im-internet.de/bundesrecht/urhg/gesamt.pdf) . Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung des geistigen Eigentums in ideeller und materieller Sicht des Urhebers außerhalb der Grenzen des Urheberrechtes bedürfen der vorherigen schriftlichen Zustimmung des jeweiligen Urhebers i.S.d. Urhebergesetzes (http://www.gesetze-im-internet.de/bundesrecht/urhg/gesamt.pdf ). Downloads und Kopien dieser Seite sind nur für den privaten und nicht kommerziellen Gebrauch erlaubt. Sind die Inhalte auf unserer Webseite nicht von uns erstellt wurden, sind die Urheberrechte Dritter zu beachten. Die Inhalte Dritter werden als solche kenntlich gemacht. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte unverzüglich entfernen.</p>

            <br/>
            <p>Dieses Impressum wurde freundlicherweise von jurarat.de zur Verfügung gestellt.</p>
            <br/><br/>
        </Layout>
    );
};

export default Imprint;