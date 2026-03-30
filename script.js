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
    const fechaEvento = new Date(2025, 4, 9, 16, 0, 0);

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

// ==================== MOSTRAR MODAL DE CONFIRMACIÓN (VISIBLE Y GRANDE) ====================
function mostrarModalConfirmacion(nombre, totalPersonas) {
    // Crear el modal si no existe
    let modal = document.getElementById('modalConfirmacion');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalConfirmacion';
        modal.className = 'modal-confirmacion';
        modal.innerHTML = `
            <div class="modal-confirmacion-contenido">
                <div class="modal-icono">✅</div>
                <h2>¡Confirmación Exitosa!</h2>
                <p id="modalMensaje"></p>
                <button class="modal-boton" id="cerrarModal">Aceptar</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Agregar estilos al modal
        const estiloModal = document.createElement('style');
        estiloModal.textContent = `
            .modal-confirmacion {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-confirmacion-contenido {
                background: white;
                border-radius: 20px;
                padding: 2rem;
                text-align: center;
                max-width: 90%;
                width: 320px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            }
            body.dark .modal-confirmacion-contenido {
                background: #1e1e2f;
                color: white;
            }
            .modal-icono {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .modal-confirmacion-contenido h2 {
                color: #2c6e2c;
                margin-bottom: 1rem;
                font-family: 'Playfair Display', serif;
            }
            body.dark .modal-confirmacion-contenido h2 {
                color: #4c9e4c;
            }
            .modal-confirmacion-contenido p {
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
                line-height: 1.4;
            }
            .modal-boton {
                background: #2c6e2c;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 40px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            .modal-boton:hover {
                background: #1f551f;
                transform: scale(1.02);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(estiloModal);
        
        // Evento para cerrar modal
        document.getElementById('cerrarModal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Actualizar mensaje del modal
    const mensaje = document.getElementById('modalMensaje');
    mensaje.innerHTML = `${nombre}<br>Has confirmado para <strong>${totalPersonas}</strong> persona(s)<br><br>¡Te esperamos! 🎉`;
    
    // Mostrar modal
    modal.style.display = 'flex';
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
    
    // Mostrar mensaje de carga
    mostrarToast("☁️ Guardando...", "#0f9d58");
    
    guardarEnGoogleSheets(nombreLimpio, acompanantesNum, totalPersonas, fechaActual)
        .then(exito => {
            if (exito) {
                // MOSTRAR MODAL GRANDE Y VISIBLE
                mostrarModalConfirmacion(nombreLimpio, totalPersonas);
                // También un toast pequeño por si acaso
                mostrarToast(`✨ ¡Gracias ${nombreLimpio}!`, "#0f9d58");
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

// ==================== TOAST PEQUEÑO (SOLO PARA CARGAS) ====================
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
    }, 2000);
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
        mostrarToast("🎉 ¡Bienvenido! Confirma tu asistencia", "#0f9d58");
    }, 800);
    
    console.log("%c☁️ TODOS LOS DATOS SE GUARDAN DIRECTAMENTE EN GOOGLE SHEETS", "color: #0f9d58; font-size: 14px; font-weight: bold;");
});
