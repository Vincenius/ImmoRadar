import mjml2html from 'mjml'

const subsidyTemplate = (id) => mjml2html(`<mjml>
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
          <mj-image href="${process.env.BASE_URL}" width="300px" src="${process.env.BASE_URL}/imgs/logo.png"></mj-image>
        </mj-column>
      </mj-group>
    </mj-section>
    <mj-section background-color="#f3f3f3">
      <mj-column>
        <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Bitte bestätige deine E-Mail-Adresse</mj-text>
        
        <mj-text font-size="15px" color="#000" font-family="helvetica">Vielen Dank für dein Interesse an ${process.env.NEXT_PUBLIC_WEBSITE_NAME}!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Um deinen persönlichen Förderungs-Report herunterzuladen, bestätige bitte zuerst deine E-Mail-Adresse. Klicke dazu einfach auf folgenden Bestätigungslink:</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica"><a href="${process.env.BASE_URL}/email-bestaetigen?id=${id}">${process.env.BASE_URL}/email-bestaetigen?id=${id}</a></mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Bei Fragen oder Feedback erreichst du mich jederzeit unter <a href="mailto:support@foerderhaus24.de">support@foerderhaus24.de</a>.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Viele Grüße,<br>Vincent von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default subsidyTemplate
