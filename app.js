// Gestione Sezioni
window.showSection = function(id) {
    const display = document.getElementById('content-display');
    const sections = {
        'campagne': '<h2>Campagne Attive</h2><p>Caricamento avventure dal cloud...</p>',
        'sessione': '<h2>Sessione di Gioco</h2><div class="dice-area">Lancia i dadi per la tua prova di Prodezza!</div>',
        'regolamento': '<h2>Database Regole</h2><ul><li>Sistema BOSS v1.2</li><li>Combattimento</li><li>Grimorio</li></ul>'
    };
    display.innerHTML = sections[id] || 'Sezione in fase di sviluppo...';
}

// Logica Account (Simulata per ora)
window.toggleAuth = function() {
    const btn = document.getElementById('auth-btn');
    const badge = document.getElementById('account-level');
    
    if(btn.innerText === "Accedi") {
        btn.innerText = "Logout";
        badge.innerText = "Master"; // Qui andrà il dato da Firebase
        badge.style.background = "#d4af37";
    } else {
        btn.innerText = "Accedi";
        badge.innerText = "Player";
        badge.style.background = "#ccc";
    }
}

// Tooltip PWA
window.closeTooltip = function() {
    document.getElementById('pwa-tooltip').classList.add('hidden');
}

// Mostra il tooltip solo su iOS se non è già installata
if (window.navigator.standalone === false) {
    document.getElementById('pwa-tooltip').classList.remove('hidden');
}
