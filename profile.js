/* =========================================
   DRAKONIA RPG - LOGICA PROFILO AVANZATA
   Gestione Immagini (Storage), Dati e Social
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
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Configurazione Firebase Drakonia-Companion
const firebaseConfig = {
  apiKey: "AIzaSyCW7QYU-iMAln3hUrVHuoLJzEDoUEfLJnM",
  authDomain: "drakonia-companion.firebaseapp.com",
  projectId: "drakonia-companion",
  storageBucket: "drakonia-companion.appspot.com", 
  messagingSenderId: "803844500713",
  appId: "1:803844500713:web:c902b67f4e395bd20c9478"
};

// Inizializzazione servizi
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let currentUser = null;

/**
 * Genera un codice univoco per il sistema sociale (es: DRK-1234)
 */
const generateFriendCode = () => "DRK-" + Math.floor(1000 + Math.random() * 9000);

/**
 * Listener stato utente: gestisce il caricamento dati e la creazione automatica codici
 */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // Popola l'interfaccia con i dati attuali dell'eroe
        document.getElementById('display-name').innerText = user.displayName || "Eroe Senza Nome";
        document.getElementById('display-avatar').src = user.photoURL || "https://img.icons8.com/color/96/fantasy.png";

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            // Se l'utente esiste ma non ha un codice amico, lo generiamo ora
            if (!data.friendCode) {
                const code = generateFriendCode();
                await updateDoc(userRef, { friendCode: code });
                document.getElementById('my-friend-code').innerText = code;
            } else {
                document.getElementById('my-friend-code').innerText = data.friendCode;
            }
            loadFriends(data.friends || []);
        } else {
            // Crea nuovo documento Firestore per nuovi utenti
            const newCode = generateFriendCode();
            await setDoc(userRef, { 
                friendCode: newCode, 
                friends: [], 
                role: "player",
                displayName: user.displayName || "Eroe"
            });
            document.getElementById('my-friend-code').innerText = newCode;
        }
    } else {
        // Se non loggato, reindirizza al portale
        window.location.href = 'login.html';
    }
});

/**
 * Aggiorna il profilo: gestisce sia l'URL testuale che il caricamento file (Storage)
 */
window.updateProfile = async () => {
    const newName = document.getElementById('edit-name').value;
    const urlPhoto = document.getElementById('edit-photo-url').value;
    const fileInput = document.getElementById('file-upload');
    let finalPhotoURL = urlPhoto || auth.currentUser.photoURL;

    try {
        // Se è stato selezionato un file, caricalo su Firebase Storage
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            // Crea un riferimento univoco basato sull'UID dell'utente
            const storageRef = ref(storage, `avatars/${currentUser.uid}`);
            const snapshot = await uploadBytes(storageRef, file);
            finalPhotoURL = await getDownloadURL(snapshot.ref);
        }

        // Aggiorna i dati su Firebase Auth
        await firebaseUpdateProfile(auth.currentUser, {
            displayName: newName || auth.currentUser.displayName,
            photoURL: finalPhotoURL
        });

        // Sincronizza i dati su Firestore per il sistema sociale
        await updateDoc(doc(db, "users", currentUser.uid), {
            displayName: newName || auth.currentUser.displayName,
            photoUrl: finalPhotoURL
        });

        alert("Identità aggiornata nel registro di Drakonia!");
        location.reload();
    } catch (error) {
        console.error("Errore aggiornamento:", error);
        alert("Errore durante la trasformazione: " + error.message);
    }
};

/**
 * Sistema Sociale: Aggiunge alleati tramite codice univoco
 */
window.addFriend = async () => {
    const code = document.getElementById('search-friend-code').value.toUpperCase().trim();
    if (!code) return;

    try {
        // Cerca l'utente con il codice corrispondente nel database
        const q = query(collection(db, "users"), where("friendCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const friendId = querySnapshot.docs[0].id;
            if (friendId === currentUser.uid) {
                alert("Non puoi essere alleato di te stesso!");
                return;
            }

            // Aggiunge l'ID all'array amici dell'utente corrente
            await updateDoc(doc(db, "users", currentUser.uid), {
                friends: arrayUnion(friendId)
            });
            alert("Nuovo alleato aggiunto!");
            location.reload();
        } else {
            alert("Nessun eroe trovato con questo codice.");
        }
    } catch (error) {
        console.error("Errore aggiunta amico:", error);
    }
};

/**
 * Carica e visualizza i nomi degli alleati
 */
async function loadFriends(friendIds) {
    const listDiv = document.getElementById('friends-list');
    if (friendIds.length === 0) return;
    
    listDiv.innerHTML = ""; 
    for (const id of friendIds) {
        const fSnap = await getDoc(doc(db, "users", id));
        if (fSnap.exists()) {
            const fData = fSnap.data();
            listDiv.innerHTML += `
                <div class="friend-list-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                    <span><strong>${fData.displayName || 'Eroe'}</strong> (${fData.friendCode})</span>
                    <span class="badge level-player" style="font-size:0.7em">${fData.role || 'player'}</span>
                </div>`;
        }
    }
}

/**
 * Logica di Logout
 */
window.logout = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
};
