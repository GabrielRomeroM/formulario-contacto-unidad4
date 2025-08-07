const form = document.getElementById('contactForm');
const camposObligatorios = ['name', 'surname', 'email', 'contact', 'affair', 'message'];

function validarCampo(input, errorMessage) {
    const valor = input.value.trim();
    let esValido = true;

    // Verificar si es campo obligatorio
    const esObligatorio = camposObligatorios.includes(input.id);

    // Campo vacío y obligatorio
    if (!valor && esObligatorio) {
        errorMessage.textContent = 'Este campo es obligatorio';
        esValido = false;
    }
    // Validar email específicamente
    else if (input.type === 'email' && valor && !validarEmail(valor)) {
        errorMessage.textContent = 'Ingrese un email válido';
        esValido = false;
    }
    // Validar teléfono
    else if (input.id === 'tel' && valor && !/^[0-9]{3}-[0-9]{9}$/.test(valor)) {
        errorMessage.textContent = 'Formato: 261-123456789';
        esValido = false;
    }
    // Si es válido
    else {
        errorMessage.textContent = '';
    }

    input.classList.toggle('error', !esValido);
    return esValido;
}

// Función auxiliar para validar email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validarFormulario() {
    let formularioValido = true;

    camposObligatorios.forEach(id => {
        const input = document.getElementById(id);
        const errorMessage = document.getElementById(`error-${id}`);
        formularioValido = validarCampo(input, errorMessage) && formularioValido;
    });

    return formularioValido;
}

function enviarFormulario() {
    // Mostrar loading mientras carga
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    fetch('mensaje.txt')
        .then(response => {
            if (!response.ok) throw new Error("No se encontró mensaje.txt");
            return response.text();
        })
        .then(texto => {
            // Crear div para el mensaje de éxito
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = 'mensaje-exito';
            mensajeDiv.innerHTML = `<p>${texto}</p>`;
            
            // Insertar después del formulario
            form.appendChild(mensajeDiv);
            
            // Resetear formulario
            form.reset();
            
            // Limpiar mensajes de error
            document.querySelectorAll('.errormessage').forEach(span => {
                span.textContent = '';
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("¡Gracias por enviar el formulario!");
        })
        .finally(() => {
            // Restaurar botón
            submitBtn.textContent = 'Enviar';
            submitBtn.disabled = false;
        });
}

// Event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
        enviarFormulario();
    }
});

// Validación en tiempo real
camposObligatorios.forEach(id => {
    const input = document.getElementById(id);
    const errorMessage = document.getElementById(`error-${id}`);
    
    input.addEventListener('blur', () => {
        validarCampo(input, errorMessage);
    });
});