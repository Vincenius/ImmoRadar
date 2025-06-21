require('dotenv').config()

const apiKey = process.env.NOCODB_KEY; // Dein NocoDB API-Key
const baseUrl = `${process.env.NOCODB_URI}/api/v2`; // NocoDB URL
const tableId = 'mnc1qd2t096094t'; // Tabelle-ID oder Name


// Funktion, um alle Einträge zu holen
async function fetchAllRecords() {
  const response = await fetch(`${baseUrl}/tables/mnc1qd2t096094t/records?limit=1000`, {
    headers: {
      'xc-token': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Abrufen der Einträge');
  }

  return await response.json();
}

// Funktion, um einen einzelnen Eintrag zu aktualisieren
async function updateRecord(recordId, updates) {
  const response = await fetch(`${baseUrl}/tables/${tableId}/records`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'xc-token': apiKey,
    },
    body: JSON.stringify({
      Id: recordId,
      ...updates
    }),
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Aktualisieren von Eintrag ${recordId}`);
  }

  return await response.json();
}

function revertMarkdown(text) {
  if (!text) return text;
  
  // Add "* " before ⬜ if it does not have "*" or "number." before it on the same line
  return text.replace(/^(\s*)⬜/gm, "$1* ⬜");
}


// Hauptfunktion, um alle Einträge zu aktualisieren
async function updateAllRecords() {
  try {
    const records = await fetchAllRecords();
    console.log(records.list.length)

    for (const record of records.list) {
      if (
        (record.Guidance && record.Guidance.includes('⬜'))
      ) {
//         if (record.Name === 'Stuttgarter Solaroffensive') {
//           const fixed = `# Solaroffensive – Stadt Stuttgart  
// (Zuschüsse für Photovoltaik, Solarthermie und Batteriespeicher) 📍  
// [Zur offiziellen Programmseite](https://www.stuttgart.de/leben/umwelt/energie/foerderprogramme/solaroffensive.php)

// ---

// #### 1. Ziel des Programms verstehen  
// Die Stadt Stuttgart fördert mit der _„Solaroffensive“_ die Nutzung von **Solarenergie** durch finanzielle Zuschüsse für:  
// - _Photovoltaikanlagen_  
// - Solarthermieanlagen  
// - _Batteriespeicher_  
// - Beratungsleistungen  

// ---

// #### 2. Förderfähige Maßnahmen ✅  
// Gefördert werden unter anderem:  
// - **Photovoltaikanlagen** (auch auf Nebengebäuden, Garagen oder Fassaden)  
// - **Solarthermieanlagen** zur Warmwasserbereitung oder Heizungsunterstützung  
// - **Stromspeicher (Batterien)** im Zusammenhang mit einer **PV-Anlage**  
// - **Beratungs- und Planungsleistungen** durch Fachleute  
// - **Zusatzbonus:** Kombination mit **Begrünung** oder **Mieterstromkonzept**  

// ---

// #### 3. Zielgruppen ✅  
// Gefördert werden:  
// - **Private Hauseigentümer:innen**  
// - **Mieter:innen** (mit Einverständnis)  
// - **Wohnungseigentümergemeinschaften (WEG)**  
// - **Gewerbliche und institutionelle Eigentümer:innen**  
// - **Bauträger, Genossenschaften, Vereine**  
// → Voraussetzung: **Objekt muss im Stadtgebiet Stuttgart** liegen  

// ---

// #### 4. Förderkonditionen ✅  
// Förderung:  
// - **PV-Anlagen:** bis zu **2.000 €** Zuschuss, zusätzlich **300 €/kWp**  
// - **Solarthermie:** bis zu **2.000 €**  
// - **Stromspeicher:** bis zu **1.500 €**  
// - **Beratung:** bis zu **400 €**  
// - **Zusatz-Boni** möglich: z. B. **500 €** für **Gründach** in Kombination mit PV  
// - **Kombination mit Bundesförderung** (z. B. KfW, BAFA) möglich, keine **Doppelförderung**  

// ---

// #### 5. Voraussetzungen ✅ Antragsberechtigung:  
// - ⬜ Förderfähig sind **Maßnahmen an bauaufsichtlich genehmigten Gebäuden** innerhalb des Stadtgebiets Stuttgart  
// - ⬜ _Natürliche Personen_ und **Personengemeinschaften** (z. B. Eigentümergemeinschaften)  
// - ⬜ _Juristische Personen_ des öffentlichen und privaten Rechts  
// - ⬜ _Mieter oder Pächter_ mit **schriftlicher Zustimmung des Eigentümers**  
// - ⬜ _Die Antragstellung muss vor Beauftragung oder Beginn der Maßnahme erfolgen_  
//   - Ausnahme: _Steckerfertige Photovoltaikanlagen_ (Balkonmodule) können auch nachträglich beantragt werden  
// - ⬜ Die Förderung ist _kombinierbar mit Bundes- oder Landesprogrammen_, sofern diese das zulassen  
// - ⬜ Andere Fördermittel werden jedoch von der städtischen Förderung abgezogen  

// ---

// #### 6. Antragstellung – Schritt für Schritt ✅  
// - ⬜ _Internetseite aufrufen_  
//   Besuche die offizielle Informationsseite der Stadt Stuttgart.  
// - ⬜ _Antragstellung vor Maßnahmenbeginn notwendig_  
//   Antrag muss vor Beauftragung der Maßnahme gestellt werden! Eine **rückwirkende Förderung** ist ausgeschlossen.  
// - ⬜ **Antrag online über das BayernPortal**  
//   Gehe auf der Seite zu „Online-Dienste“. Klicke auf „Zum Online-Antrag“. Anmeldung mit _BayernID_ (z. B. elektronischer Personalausweis oder ELSTER-Zertifikat) erforderlich.  
// - ⬜ **Benötigte Unterlagen**  
//   - Ausgefülltes Antragsformular  
//   - Angebot/e der Fachfirma  
//   - Beschreibung der Maßnahme  
//   - ggf. Eigentumsnachweis oder Einverständniserklärung  
// - ⬜ **Nachweise einreichen & Zuschuss erhalten**  
//   Nach Umsetzung der Maßnahme sind einzureichen:  
//   - Rechnungen  
//   - Fotodokumentation  
//   - ggf. Inbetriebnahmeprotokoll  
//   Nach Prüfung erfolgt die Auszahlung des Zuschusses.  

// ✅ Der Zuschuss wird nach Prüfung auf dein Konto überwiesen.
// `
// await updateRecord(record.Id, { Guidance: fixed });
//         }
        // const newGuidance = record.Guidance && record.Guidance.replace(/\*\s+⬜/g, "⬜").replace(/\d+\.\s+⬜/g, "⬜").replaceAll('_⬜_', '⬜');

        // if (record.Guidance && newGuidance !== record.Guidance) {
        //   await updateRecord(record.Id, { Guidance: newGuidance });
        //   console.log(`Eintrag ${record.Id} Guidance wurde aktualisiert.`);
        // }
      }
    }

    console.log('Alle Einträge wurden erfolgreich aktualisiert.');
  } catch (error) {
    console.error('Fehler:', error);
  }
}

// Start
updateAllRecords();
