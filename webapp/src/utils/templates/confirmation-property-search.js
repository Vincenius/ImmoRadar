import mjml2html from 'mjml'

const confirmTemplate = ({ confirm_url, name }) => mjml2html(`<mjml>
  <mj-head>
    <mj-style>
      a {
      color: #1098ad;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-group>
        <mj-column vertical-align="middle">
          <mj-image href="https://fertighausradar.de" width="300px" src="https://fertighausradar.de/email-header.png"></mj-image>
        </mj-column>
      </mj-group>
    </mj-section>
    <mj-section background-color="#f3f3f3">
      <mj-column>
        <mj-text>
          <h1>Willkommen bei Fertighaus Radar – Bestätige deine E-Mail-Adresse</h1>
        </mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Hallo ${name},</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">vielen Dank, dass du dich für Fertighaus Radar entschieden hast. Wir freuen uns, dich dabei zu unterstützen, den kürzesten Weg zu deinem Traumgrundstück zu finden – ganz nach unserer Philosophie: <i>"Wir holen dich dort ab, wo du stehst."</i></mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Jetzt starten</b>: Bestätige bitte deine E-Mail-Adresse, damit wir dir deine ersten individuell abgestimmten Grundstücksvorschläge zusenden können.</mj-text>

        <mj-button font-family="Helvetica" background-color="#0b7285" color="white" href="${confirm_url}">
          E-Mail Adresse bestätigen
        </mj-button>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Sollte der Link nicht funktionieren, kopiere bitte die folgende URL in deinen Browser:</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">
          <a href="${confirm_url}">${confirm_url}</a>
        </mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Was dich erwartet:</b><br />Nach der Bestätigung erhältst du schon bald Vorschläge, die perfekt zu deinen Wünschen passen.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Unser Versprechen:</b><br />Wir begleiten dich von der Suche bis zum Finden – effizient, einfach und genau auf deine Bedürfnisse zugeschnitten.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><br />Du weißt nicht, wie viel Budget dir für ein Grundstück zur Verfügung steht? <a href="https://fertighausradar.de/budgetrechner">Nutze jetzt unseren Budgetrechner!</a></mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Falls du Fragen hast, steht dir unser Team jederzeit zur Verfügung.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Herzliche Grüße,<br />Dein Fertighaus Radar Team</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default confirmTemplate
