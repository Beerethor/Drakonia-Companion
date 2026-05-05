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
            prodezza: { dadi: 1, facce: 6, bonus: 2 },     // 1D6+2
            intelligenza: { dadi: 1, facce: 6, bonus: 0 },  // 1D6
            rapidita: { dadi: 1, facce: 6, bonus: 0 },      // 1D6
            pr: { dadi: 1, facce: 6, bonus: 0 }            // 1D6
        },
        equipaggiamentoBase: {
            armi: ["Spada", "Scudo"], //
            armatura: "Cotta di Maglia", //
            oggetti: ["Sacco"] //
        },
        abilitaDettagli: {
            "Casta dei Guerrieri": "Conosce l'araldica, le strategie militari e gli annali di re. Effettua prove di Intelligenza sulle conoscenze delle caste.",
            "Armature Pesanti": "Può indossare armature pesanti con punteggio di Protezione 3 o 4.",
            "Minaccioso": "Può sfondare porte o intimidire avversari con una prova facile di Prodezza.",
            "Tecnica dello Scudo": "Lancia 1D6 quando subisce colpi: 1-2 para, 6 lo scudo si spezza.",
            "Addestramento Marziale": "Può effettuare due azioni di Attacco a ogni turno di Combattimento."
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Casta dei Guerrieri"] }, //
            2: { rango: "Principiante", abilita: ["Armature Pesanti"] }, //
            3: { rango: "Esperto", abilita: ["Minaccioso"] }, //
            4: { rango: "Navigato", abilita: ["Aumento Caratteristica", "Tecnica dello scudo"] }, //
            7: { rango: "Straordinario", abilita: ["Addestramento Marziale"] } //
        }
    },
    ""Truffatore": {
        descrizione: "Inaffidabili e dediti ai sotterfugi, esperti nel trovare vie d'uscita.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 1 },    // 1D6+1
            intelligenza: { dadi: 1, facce: 6, bonus: 0 }, // 1D6
            rapidita: { dadi: 1, facce: 6, bonus: 1 },    // 1D6+1
            pr: { dadi: 1, facce: 6, bonus: 0 }           // 1D6
        },
        equipaggiamentoBase: {
            armi: ["Spada", "Arco corto", "Faretra con 6 frecce"], //
            armatura: "Corpetto di cuoio rinforzato", //
            oggetti: ["Sacco"] //
        },
        abilitaDettagli: {
            "Furbizia": "Abile nell'imbroglio, può effettuare prove facili di Rapidità per truffare o borseggiare.",
            "Lesto": "Gli avversari hanno un malus all'attacco pari al bonus del Truffatore (Livello/2).",
            "Tecnica dell'Arco": "Usa l'arco con prove normali di Prodezza invece che difficili.",
            "Velocità di Pensiero": "Azione di combattimento extra dopo che tutti hanno agito.",
            "Intrallazzo": "Guadagna automaticamente 2 PO ogni ora passata in città."
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Furbizia", "Lesto"] }, //
            2: { rango: "Principiante", abilita: ["Tecnica dell'Arco"] }, //
            5: { rango: "Provetto", abilita: ["Velocità di Pensiero 1"] }, //
            6: { rango: "Veterano", abilita: ["Intrallazzo"] } //
        }
    },
    "Saggio": {
        descrizione: "Individui che impongono al corpo e alla mente una dura disciplina, sviluppando un'energia spirituale potente.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 1 },     // 1D6+1
            intelligenza: { dadi: 1, facce: 6, bonus: 1 },  // 1D6+1
            rapidita: { dadi: 1, facce: 6, bonus: 0 },      // 1D6
            pr: { dadi: 1, facce: 6, bonus: -1 }           // 1D6-1
        },
        equipaggiamentoBase: {
            armi: ["Bastone da combattimento"], //
            armatura: "Cotta di Maglia", //
            oggetti: ["Sacco"] //
        },
        abilitaDettagli: {
            "Guarigione": "Può infondere Energia Curativa sacrificando PR correnti e moltiplicandoli in base a un lancio di 1D6 (fino a un massimo pari ai PR totali dei bersagli).",
            "Esorcismo": "Potere mentale per dissolvere Non-morti. Richiede una prova di Intelligenza con malus pari alla metà dell'Intelligenza della creatura.",
            "Tecnica del Bastone": "Arriva a utilizzare il bastone con una sola mano. Può effettuare un Attacco Ravvicinato difficile per infliggere +1D6 PI e sbilanciare l'avversario.",
            "Leggere la Mente": "Permette di conoscere pensieri superficiali, emozioni e indole dei bersagli. I bersagli possono resistere con una prova di Intelligenza.",
            "Conoscenza Superiore": "Prova di Intelligenza per richiamare conoscenze su pozioni, pergamene, araldica, linguaggi perduti, demoni e dèi.",
            "Vista Paranormale": "Permette di vedere attraverso materiali morbidi e sottili (non pietra o metallo) e di vedere al buio.",
            "Dono delle Lingue": "Capacità di comprendere e utilizzare qualsiasi tipo di linguaggio umano.",
            "Levitazione": "Permette di muoversi in qualsiasi direzione finché resta concentrato. Cade se attacca o viene toccato.",
            "Tecnica dell'Arco": "Esegue prove normali di Prodezza invece che difficili negli attacchi a distanza con archi.",
            "Immunità": "Immune a malattie, paralisi, tocco dei Non-morti, nausea e ubriachezza.",
            "Aumento Caratteristica": "Guadagna 2 punti caratteristica da dividere tra due statistiche (o casuali: 1-2 Prod, 3-4 Int, 5-6 Rap)."
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Guarigione", "Esorcismo 1"] }, //
            2: { rango: "Principiante", abilita: ["Tecnica del Bastone"] }, //
            3: { rango: "Esperto", abilita: ["Leggere la Mente"] }, //
            4: { rango: "Navigato", abilita: ["Conoscenza Superiore", "Vista Paranormale"] }, //
            5: { rango: "Provetto", abilita: ["Esorcismo 2", "Dono delle Lingue", "Aumento Caratteristica"] }, //
            6: { rango: "Veterano", abilita: ["Aumento Caratteristica", "Levitazione", "Tecnica dell'Arco"] }, //
            7: { rango: "Straordinario", abilita: ["Aumento Caratteristica", "Immunità"] }, //
            8: { rango: "Leggendario", abilita: ["Aumento Caratteristica"] }, //
            9: { rango: "Epico", abilita: ["Esorcismo 3", "Aumento Caratteristica"] } //
        }
    },
    "Stregone": {
        descrizione: "Capaci di lanciare incantesimi grazie alla conoscenza istintiva delle regole della Stregoneria e all'energia soprannaturale nei loro corpi.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 0 },     // 1D6
            intelligenza: { dadi: 1, facce: 6, bonus: 2 },  // 1D6+2
            rapidita: { dadi: 1, facce: 6, bonus: 0 },      // 1D6
            pr: { dadi: 1, facce: 6, bonus: -1 }           // 1D6-1
        },
        equipaggiamentoBase: {
            armi: ["Spada"], //
            armatura: "Pettorale d’argento", //
            oggetti: ["Sacco"] //
        },
        abilitaDettagli: {
            "Stregoneria": "Permette di lanciare incantesimi del Grimerio dello Stregone. Non può indossare armature o manette in ferro/acciaio durante il lancio. La difficoltà del lancio diminuisce col livello (Liv 1: Normale, Liv 4: Facile, Liv 7: Facilissima, Liv 9: Minima).",
            "Incantesimo Rituale": "Apprende nuovi rituali specifici: Evoca Faltyn (Liv 2), Rivela Magie (Liv 3), Predizione (Liv 4), Teletrasporto (Liv 5).",
            "Memoria Magica": "Permette di attingere istantaneamente a una selezione giornaliera di incantesimi senza richiamarli alla mente. Il numero massimo aumenta con il livello (Liv 3: 1, Liv 5: 2, Liv 7: 3).",
            "Apprendimento": "Se osserva un altro incantatore o legge una pergamena/Grimorio di una branca diversa, apprende subito il nuovo incantesimo.",
            "Trascrizione": "Capacità di creare pergamene magiche spendendo 1 giorno, 10 PO per punto di complessità e materiali magici (inchiostro, penna incantata, pergamena vuota).",
            "Aumento Caratteristica": "Guadagna 2 punti caratteristica da dividere tra due statistiche (o casuali: 1-2 Prod, 3-4 Int, 5-6 Rap)."
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Stregoneria 1"] }, //
            2: { rango: "Principiante", abilita: ["Incantesimo Rituale 1"] }, //
            3: { rango: "Esperto", abilita: ["Incantesimo Rituale 2", "Memoria Magica 1"] }, //
            4: { rango: "Navigato", abilita: ["Stregoneria 2", "Incantesimo Rituale 3"] }, //
            5: { rango: "Provetto", abilita: ["Incantesimo Rituale 4", "Memoria Magica 2", "Aumento Caratteristica"] }, //
            6: { rango: "Veterano", abilita: ["Apprendimento", "Trascrizione"] }, //
            7: { rango: "Straordinario", abilita: ["Stregoneria 3", "Memoria Magica 3", "Aumento Caratteristica"] }, //
            8: { rango: "Leggendario", abilita: ["Aumento Caratteristica"] }, //
            9: { rango: "Epico", abilita: ["Stregoneria 4", "Aumento Caratteristica"] } //
        }
    },
    "Druido": {
        descrizione: "Custode della natura e guerriero mistico che trae forza dagli spiriti del mondo naturale e dagli elementi.",
        lanciIniziali: {
            prodezza: { dadi: 1, facce: 6, bonus: 0 },     // 1D6
            intelligenza: { dadi: 1, facce: 6, bonus: 1 },  // 1D6+1
            rapidita: { dadi: 1, facce: 6, bonus: 0 },      // 1D6
            pr: { dadi: 1, facce: 6, bonus: 1 }            // 1D6+1
        },
        equipaggiamentoBase: {
            armi: ["Bastone da combattimento"], //
            armatura: "Corpetto di cuoio rinforzato", //
            oggetti: ["Sacco"] //
        },
        abilitaDettagli: {
            "Magia Primordiale": "Permette di lanciare incantesimi dal Grimorio del Druido. Non può indossare armature in ferro o acciaio né trasportare oggetti in metallo. La difficoltà del lancio diminuisce col livello (Liv 1: Normale, Liv 4: Facile, Liv 6: Facilissima, Liv 9: Minima).", //
            "Tecnica della Natura": "In combattimento può sbalzare l'avversario indietro di 4 caselle superando una prova normale di Prodezza dopo un attacco ravvicinato.", //
            "Sintonia con la Natura": "Rileva nemici e trappole non magiche in un raggio pari alla metà dell'Intelligenza (al Liv 6 il raggio è pari all'Intelligenza intera). Richiede una prova normale di Intelligenza per capire la direzione del pericolo.", //
            "Incantesimo Rituale": "Apprende nuovi rituali specifici: Forma Famelica (Liv 2), Controllare Tempo Atmosferico (Liv 7).", //
            "Furia della Natura": "Effettua due azioni di Attacco Ravvicinato in sequenza. Se il primo attacco ha successo, i PI del secondo non possono essere assorbiti da nessuna armatura.", //
            "Aumento Caratteristica": "Guadagna 2 punti caratteristica da dividere tra due statistiche a scelta o casuali (1D6: 1-2 Prod, 3-4 Int, 5-6 Rap)." //
        },
        progressione: {
            1: { rango: "Alle Prime Armi", abilita: ["Magia Primordiale 1"] }, //
            2: { rango: "Principiante", abilita: ["Incantesimo Rituale 1", "Tecnica della Natura"] }, //
            3: { rango: "Esperto", abilita: ["Aumento Caratteristica"] }, //
            4: { rango: "Navigato", abilita: ["Magia Primordiale 2", "Sintonia con la Natura 1"] }, //
            5: { rango: "Provetto", abilita: ["Aumento Caratteristica", "Furia della Natura"] }, //
            6: { rango: "Veterano", abilita: ["Magia Primordiale 3", "Sintonia con la Natura 2"] }, //
            7: { rango: "Straordinario", abilita: ["Incantesimo Rituale 2"] }, //
            8: { rango: "Leggendario", abilita: ["Aumento Caratteristica"] }, //
            9: { rango: "Epico", abilita: ["Magia Primordiale 4", "Aumento Caratteristica"] } //
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
