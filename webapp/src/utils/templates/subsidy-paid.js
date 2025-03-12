import mjml2html from 'mjml'

const subsidyTemplate = () => mjml2html(`<mjml>
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
        <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Vielen Dank für deinen Kauf!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Wir freuen uns, dir den vollständigen Förderungs-Report zu deinem Bauprojekt überreichen zu können.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Im Anhang findest du alle wichtigen Informationen und maßgeschneiderten Fördermöglichkeiten, die dir helfen werden, dein Projekt erfolgreich umzusetzen.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Falls du Fragen hast oder weitere Unterstützung benötigst, stehe ich dir gerne zur Verfügung. Du erreichst mich jederzeit unter <a href="mailto:vincent.will@immoradar.xyz">vincent.will@immoradar.xyz</a>.</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Wir wünschen dir viel Erfolg bei deinem Bauvorhaben!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Viele Grüße,<br>Vincent von Fertighaus Radar</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default subsidyTemplate
