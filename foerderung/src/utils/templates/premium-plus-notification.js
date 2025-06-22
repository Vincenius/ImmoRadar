import mjml2html from 'mjml'

const notificationTemplate = (user) => mjml2html(`<mjml>
  <mj-head>
    <mj-style>
      a {
        color: #1098ad;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section background-color="#f3f3f3">
      <mj-column>
        <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Ein Nutzer hat Premium Plus angefragt!</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Email: ${user.Email}</mj-text>
        <mj-text font-size="15px" color="#000" font-family="helvetica">Telefonnummer: ${user.phone}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html

export default notificationTemplate
