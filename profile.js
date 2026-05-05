import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile as firebaseUpdateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

let currentUser = null;

// Funzione per generare un Codice Amico univoco (es: DRK-1234)
const generateFriendCode = () => "DRK-" + Math.floor(1000 + Math.random() * 9000);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        // Carica dati utente da Auth e Firestore
        document.getElementById('display-name').innerText = user.displayName || "Eroe Senza Nome";
        document.getElementById('display-email').innerText = user.email;
        document.getElementById('display-avatar').src = user.photoURL || "https://img.icons8.com/color/96/fantasy.png";

        // Recupera o crea il Codice Amico nel database
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            // Se non ha un codice, lo generiamo ora
            if (!data.friendCode) {
                const code = generateFriendCode();
                await updateDoc(userRef, { friendCode: code });
                document.getElementById('my-friend-code').innerText = code;
            } else {
                document.getElementById('my-friend-code').innerText = data.friendCode;
            }
            loadFriends(data.friends || []);
        } else {
            // Primo accesso: inizializza documento utente
            const newCode = generateFriendCode();
            await setDoc(userRef, { friendCode: newCode, friends: [], role: "player" });
            document.getElementById('my-friend-code').innerText = newCode;
        }
    } else {
        window.location.href = 'login.html';
    }
});

// Funzione per aggiornare Nome e Foto
window.updateProfile = async () => {
    const newName = document.getElementById('edit-name').value;
    const newPhoto = document.getElementById('edit-photo').value;
    
    try {
        await firebaseUpdateProfile(auth.currentUser, {
            displayName: newName || auth.currentUser.displayName,
            photoURL: newPhoto || auth.currentUser.photoURL
        });
        alert("Identità aggiornata con successo!");
        location.reload();
    } catch (error) {
        alert("Errore nell'aggiornamento: " + error.message);
    }
};

// Funzione per aggiungere un amico tramite codice univoco
window.addFriend = async () => {
    const code = document.getElementById('search-friend-code').value.toUpperCase();
    if (!code) return;

    // Cerca l'utente che possiede quel codice amico
    const q = query(collection(db, "users"), where("friendCode", "==", code));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const friendDoc = querySnapshot.docs[0];
        const friendId = friendDoc.id;

        if (friendId === currentUser.uid) {
            alert("Non puoi essere alleato di te stesso!");
            return;
        }

        // Aggiunge l'ID dell'amico alla lista 'friends' dell'utente corrente
        await updateDoc(doc(db, "users", currentUser.uid), {
            friends: arrayUnion(friendId)
        });
        alert("Alleato aggiunto alla tua cerchia!");
        location.reload();
    } else {
        alert("Nessun eroe trovato con questo codice.");
    }
};

// Carica i nomi degli amici nella lista
async function loadFriends(friendIds) {
    const listDiv = document.getElementById('friends-list');
    if (friendIds.length === 0) return;
    
    listDiv.innerHTML = ""; // Pulisce la lista
    for (const id of friendIds) {
        const fSnap = await getDoc(doc(db, "users", id));
        if (fSnap.exists()) {
            listDiv.innerHTML += `<div class="friend-list-item">
                <span>👤 ${fSnap.data().friendCode} - Alleato</span>
            </div>`;
        }
    }
}

window.logout = () => signOut(auth).then(() => window.location.href = 'index.html');
