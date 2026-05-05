/* =========================================
   DRAKONIA RPG - LOGICA PROFILO & SOCIAL
   Gestione Utenti, Codici Amici e Firestore
   ========================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    updateProfile as firebaseUpdateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    arrayUnion, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurazione Firebase Drakonia-Companion
const firebaseConfig = {
  apiKey: "AIzaSyCW7QYU-iMAln3hUrVHuoLJzEDoUEfLJnM",
  authDomain: "drakonia-companion.firebaseapp.com",
  projectId: "drakonia-companion",
  storageBucket: "drakonia-companion.firebasestorage.app",
  messagingSenderId: "803844500713",
  appId: "1:803844500713:web:c902b67f4e395bd20c9478"
};

// Inizializzazione Servizi
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

/**
 * Genera un codice univoco casuale (es: DRK-8421)
 */
const generateFriendCode = () => "DRK-" + Math.floor(1000 + Math.random() * 9000);

/**
 * Gestione dello stato dell'utente all'apertura della pagina
 */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // Carica i dati attuali dall'Auth di Firebase
        document.getElementById('display-name').innerText = user.displayName || "Eroe Senza Nome";
        document.getElementById('display-email').innerText = user.email;
        document.getElementById('display-avatar').src = user.photoURL || "https://img.icons8.com/color/96/fantasy.png";

        // Verifica o aggiorna il profilo su Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            
            // AGGIORNAMENTO UTENTI ESISTENTI: Se non hanno un codice amico, lo creiamo ora
            if (!data.friendCode) {
                const code = generateFriendCode();
                await updateDoc(userRef, { 
                    friendCode: code,
                    friends: data.friends || [] 
                });
                document.getElementById('my-friend-code').innerText = code;
            } else {
                document.getElementById('my-friend-code').innerText = data.friendCode;
            }
            
            // Carica la lista degli alleati
            loadFriends(data.friends || []);
        } else {
            // NUOVO UTENTE: Crea il documento iniziale su Firestore
            const newCode = generateFriendCode();
            await setDoc(userRef, { 
                friendCode: newCode, 
                friends: [], 
                role: "player",
                email: user.email,
                displayName: user.displayName || "Eroe"
            });
            document.getElementById('my-friend-code').innerText = newCode;
        }
    } else {
        // Se non loggato, reindirizza al portale d'accesso
        window.location.href = 'login.html';
    }
});

/**
 * Aggiorna Nome e Foto del profilo
 */
window.updateProfile = async () => {
    const newName = document.getElementById('edit-name').value;
    const newPhoto = document.getElementById('edit-photo').value;
    
    if (!newName && !newPhoto) {
        alert("Inserisci almeno un dato da modificare, Eroe.");
        return;
    }

    try {
        // Aggiorna Firebase Authentication
        await firebaseUpdateProfile(auth.currentUser, {
            displayName: newName || auth.currentUser.displayName,
            photoURL: newPhoto || auth.currentUser.photoURL
        });

        // Aggiorna anche Firestore per coerenza sociale
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            displayName: newName || auth.currentUser.displayName,
            photoUrl: newPhoto || auth.currentUser.photoURL
        });

        alert("Identità aggiornata nel registro di Drakonia!");
        location.reload();
    } catch (error) {
        alert("Errore magico: " + error.message);
    }
};

/**
 * Cerca e aggiunge un amico tramite codice DRK-XXXX
 */
window.addFriend = async () => {
    const code = document.getElementById('search-friend-code').value.toUpperCase().trim();
    
    if (!code) return;
    if (code === document.getElementById('my-friend-code').innerText) {
        alert("Non puoi stringere alleanza con te stesso!");
        return;
    }

    try {
        // Cerca l'utente che possiede il codice inserito
        const q = query(collection(db, "users"), where("friendCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const friendDoc = querySnapshot.docs[0];
            const friendId = friendDoc.id;

            // Aggiunge l'amico all'array dell'utente corrente
            await updateDoc(doc(db, "users", currentUser.uid), {
                friends: arrayUnion(friendId)
            });
            
            alert("Nuovo alleato aggiunto alla tua cerchia!");
            location.reload();
        } else {
            alert("Nessun eroe risponde a questo codice nelle terre di Drakonia.");
        }
    } catch (error) {
        console.error("Errore aggiunta amico:", error);
    }
};

/**
 * Mostra visivamente la lista degli alleati
 */
async function loadFriends(friendIds) {
    const listDiv = document.getElementById('friends-list');
    if (friendIds.length === 0) return;
    
    listDiv.innerHTML = ""; // Pulisce il testo di default
    
    for (const id of friendIds) {
        const fSnap = await getDoc(doc(db, "users", id));
        if (fSnap.exists()) {
            const fData = fSnap.data();
            listDiv.innerHTML += `
                <div class="friend-list-item">
                    <span><strong>${fData.displayName || 'Eroe'}</strong> (${fData.friendCode})</span>
                    <span class="badge level-player" style="font-size:0.7em">${fData.role || 'player'}</span>
                </div>`;
        }
    }
}

/**
 * Esci dall'applicazione
 */
window.logout = () => {
    if(confirm("Vuoi davvero abbandonare la sessione di Drakonia?")) {
        signOut(auth).then(() => window.location.href = 'index.html');
    }
};
