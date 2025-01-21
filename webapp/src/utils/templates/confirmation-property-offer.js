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
            <h1>Willkommen bei ImmoRadar – Bestätige deine E-Mail-Adresse</h1>
          </mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Hallo ${name},</mj-text>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">vielen Dank, dass du dich für ImmoRadar entschieden hast. Wir freuen uns, dich dabei zu unterstützen, den perfekten Käufer für dein Grundstück zu finden – ganz nach unserer Philosophie: <i>"Wir holen dich dort ab, wo du stehst."</i></mj-text>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Jetzt starten</b>:</br>Bestätige bitte deine E-Mail-Adresse, damit wir dir die ersten potenziellen Käufer vorstellen können.</mj-text>
          
          <mj-button font-family="Helvetica" background-color="#0b7285" color="white" href="${confirm_url}">
            E-Mail Adresse bestätigen
          </mj-button>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">Sollte der Button nicht funktionieren, kannst du auch den folgenden Link in deinen Browser kopieren:</mj-text>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">
            <a href="${confirm_url}">${confirm_url}</a>
          </mj-text>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">Nach der Bestätigung erhältst du bald die ersten Vorschläge zu Käufern, die perfekt auf dein Grundstück abgestimmt sind.</mj-text>
  
          <mj-text font-size="15px" color="#000" font-family="helvetica">Bei Fragen steht dir unser Team jederzeit zur Verfügung.</mj-text>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">Herzliche Grüße,<br/>Dein ImmoRadar Team</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`).html

export default confirmTemplate
