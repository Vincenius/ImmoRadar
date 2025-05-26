import mjml2html from 'mjml'

const confirmTemplate = ({ register_url }) => mjml2html(`<mjml>
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
          <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">Dein Zugang ist bereit – Jetzt registrieren und loslegen!!</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">vielen Dank für deinen Kauf bei ${process.env.NEXT_PUBLIC_WEBSITE_NAME}!</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Falls du noch keinen Account hast, kannst du dich hier mit deinem Jahresabo registrieren:</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">
            <a href="${register_url}">${register_url}</a>
          </mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Falls der Link nicht funktioniert, kopiere ihn bitte und füge ihn in die Adressleiste deines Browsers ein.</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Vielen Dank für dein Vertrauen in ${process.env.NEXT_PUBLIC_WEBSITE_NAME}!</mj-text>
  
          <mj-text font-size="15px" color="#000" font-family="helvetica">Solltest du Fragen oder Verbesserungsvorschläge haben, kannst du mich jederzeit unter <a href="mailto:support@vertragsfabrik.com">support@vertragsfabrik.com</a> kontaktieren.</mj-text>
  
          <mj-text font-size="15px" color="#000" font-family="helvetica">Vincent von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`).html

export default confirmTemplate
