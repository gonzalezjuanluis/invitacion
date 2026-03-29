// ==================== VARIABLES GLOBALES ====================
let musicPlaying = false;
let countdownInterval;

// ==================== CONEXIÓN CON GOOGLE SHEETS ====================
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyy3kIa7Sl-lL5RJt2o7C7QgxEtYGD1IsJE_R8xJuUFEaiDWwotLcLRsuh_UsQTdDb-BQ/exec';

async function guardarEnGoogleSheets(nombre, acompanantes, totalPersonas, fecha) {
    try {
        console.log("Enviando datos a Google Sheets...", { nombre, acompanantes, totalPersonas, fecha });
        
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                acompanantes: acompanantes,
                totalPersonas: totalPersonas,
                fecha: fecha
            })
        });
        
        console.log("✅ Datos enviados correctamente a Google Sheets");
        return true;
        
    } catch(error) {
        console.error("❌ Error al enviar a Google Sheets:", error);
        return false;
    }
}

// ==================== CONTADOR ====================
function iniciarContador() {
    const fechaEvento = new Date(2026, 4, 9, 16, 0, 0);

    console.log("=== CONTADOR INICIADO ===");
    console.log("Fecha del evento: " + fechaEvento.toLocaleString());

    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error("ERROR: No se encontraron los elementos del contador");
        return;
    }

    function actualizarContador() {
        const ahora = new Date();
        const diferencia = fechaEvento - ahora;

        if (diferencia <= 0) {
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            daysElement.innerText = '00';
            hoursElement.innerText = '00';
            minutesElement.innerText = '00';
            secondsElement.innerText = '00';
            return;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        daysElement.innerText = dias.toString().padStart(2, '0');
        hoursElement.innerText = horas.toString().padStart(2, '0');
        minutesElement.innerText = minutos.toString().padStart(2, '0');
        secondsElement.innerText = segundos.toString().padStart(2, '0');
    }

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    actualizarContador();
    countdownInterval = setInterval(actualizarContador, 1000);
}

// ==================== FUNCIÓN PRINCIPAL - GUARDA EN GOOGLE SHEETS ====================
function confirmarAsistencia(nombre, acompanantes) {
    if (!nombre || nombre.trim() === "") {
        mostrarToast("❌ Por favor escribe tu nombre completo", "#b87333");
        return false;
    }
    
    const nombreLimpio = nombre.trim();
    const acompanantesNum = parseInt(acompanantes);
    const totalPersonas = 1 + acompanantesNum;
    const fechaActual = new Date().toLocaleString('es-ES');
    
    mostrarToast("☁️ Guardando ()...", "#0f9d58");
    
    guardarEnGoogleSheets(nombreLimpio, acompanantesNum, totalPersonas, fechaActual)
        .then(exito => {
            if (exito) {
                mostrarToast(`✨ ¡Gracias ${nombreLimpio}! Confirmado para ${totalPersonas} persona(s) ✨`, "#0f9d58");
            } else {
                mostrarToast(`❌ Error al guardar. Por favor intenta de nuevo.`, "#b87333");
            }
        });
    
    console.log(`Confirmación enviada: ${nombreLimpio}, Acompañantes: ${acompanantes}`);
    return true;
}

// ==================== MÚSICA ====================
function initMusic() {
    const audio = document.getElementById('backgroundMusic');
    const toggleBtn = document.getElementById('toggleMusic');
    
    if (!audio || !toggleBtn) return;
    
    const musicIcon = toggleBtn.querySelector('.fa-music');
    const muteIcon = toggleBtn.querySelector('.fa-volume-mute');
    
    audio.volume = 0.25;
    
    toggleBtn.addEventListener('click', () => {
        if (musicPlaying) {
            audio.pause();
            musicPlaying = false;
            if (musicIcon) musicIcon.style.display = 'inline-block';
            if (muteIcon) muteIcon.style.display = 'none';
            mostrarToast("🔇 Música pausada", "#9e7b56");
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicPlaying = true;
                    if (musicIcon) musicIcon.style.display = 'none';
                    if (muteIcon) muteIcon.style.display = 'inline-block';
                    mostrarToast("🎵 Música de fondo activada", "#2c6e2c");
                }).catch(error => {
                    console.log("Error al reproducir música:", error);
                });
            }
        }
    });
}

// ==================== COMPARTIR ====================
function compartirWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const texto = encodeURIComponent("🎉 ¡Te invito a la fiesta de 70 años de María Salazar Romero! Confirma tu asistencia aquí:");
    window.open(`https://wa.me/?text=${texto}%20${url}`, '_blank');
}

function compartirFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
}

function compartirEmail() {
    const subject = encodeURIComponent("Invitación Fiesta 70 años");
    const body = encodeURIComponent(`Hola,\n\nTe invito a la celebración de 70 años de María Salazar Romero.\n\n📅 Fecha: 9 de Mayo de 2025\n🕓 Hora: 4:00 PM\n📍 Lugar: Mimbrenos 18, Pedregal Sta Úrsula Xitla, Tlalpan, CDMX\n\nConfirma tu asistencia en:\n${window.location.href}\n\n¡Te esperamos! 🎉`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function copiarEnlace() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        mostrarToast("🔗 Enlace copiado al portapapeles", "#2c6e2c");
    }).catch(() => {
        mostrarToast("⚠️ No se pudo copiar el enlace", "#b87333");
    });
}

// ==================== TEMA OSCURO ====================
function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// ==================== TOAST ====================
let toastTimeout;
function mostrarToast(mensaje, colorFondo = "#b8864b") {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;
    toast.style.backgroundColor = colorFondo;
    toast.textContent = mensaje;
    toast.style.opacity = '1';
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== PÁGINA CARGADA ===");
    console.log("☁️ Configurada para guardar DIRECTAMENTE en Google Sheets");
    
    // Iniciar contador
    iniciarContador();
    
    // Inicializar música y tema
    initMusic();
    initTheme();
    
    // Configurar botón de confirmación
    const btnAsistir = document.getElementById('btnAsistir');
    const inputNombre = document.getElementById('nombreAsistente');
    const selectAcompanantes = document.getElementById('acompanantes');
    
    if (btnAsistir) {
        console.log("✅ Botón de confirmación configurado (Google Sheets)");
        btnAsistir.addEventListener('click', () => {
            const nombre = inputNombre ? inputNombre.value.trim() : '';
            const acompanantes = selectAcompanantes ? selectAcompanantes.value : '0';
            if (confirmarAsistencia(nombre, acompanantes)) {
                if (inputNombre) inputNombre.value = '';
                if (selectAcompanantes) selectAcompanantes.value = '0';
                if (inputNombre) inputNombre.focus();
            }
        });
        
        if (inputNombre) {
            inputNombre.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') btnAsistir.click();
            });
        }
    }
    
    // Configurar botones de compartir
    document.getElementById('shareWhatsapp')?.addEventListener('click', compartirWhatsApp);
    document.getElementById('shareFacebook')?.addEventListener('click', compartirFacebook);
    document.getElementById('shareEmail')?.addEventListener('click', compartirEmail);
    document.getElementById('copyLink')?.addEventListener('click', copiarEnlace);
    
    // Mensaje de bienvenida
    setTimeout(() => {
        mostrarToast("🎉 ¡Bienvenido! Confirma tu asistencia - Se guardará en Google Sheets ☁️", "#0f9d58");
    }, 800);
    
    console.log("%c☁️ TODOS LOS DATOS SE GUARDAN DIRECTAMENTE EN GOOGLE SHEETS", "color: #0f9d58; font-size: 14px; font-weight: bold;");
});
