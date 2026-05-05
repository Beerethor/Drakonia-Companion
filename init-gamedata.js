import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCW7QYU-iMAln3hUrVHuoLJzEDoUEfLJnM",
  authDomain: "drakonia-companion.firebaseapp.com",
  projectId: "drakonia-companion",
  storageBucket: "drakonia-companion.appspot.com",
  messagingSenderId: "803844500713",
  appId: "1:803844500713:web:c902b67f4e395bd20c9478"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gameData = {
    "Guerriero": {
        descrizione: "Combattenti che condividono spirito bellicoso e attitudine all'uso di armi e armature.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 2 },
            intelligenza: { dadi: 1, facce: 6, bonus: 0 },
            rapidita: { dadi: 1, facce: 6, bonus: 0 },
            pr: { dadi: 1, facce: 6, bonus: 0 }
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Casta dei Guerrieri"] },
            2: { rango: "Principiante", abilita: ["Armature Pesanti"] },
            3: { rango: "Esperto", abilita: ["Minaccioso"] },
            4: { rango: "Navigato", abilita: ["Aumento Caratteristica", "Tecnica dello scudo"] },
            7: { rango: "Straordinario", abilita: ["Addestramento Marziale"] }
        }
    },
    "Truffatore": {
        descrizione: "Inaffidabili e dediti ai sotterfugi, esperti nel trovare vie d'uscita.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 1 },
            intelligenza: { dadi: 1, facce: 6, bonus: 0 },
            rapidita: { dadi: 1, facce: 6, bonus: 1 },
            pr: { dadi: 1, facce: 6, bonus: 0 }
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Furbizia", "Lesto"] },
            2: { rango: "Principiante", abilita: ["Tecnica dell'Arco"] },
            5: { rango: "Provetto", abilita: ["Velocità di Pensiero 1"] },
            6: { rango: "Veterano", abilita: ["Intrallazzo"] }
        }
    },
    "Saggio": {
        descrizione: "Individui che impongono al corpo e alla mente una dura disciplina, sviluppando un'energia spirituale potente.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 1 },
            intelligenza: { dadi: 1, facce: 6, bonus: 1 },
            rapidita: { dadi: 1, facce: 6, bonus: 0 },
            pr: { dadi: 1, facce: 6, bonus: -1 }
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Guarigione", "Esorcismo 1"] },
            2: { rango: "Principiante", abilita: ["Tecnica del Bastone"] },
            3: { rango: "Esperto", abilita: ["Leggere la Mente"] },
            4: { rango: "Navigato", abilita: ["Conoscenza Superiore", "Vista Paranormale"] },
            5: { rango: "Provetto", abilita: ["Esorcismo 2", "Dono delle Lingue", "Aumento Caratteristica"] },
            6: { rango: "Veterano", abilita: ["Aumento Caratteristica", "Levitazione", "Tecnica dell'Arco"] },
            7: { rango: "Straordinario", abilita: ["Aumento Caratteristica", "Immunità"] },
            8: { rango: "Leggendario", abilita: ["Aumento Caratteristica"] },
            9: { rango: "Epico", abilita: ["Esorcismo 3", "Aumento Caratteristica"] }
        }
    },
    "Stregone": {
        descrizione: "Capaci di lanciare incantesimi grazie alla conoscenza istintiva delle regole della Stregoneria.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 0 },
            intelligenza: { dadi: 1, facce: 6, bonus: 2 },
            rapidita: { dadi: 1, facce: 6, bonus: 0 },
            pr: { dadi: 1, facce: 6, bonus: -1 }
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Stregoneria 1"] },
            2: { rango: "Principiante", abilita: ["Incantesimo Rituale 1"] },
            3: { rango: "Esperto", abilita: ["Incantesimo Rituale 2", "Memoria Magica 1"] },
            4: { rango: "Navigato", abilita: ["Stregoneria 2", "Incantesimo Rituale 3"] },
            5: { rango: "Provetto", abilita: ["Incantesimo Rituale 4", "Memoria Magica 2", "Aumento Caratteristica"] },
            6: { rango: "Veterano", abilita: ["Apprendimento", "Trascrizione"] },
            7: { rango: "Straordinario", abilita: ["Stregoneria 3", "Memoria Magica 3", "Aumento Caratteristica"] },
            8: { rango: "Leggendario", abilita: ["Aumento Caratteristica"] },
            9: { rango: "Epico", abilita: ["Stregoneria 4", "Aumento Caratteristica"] }
        }
    },
    "Druido": {
        descrizione: "Custode della natura e guerriero mistico che trae forza dagli spiriti del mondo naturale.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 0 },
            intelligenza: { dadi: 1, facce: 6, bonus: 1 },
            rapidita: { dadi: 1, facce: 6, bonus: 0 },
            pr: { dadi: 1, facce: 6, bonus: 1 }
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Magia Primordiale 1"] },
            2: { rango: "Principiante", abilita: ["Incantesimo Rituale 1", "Tecnica della Natura"] },
            3: { rango: "Esperto", abilita: ["Aumento Caratteristica"] },
            4: { rango: "Navigato", abilita: ["Magia Primordiale 2", "Sintonia con la Natura 1"] },
            5: { rango: "Provetto", abilita: ["Aumento Caratteristica", "Furia della Natura"] },
            6: { rango: "Veterano", abilita: ["Magia Primordiale 3", "Sintonia con la Natura 2"] },
            7: { rango: "Straordinario", abilita: ["Incantesimo Rituale 2"] },
            8: { rango: "Leggendario", abilita: ["Aumento Caratteristica"] },
            9: { rango: "Epico", abilita: ["Magia Primordiale 4", "Aumento Caratteristica"] }
        }
    }
};

async function runInstallation() {
    console.log("Inizio installazione manuali Drakonia...");
    try {
        const classesRef = doc(db, "gameData", "classes");
        await setDoc(classesRef, gameData);
        console.log("✅ INSTALLAZIONE COMPLETATA!");
        return true; 
    } catch (error) {
        console.error("❌ ERRORE:", error);
        throw error;
    }
}

export const installDrakonia = runInstallation;
