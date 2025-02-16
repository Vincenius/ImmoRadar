import pdf from 'html-pdf';
import showdown from 'showdown'
import { v4 as uuidv4 } from 'uuid';

const converter = new showdown.Converter()

const generatePdf = (subsidies) => new Promise((resolve, reject) => {
  let html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h1, h2, h3 {
          font-family: Arial, sans-serif;
        }
        a {
          color: blue;
          text-decoration: none;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <h1>Förderungen - ImmoRadar PDF Report</h1>
      <h2>Inhaltsverzeichnis</h2>
      <ul>
  `;

  // Inhaltsverzeichnis erstellen
  for (const subsidy of subsidies) {
    html += `<li>${subsidy.Name}</li>`;
  }

  html += `</ul>`;

  // Inhalte der Förderungen hinzufügen
  for (const subsidy of subsidies) {
    const url = new URL(subsidy.Website);
    const baseUrl = url.origin;

    html += `
      <div class="page-break"></div>
      <h2 id="${subsidy.Name.replace(/\s+/g, '-')}">${subsidy.Name}</h2>
      <p><strong>Offizielle Webseite:</strong> <a href="${subsidy.Website}">${baseUrl}</a></p>
    `;

    if (subsidy.MaxFundingRate || subsidy.BaseFundingRate || subsidy.ApplicationDeadline) {
      html += `<p>`;
      if (subsidy.MaxFundingRate) {
        html += `<strong>Maximale Förderrate:</strong> ${subsidy.MaxFundingRate}</br>`;
      }
      if (subsidy.BaseFundingRate) {
        html += `<strong>Basisförderrate:</strong> ${subsidy.BaseFundingRate}</br>`;
      }
      if (subsidy.ApplicationDeadline) {
        html += `<strong>Antragsfristen:</strong> ${subsidy.ApplicationDeadline}</br>`;
      }
      html += `</p>`;
    }

    if (subsidy.Requirements) {
      html += `<h3>Voraussetzungen</h3>`;;
      html += `<p>${converter.makeHtml(subsidy.Requirements)}</p>`;
    }

    if (subsidy.Measures) {
      html += `<h3>Förderfähige Maßnahmen</h3>`;
      html += `<p>${subsidy.Measures.join(', ')}</p>`;
    }

    if (subsidy.Accumulation) {
      html += `<h3>Kumulierung mit anderen Programmen</h3>`;
      html += `<p>${subsidy.Accumulation}</p>`;
    }
  }

  html += `</body></html>`;

  // PDF mit html-pdf erstellen
  const pdfOptions = {
    format: 'A4',
    "border": {
      "top": "1in",
      "right": "0.5in",
      "bottom": "1in",
      "left": "0.5in"
    },
  };
  const fileName = uuidv4()
  pdf.create(html, pdfOptions).toFile(`./tmp/${fileName}.pdf`, (err, res) => {
    if (err) { reject(err) }
    resolve(res); // { filename: '/path/to/test.pdf' }
  });
})

export default generatePdf
