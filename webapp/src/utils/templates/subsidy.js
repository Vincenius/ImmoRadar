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
        <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Dein Förderungs-Report ist da!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Vielen Dank für dein Vertrauen in FertighausRadar!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Im Anhang findest du deinen personalisierten Report mit allen relevanten Fördermöglichkeiten für dein Bauprojekt.</mj-text>

        <mj-text font-size="15px" color="#000" font-family="helvetica">Falls du Fragen hast oder Feedback geben möchtest, erreichst du mich jederzeit unter <a href="mailto:vincent.will@immoradar.xyz">vincent.will@immoradar.xyz</a>.</mj-text>
        
        <mj-text font-size="15px" color="#000" font-family="helvetica">Viele Grüße,<br>Vincent von FertighausRadar</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default subsidyTemplate
