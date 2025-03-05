import mjml2html from 'mjml'

const getEstateElem = ({ gallery, url, title, address, provider, price, livingSpace, rooms }) => `
<mj-column border="10px solid white" background-color="#f3f3f3">
  <mj-image href="${url}" height="180px" width="300px" css-class="estate-image" src="${(gallery && gallery[0]) ? gallery[0].url : 'https://www.fertighausradar.de/fallback.jpg'}" padding="0px" fluid-on-mobile="true" />

  <mj-text font-family="Helvetica" padding="0 10px 10px">
    <h2>
      <a href="${url}" style="color:#000; text-decoration:none;">${title}</a>
    </h2>

    <p style="line-height:1.3em;">
      <svg style="margin-bottom: -3px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1098ad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
      </svg>
      ${[address.street, address.district, address.zipCode, address.city].filter(Boolean).join(', ')}
    </p>

    <p style="line-height:1.3em; margin-bottom: -0.3em;">
      <a href="${url}"><svg style="margin-bottom: -3px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1098ad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 15l6 -6"></path>
          <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
          <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>
        </svg>
        ${provider}
      </a>
    </p>
  </mj-text>

  <mj-table padding="10px">
    <tr style="text-align:left; font-size:1.2em">
      <th style="padding: 0 15px 0 0;">${price.value} €</th>
      <th style="padding: 0 15px;">${livingSpace} m²</th>
      <th style="padding: 0 0 0 15px;">${rooms}</th>
    </tr>
    <tr style="text-align:left;">
      <td style="padding: 0 15px 0 0;">${price.additionalInfo === 'WARM_RENT'
        ? 'Warmmiete'
        : price.additionalInfo === 'COLD_RENT' ? 'Kaltmiete' : 'Miete'}
      </td>
      <td style="padding: 0 15px;">Wohnfläche</td>
      <td style="padding: 0 0 0 15px;">Zimmer</td>
    </tr>
  </mj-table>
</mj-column>`

const getTemplate = ({ count, estates, token, emailToken }) => {
  let mjmlCode = `<mjml>
    <mj-head>
      <mj-style>
        a {
          color: #1098ad;
        }
        .estate-image img {
          object-fit: cover;
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
          <mj-text font-weight="bold" font-size="24px" color="#000" font-family="helvetica">${count > 50 ? '50+' : count} neue Wohnungen</mj-text>
          <mj-text font-size="15px" color="#000" font-family="helvetica">
            <p>Auf Basis deiner  <a href="https://www.fertighausradar.de/profile?id=${token}">Benachrichtigungseinstellungen</a> haben wir ${count} neue Wohnungen für dich gefunden.${count > 50 ? ' Hier sind die 50 neuesten Angebote.' : ''}</p>
            <p style="margin-bottom: 0;">Ich hoffe es ist etwas für dich dabei!</p>
          </mj-text>
        </mj-column>
      </mj-section>`

  for (let i = 0; i < estates.length; i = i + 2) {
    mjmlCode += `
      <mj-section>
        ${getEstateElem(estates[i])}
        ${estates[i + 1] ? getEstateElem(estates[i + 1]) : '<mj-column></mj-column>'}
      </mj-section>`
  }

  mjmlCode += `<mj-section background-color="#f3f3f3">
        <mj-column>
          <mj-text font-size="15px" color="#000" font-family="helvetica">Solltest du Fragen oder Verbesserungsvorschläge haben, kannst du mich jederzeit unter <a href="mailto:vincent.will@immoradar.xyz">vincent.will@immoradar.xyz</a> kontaktieren.</mj-text>
  
          <mj-text font-size="15px" color="#000" font-family="helvetica">Vincent von ImmoRadar</mj-text>
        </mj-column>
      </mj-section>
  
      <mj-section>
        <mj-column>
          <mj-text font-size="12px" color="#000" font-family="helvetica" align="center"><a href="https://www.fertighausradar.de/profile?id=${token}">Benachrichtigungen verwalten</a></mj-text>
        </mj-column>
        <mj-column>
          <mj-text font-size="12px" color="#000" font-family="helvetica" align="center"><a href="https://www.fertighausradar.de/api/unsubscribe?token=${token}">Newsletter Abbestellen</a></mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column vertical-align="middle">
          <mj-image href="https://www.fertighausradar.de" src="https://www.fertighausradar.de/api/email/pixel/${emailToken}" width="10px" height="10px"></mj-image>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`

  return mjml2html(mjmlCode).html
}

export default getTemplate