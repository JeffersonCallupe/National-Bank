document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro');
    registroForm.addEventListener('submit', validateForm);
});

async function validateForm(event) {
    event.preventDefault();

    const formData = getFormData();
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    const validationError = validateFormData(formData);

    if (validationError) {
        errorMessage.textContent = validationError;
        return;
    }

    try {
        await registerUser(formData);
        showModal();
    } catch (error) {
        errorMessage.textContent = 'Error en el registro: ' + error.message;
    }
}

function getFormData() {
    return {
        documentType: document.getElementById('document-type').value,
        dni: document.getElementById('dni').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        celular: document.getElementById('celular').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value.trim(),
        password: document.getElementById('password').value.trim(),
        passwordConfirmed: document.getElementById('passwordConfirmed').value.trim(),
    };
}

function validateFormData(formData) {
    if (!formData.dni) {
        return 'El número de documento es obligatorio.';
    }
    if (!validateDocument(formData.documentType, formData.dni)) {
        return formData.documentType === 'DNI'
            ? 'El DNI debe tener 8 dígitos.'
            : 'El Carnet de Extranjería debe tener 9 caracteres alfanuméricos.';
    }
    if (!formData.nombre) {
        return 'El nombre es obligatorio.';
    }
    if (!formData.apellidos) {
        return 'Los apellidos son obligatorios.';
    }
    if (!validateEmail(formData.correo)) {
        return 'El formato del correo electrónico no es válido.';
    }
    if (!validatePhone(formData.celular)) {
        return 'El celular debe tener 9 dígitos.';
    }
    if (!validateAge(formData.fechaNacimiento)) {
        return 'Debes ser mayor o igual a 18 años.';
    }
    if (!formData.password || formData.password.length < 6) {
        return 'La clave web debe tener al menos 6 caracteres.';
    }
    if (formData.password !== formData.passwordConfirmed) {
        return 'Las claves no coinciden.';
    }
    return null;
}

function validateDocument(type, dni) {
    if (type === 'DNI') {
        return /^\d{8}$/.test(dni);
    }
    if (type === 'Carnet de Extranjeria') {
        return /^[a-zA-Z0-9]{9}$/.test(dni);
    }
    return false;
}

function validateEmail(email) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

function validatePhone(phone) {
    return /^\d{9}$/.test(phone);
}

function validateAge(fechaNacimiento) {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

async function registerUser(user) {
    const response = await fetch('http://104.248.7.1:8080/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
    }
}

function showModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
        window.location.href = 'index.html';
    }, 3000);
}
