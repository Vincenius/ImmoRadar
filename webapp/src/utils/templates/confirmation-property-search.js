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
          <mj-image href="https://immoradar.xyz" width="300px" src="https://immoradar.xyz/email-header.png"></mj-image>
        </mj-column>
      </mj-group>
    </mj-section>
    <mj-section background-color="#f3f3f3">
      <mj-column>
        <mj-text>
          <h1>Willkommen bei ImmoRadar – Bestätigen Sie Ihre E-Mail-Adresse</h1>
        </mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Hallo ${name},</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">vielen Dank, dass Sie sich für ImmoRadar entschieden haben. Wir freuen uns, Sie dabei zu unterstützen, den kürzesten Weg zu Ihrem Traumgrundstück zu finden – ganz nach unserer Philosophie: <i>"Wir holen Sie dort ab, wo Sie stehen."</i></mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Jetzt starten</b>: Bestätigen Sie bitte Ihre E-Mail-Adresse, damit wir Ihnen Ihre ersten individuell abgestimmten Grundstücksvorschläge zusenden können.</mj-text>

        <mj-button font-family="Helvetica" background-color="#0b7285" color="white" href="${confirm_url}">
          E-Mail Adresse bestätigen
        </mj-button>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Sollte der Link nicht funktionieren, kopieren Sie bitte die folgende URL in Ihren Browser:</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">
          <a href="${confirm_url}">${confirm_url}</a>
        </mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Was Sie erwartet:</b><br />Nach der Bestätigung erhalten Sie schon bald Vorschläge, die perfekt zu Ihren Wünschen passen.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Unser Versprechen:</b><br />Wir begleiten Sie von der Suche bis zum Finden – effizient, einfach und genau auf Ihre Bedürfnisse zugeschnitten.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica"><br />Sie wissen nicht, wie viel Budget Ihnen für ein Grundstück zur Verfügung steht? <a href="https://immoradar.xyz/budgetrechner">Nutzen Sie jetzt unseren Budgetrechner!</a></mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Falls Sie Fragen haben, steht Ihnen unser Team jederzeit zur Verfügung.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Herzliche Grüße,<br />Ihr ImmoRadar Team</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default confirmTemplate
