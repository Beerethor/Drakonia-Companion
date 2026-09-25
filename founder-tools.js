// Esegui con: node founder-tools.js
// Richiede: npm install firebase-admin
// e il file serviceAccountKey.json nella stessa cartella
// (Firebase Console > Impostazioni progetto > Account di servizio > Genera nuova chiave privata)
//
// IMPORTANTE: questo script gira SOLO sul tuo computer, da terminale.
// Non va mai caricato sul sito, in nessuna forma. L'Admin SDK ha accesso
// completo al progetto (bypassa tutte le regole Firestore) - per questo
// deve restare dove nessun browser può arrivarci.
//
// Sostituisce admin.html: non "rivela" mai una parola segreta (con l'hashing
// non è più leggibile da nessuno, nemmeno da te - è così che deve essere),
// ma ti permette di reimpostare la password di un utente che ha perso
// l'accesso e non è riuscito a recuperarla da solo.

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const readline = require("readline");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const authAdmin = admin.auth();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function trovaUid(username) {
    // Percorso veloce: usa il documento usernames/{username} se esiste
    const unameDoc = await db.collection("usernames").doc(username).get();
    if (unameDoc.exists) return unameDoc.data().uid;

    // Fallback: l'Admin SDK bypassa le regole, quindi puo' comunque
    // interrogare direttamente la collection users anche per i vecchi
    // account non ancora migrati.
    const snap = await db.collection("users").where("username", "==", username).get();
    if (snap.empty) return null;
    return snap.docs[0].id;
}

async function main() {
    const username = (await ask("Nome utente da cercare: ")).trim().toLowerCase();
    const uid = await trovaUid(username);

    if (!uid) {
        console.log("Nessun eroe trovato con questo nome.");
        rl.close();
        process.exit(0);
    }

    const userDoc = await db.collection("users").doc(uid).get();
    const data = userDoc.data() || {};
    const hashDoc = await db.collection("recoveryHashes").doc(uid).get();

    console.log(`\nTrovato: ${data.username || username}`);
    console.log(`  uid: ${uid}`);
    console.log(`  ruolo: ${data.role || "User"}`);
    console.log(`  friendCode: ${data.friendCode || "-"}`);
    console.log(`  Parola Segreta impostata (nuovo sistema): ${hashDoc.exists ? "sì" : "NO - da fare"}`);

    const azione = (await ask("\nCosa vuoi fare? [1] Reset password  [invio] niente > ")).trim();

    if (azione === "1") {
        const nuovaPass = await ask("Nuova password temporanea (min 6 caratteri): ");
        if (nuovaPass.length < 6) {
            console.log("Troppo corta, annullato.");
        } else {
            await authAdmin.updateUser(uid, { password: nuovaPass });
            console.log(`\nFatto. Comunica questa password a ${data.username} tu stesso,`);
            console.log(`con un canale che controlli (non email/chat del sito).`);
            console.log(`Digli di cambiarla subito e di impostare una Parola Segreta`);
            console.log(`da profile.html appena rientra, se non l'ha ancora fatto.`);
        }
    } else {
        console.log("Nessuna modifica effettuata.");
    }

    rl.close();
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
