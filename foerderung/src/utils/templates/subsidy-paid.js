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
        <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Vielen Dank für deinen Kauf!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Wir freuen uns, dir den vollständigen Förderungs-Report zu deinem Bauprojekt überreichen zu können.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Im Anhang findest du alle wichtigen Informationen und maßgeschneiderten Fördermöglichkeiten, die dir helfen werden, dein Projekt erfolgreich umzusetzen.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Unter folgendem Link kannst du den Quickcheck beantworten, die dir sofort zeigen, ob du für die Förderung berechtigt bist:</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica"><a href="${process.env.BASE_URL}/report?id=${id}">${process.env.BASE_URL}/report</a></mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Falls du Fragen hast oder weitere Unterstützung benötigst, stehe ich dir gerne zur Verfügung. Du erreichst mich jederzeit unter <a href="mailto:support@foerderhaus24.de">support@foerderhaus24.de</a>.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Wir wünschen dir viel Erfolg bei deinem Bauvorhaben!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Viele Grüße,<br>Vincent von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default subsidyTemplate
