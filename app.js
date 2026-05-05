import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurazione Firebase (Sostituisci con i tuoi dati)
const firebaseConfig = {
    apiKey: "IL_TUO_API_KEY",
    authDomain: "drakonia-app.firebaseapp.com",
    projectId: "drakonia-app",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- GESTIONE UTENTE E RUOLI ---
onAuthStateChanged(auth, async (user) => {
    const authBtn = document.getElementById('auth-btn');
    const levelBadge = document.getElementById('account-level');

    if (user) {
        authBtn.innerText = "Logout";
        authBtn.onclick = () => signOut(auth);
        
        // Recupera ruolo da Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const role = userDoc.data().role; // 'founder', 'master', or 'player'
            updateUIByRole(role);
        }
    } else {
        authBtn.innerText = "Accedi";
        authBtn.onclick = () => window.location.href = 'login.html';
        updateUIByRole('player');
    }
});

function updateUIByRole(role) {
    const badge = document.getElementById('account-level');
    badge.innerText = role;
    badge.className = 'badge level-' + role.toLowerCase();
}

// --- NAVIGAZIONE SEZIONI ---
window.showSection = function(sectionId) {
    const display = document.getElementById('content-display');
    const buttons = document.querySelectorAll('.main-nav button');
    
    // Update active button style
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const content = {
        'campagne': '<h3>Le Tue Avventure</h3><p>Nessuna campagna attiva. Unisciti a un Master!</p>',
        'sessione': '<h3>Tavolo da Gioco</h3><div id="dice-log">Benvenuto. Tira i dadi per iniziare.</div>',
        'regolamento': '<h3>Codice di Drakonia</h3><p><strong>BOSS v1.2:</strong> Successo con 2D6 <= Caratteristica.</p>'
    };
    
    display.innerHTML = content[sectionId] || 'In costruzione...';
}

// --- MOTORE DADI BOSS v1.2 ---
window.tiraD6 = () => {
    const res = Math.floor(Math.random() * 6) + 1;
    alert("Risultato D6: " + res);
};

window.tiraDadiBOSS = (difficolta) => {
    let dadi = [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1);
    dadi.sort((a, b) => a - b);
    
    let risultato;
    if (difficolta === 'Facile') risultato = dadi[0] + dadi[1];
    else if (difficolta === 'Difficile') risultato = dadi[1] + dadi[2];
    else risultato = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // Normale 2D6

    const log = document.getElementById('dice-log');
    if(log) log.innerHTML = `<strong>Lancio ${difficolta}:</strong> ${risultato} <br>` + log.innerHTML;
};

// --- FUNZIONI UI ---
window.openCreator = () => alert("Apertura creazione eroe...");
window.openArchive = () => alert("Accesso all'archivio PG...");
window.closeTooltip = () => document.getElementById('pwa-tooltip').classList.add('hidden');

// Gestione Tooltip PWA per iOS
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos() && !isInStandaloneMode()) {
    document.getElementById('pwa-tooltip').classList.remove('hidden');
}
