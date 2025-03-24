import mjml2html from 'mjml'

const confirmTemplate = ({ reset_url }) => mjml2html(`<mjml>
    <mj-head>
      <mj-style>
        a {
          color: #1971c2;
        }
      </mj-style>
    </mj-head>
    <mj-body>
      <mj-section background-color="#f3f3f3">
        <mj-column>
          <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Passwort zurücksetzen!</mj-text>
          <mj-text font-size="16px" line-height="28px" font-family="Helvetica, Arial, sans-serif" color="#555555">
            Hallo,
          </mj-text>
          <mj-text font-size="16px" line-height="28px" font-family="Helvetica, Arial, sans-serif" color="#555555">
            Du hast eine Anfrage gestellt, um dein Passwort zurückzusetzen. Klicke auf den folgenden Button, um dein Passwort zurückzusetzen.<br/>Dieser Link ist nur für 24 Stunden gültig.
          </mj-text>
          <mj-button background-color="#1971c2" color="#ffffff" font-size="16px" line-height="28px" font-family="Helvetica, Arial, sans-serif" href="${reset_url}">
            Passwort zurücksetzen
          </mj-button>
          <mj-text font-size="14px" line-height="21px" font-family="Helvetica, Arial, sans-serif" color="#999999">
            Wenn du das Zurücksetzen deines Passworts nicht angefordert hast, kannst du diese E-Mail ignorieren.
          </mj-text>
          <mj-text font-size="14px" line-height="21px" font-family="Helvetica, Arial, sans-serif" color="#999999">
            Beste Grüße,<br />
            Vincent von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`).html

export default confirmTemplate
