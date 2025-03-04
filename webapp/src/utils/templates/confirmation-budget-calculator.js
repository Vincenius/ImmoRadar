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
          <mj-image href="https://www.fertighausradar.de" width="300px" src="https://www.fertighausradar.de/email-header.png"></mj-image>
        </mj-column>
      </mj-group>
    </mj-section>
    <mj-section background-color="#f3f3f3">
      <mj-column>
        <mj-text>
          <h1>Vielen Dank für deine Anmeldung!</h1>
        </mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Hallo ${name},</mj-text>
        
        <mj-text font-size="15px" color="#000" font-family="helvetica">vielen Dank, dass du unseren Budgetrechner genutzt hast. Wir freuen uns, dich auf dem Weg zu deinem Traumhaus zu begleiten.</mj-text>
        
        <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Dein nächster Schritt</b>:</br>In Kürze wird sich einer unserer Experten telefonisch bei dir melden, um deine individuelle Strategie zu besprechen.</mj-text>
        
          <mj-text font-size="15px" color="#000" font-family="helvetica"><b>Jetzt starten</b>:</br>Bestätige bitte deine E-Mail-Adresse.</mj-text>
          
          <mj-button font-family="Helvetica" background-color="#0b7285" color="white" href="${confirm_url}">
            E-Mail Adresse bestätigen
          </mj-button>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">Sollte der Button nicht funktionieren, kannst du auch den folgenden Link in deinen Browser kopieren:</mj-text>
          
          <mj-text font-size="15px" color="#000" font-family="helvetica">
            <a href="${confirm_url}">${confirm_url}</a>
          </mj-text>
        
        <mj-text font-size="15px" color="#000" font-family="helvetica">Unser Team freut sich darauf, dir bei der Verwirklichung deines Traumhauses zu helfen.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Bei Fragen stehen wir dir jederzeit zur Verfügung.</mj-text>
        
        <mj-text font-size="15px" color="#000" font-family="helvetica">Herzliche Grüße,<br/>Dein Fertighaus Radar Team</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`).html

export default confirmTemplate
