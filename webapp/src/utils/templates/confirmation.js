import mjml2html from 'mjml'

const confirmTemplate = ({ confirm_url }) => mjml2html(`<mjml>
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
            <mj-image width="300px" src="https://immoradar.xyz/email-header.png"></mj-image>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section background-color="#f3f3f3">
        <mj-column>
          <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Bestätige deine Anmeldung!</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">vielen Dank für deine Anmeldung bei ImmoRadar!</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Um sicherzustellen, dass du Benachrichtigungen über neue Wohnungen erhältst, bitten wir dich, deine E-Mail-Adresse zu bestätigen.</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Bitte klicke auf den folgenden Link, um deine E-Mail-Adresse zu bestätigen:</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">
            <a href="${confirm_url}">${confirm_url}</a>
          </mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Falls der Link nicht funktioniert, kopiere ihn bitte und füge ihn in die Adressleiste deines Browsers ein.</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Vielen Dank für dein Vertrauen in ImmoRadar! Wir freuen uns darauf, dir die besten Angebote für Wohnungen in deiner gewünschten Region zu senden.</mj-text>
  
          <mj-text font-size="15px" color="#000" font-family="helvetica">Solltest du Fragen oder Verbesserungsvorschläge haben, kannst du mich jederzeit unter <a href="mailto:vincent@immoradar.xyz">vincent@immoradar.xyz</a> kontaktieren.</mj-text>
  
          <mj-text font-size="15px" color="#000" font-family="helvetica">Vincent von ImmoRadar</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`).html

export default confirmTemplate
