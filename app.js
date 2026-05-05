import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

onAuthStateChanged(auth, async (user) => {
    const authBtn = document.getElementById('auth-btn');
    const badge = document.getElementById('account-level');
    if (user) {
        authBtn.innerText = "Logout";
        authBtn.onclick = () => signOut(auth);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : "player";
        badge.innerText = role;
        badge.className = 'badge level-' + role.toLowerCase();
    } else {
        authBtn.innerText = "Accedi";
        authBtn.onclick = () => window.location.href = 'login.html';
        badge.innerText = "Ospite";
    }
});

window.showSection = (id) => {
    const display = document.getElementById('content-display');
    const buttons = document.querySelectorAll('.main-nav button');
    buttons.forEach(b => b.classList.remove('active'));
    if(event) event.target.classList.add('active');

    const contents = {
        'campagne': '<h3>Le Tue Avventure</h3><p>Nessuna campagna attiva nel dominio di Drakonia.</p>',
        'sessione': '<h3>Tavolo da Gioco</h3><div id="dice-log">Il fato attende un tuo lancio...</div>',
        'regolamento': '<h3>Sistema BOSS v1.2</h3><p>Lancia 2D6: se il totale è inferiore o uguale alla Caratteristica, hai successo!</p>'
    };
    display.innerHTML = contents[id];
};

window.tiraD6 = () => alert("Sguardo del Fato: " + (Math.floor(Math.random() * 6) + 1));

window.tiraDadiBOSS = (diff) => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const log = document.getElementById('dice-log');
    if(log) log.innerHTML = `<div style="border-bottom:1px solid #ccc; padding:5px"><strong>Lancio:</strong> ${d1+d2} <small>(${d1}, ${d2})</small></div>` + log.innerHTML;
};

window.closeTooltip = () => document.getElementById('pwa-tooltip').classList.add('hidden');
