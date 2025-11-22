// Configuração Supabase
const SUPABASE_URL = 'https://lpkhscatjrllfscqmxka.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2hzY2F0anJsbGZzY3FteGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzU3MjYsImV4cCI6MjA3OTE1MTcyNn0.HlNIZFU2kq2-pyq0PgBxFX1Kg1iKldF_Y3thWKzYBnM';

// Espera Supabase carregar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa Supabase
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Botão Limpar Campos
    document.getElementById('btnLimpar').addEventListener('click', function() {
        document.getElementById('emailLogin').value = '';
        document.getElementById('senhaLogin').value = '';
        mostrarMensagem('Campos limpos! ✅');
    });
    
    // Botão Entrar (preparado para Supabase)
    document.getElementById('btnEntrar').addEventListener('click', function() {
        const email = document.getElementById('emailLogin').value;
        const senha = document.getElementById('senhaLogin').value;
        
        if (!email || !senha) {
            mostrarMensagem('Preencha email e senha!');
            return;
        }
        
        mostrarMensagem('Sistema de login carregando...');
        // Aqui vai a lógica de auth com Supabase
    });
});

function mostrarMensagem(msg) {
    let divMsg = document.getElementById('divMensagem');
    divMsg.textContent = msg;
    divMsg.classList.remove('invisivel');
    setTimeout(() => divMsg.classList.add('invisivel'), 3000);
}
