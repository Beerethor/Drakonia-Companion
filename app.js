import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurazione Firebase Drakonia-Companion
const firebaseConfig = {
  apiKey: "AIzaSyCW7QYU-iMAln3hUrVHuoLJzEDoUEfLJnM",
  authDomain: "drakonia-companion.firebaseapp.com",
  projectId: "drakonia-companion",
  storageBucket: "drakonia-companion.firebasestorage.app",
  messagingSenderId: "803844500713",
  appId: "1:803844500713:web:c902b67f4e395bd20c9478"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- GESTIONE SESSIONE E PROFILO ---
onAuthStateChanged(auth, async (user) => {
    const authBtn = document.getElementById('auth-btn');
    const userAvatar = document.getElementById('user-avatar');
    const badge = document.getElementById('account-level');

    if (user) {
        // Utente Loggato
        authBtn.classList.add('hidden');
        userAvatar.classList.remove('hidden');
        
        // Imposta immagine (Google o default fantasy)
        userAvatar.src = user.photoURL || "https://img.icons8.com/color/96/fantasy.png";

        // Recupera ruolo da Firestore (Collezione users)
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const role = userDoc.exists() ? userDoc.data().role : "player";
            badge.innerText = role;
            badge.className = 'badge level-' + role.toLowerCase();
        } catch (e) {
            console.error("Errore recupero ruolo:", e);
        }
    } else {
        // Utente Ospite
        authBtn.classList.remove('hidden');
        userAvatar.classList.add('hidden');
        authBtn.onclick = () => window.location.href = 'login.html';
        badge.innerText = "Ospite";
        badge.className = 'badge';
    }
});

// --- NAVIGAZIONE INTERNA ---
window.showSection = (id) => {
    const display = document.getElementById('content-display');
    const buttons = document.querySelectorAll('.main-nav button');
    
    // Reset stile bottoni
    buttons.forEach(b => b.classList.remove('active'));
    if(event && event.target) event.target.classList.add('active');

    const contents = {
        'campagne': '<h3>Le Tue Avventure</h3><p>Nessuna campagna attiva nel dominio di Drakonia.</p>',
        'sessione': '<h3>Tavolo da Gioco</h3><div id="dice-log">Il fato attende un tuo lancio...</div>',
        'regolamento': '<h3>Sistema BOSS v1.2</h3><p>Lancia 2D6: se il totale è inferiore o uguale alla tua Caratteristica, hai successo!</p>'
    };
    display.innerHTML = contents[id] || 'Sezione in fase di scoperta...';
};

// --- MOTORE DADI BOSS ---
window.tiraD6 = () => {
    const res = Math.floor(Math.random() * 6) + 1;
    alert("Sguardo del Fato: " + res);
};

window.tiraDadiBOSS = (difficolta) => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const totale = d1 + d2;
    const log = document.getElementById('dice-log');
    
    if(log) {
        // Aggiunge il lancio in cima alla lista
        const entry = `<div style="border-bottom:1px solid rgba(0,0,0,0.1); padding:8px 0;">
                        <strong>Lancio BOSS:</strong> ${totale} <small>(${d1}+${d2})</small>
                       </div>`;
        log.innerHTML = entry + log.innerHTML;
    }
};

// --- UTILITY PWA ---
window.closeTooltip = () => {
    const tooltip = document.getElementById('pwa-tooltip');
    if(tooltip) tooltip.classList.add('hidden');
};
