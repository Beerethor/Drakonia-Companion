// Esegui UNA VOLTA con: node backfill-friendcodes.js
// Richiede: npm install firebase-admin
// e il file serviceAccountKey.json (scaricabile da Firebase Console >
// Impostazioni progetto > Account di servizio > Genera nuova chiave privata)
// nella stessa cartella.

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function backfill() {
  const usersSnap = await db.collection("users").get();
  let creati = 0, saltati = 0, senzaCodice = 0;

  for (const doc of usersSnap.docs) {
    const data = doc.data();
    const code = data.friendCode;

    if (!code) { senzaCodice++; continue; }

    const codeRef = db.collection("friendCodes").doc(code);
    const codeDoc = await codeRef.get();

    if (codeDoc.exists) { saltati++; continue; }

    await codeRef.set({
      uid: doc.id,
      username: data.username || "Eroe"
    });
    creati++;
    console.log(`Creato friendCodes/${code} -> ${data.username}`);
  }

  console.log(`\nFatto. Creati: ${creati}, già esistenti: ${saltati}, senza friendCode: ${senzaCodice}`);
  process.exit(0);
}

backfill().catch(e => { console.error(e); process.exit(1); });
