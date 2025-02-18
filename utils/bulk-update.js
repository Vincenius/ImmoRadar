require('dotenv').config()

const apiKey = process.env.NOCODB_KEY; // Dein NocoDB API-Key
const baseUrl = 'https://admin.immoradar.xyz/api/v2'; // NocoDB URL
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

// Hauptfunktion, um alle Einträge zu aktualisieren
async function updateAllRecords() {
  try {
    const records = await fetchAllRecords();
    console.log(records.list.length)

    for (const record of records.list) {
      // if (record.Measures.includes('Altersgerechter Umbau & Einbruchschutz')) {
      //   await updateRecord(record.Id, { Measures: record.Measures.replace('Altersgerechter Umbau & Einbruchschutz', 'Altersgerechter Umbau,Einbruchschutz') });
      //   console.log(`Eintrag ${record.Id} wurde aktualisiert.`);
      // }
    }

    console.log('Alle Einträge wurden erfolgreich aktualisiert.');
  } catch (error) {
    console.error('Fehler:', error);
  }
}

// Start
updateAllRecords();
