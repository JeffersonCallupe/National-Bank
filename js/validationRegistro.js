document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro');
    registroForm.addEventListener('submit', validateForm);
});

async function validateForm(event) {
    event.preventDefault();

    const documentType = document.getElementById('document-type').value;
    const dni = document.getElementById('dni').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();
    const password = document.getElementById('password').value.trim();
    const passwordConfirmed = document.getElementById('passwordConfirmed').value.trim();
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    let valid = true;

    if (!dni) {
        errorMessage.textContent = 'El número de documento es obligatorio.';
        valid = false;
    } else if (documentType === 'DNI' && !/^\d{8}$/.test(dni)) {
        errorMessage.textContent = 'El DNI debe tener 8 dígitos.';
        valid = false;
    } else if (documentType === 'Carnet de Extranjeria' && !/^[a-zA-Z0-9]{9}$/.test(dni)) {
        errorMessage.textContent = 'El Carnet de Extranjería debe tener 9 caracteres alfanuméricos.';
        valid = false;
    }

    if (!nombre) {
        errorMessage.textContent = 'El nombre es obligatorio.';
        valid = false;
    }

    if (!apellidos) {
        errorMessage.textContent = 'Los apellidos son obligatorios.';
        valid = false;
    }

    if (!correo) {
        errorMessage.textContent = 'El correo es obligatorio.';
        valid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
        errorMessage.textContent = 'El formato del correo electrónico no es válido.';
        valid = false;
    }

    if (!celular) {
        errorMessage.textContent = 'El celular es obligatorio.';
        valid = false;
    } else if (!/^\d{9}$/.test(celular)) {
        errorMessage.textContent = 'El celular debe tener 9 dígitos.';
        valid = false;
    }

    if (!fechaNacimiento) {
        errorMessage.textContent = 'La fecha de nacimiento es obligatoria.';
        valid = false;
    } else if (!isValidAge(fechaNacimiento)) {
        errorMessage.textContent = 'Debes ser mayor o igual a 18 años.';
        valid = false;
    }

    if (!password) {
        errorMessage.textContent = 'La clave web es obligatoria.';
        valid = false;
    } else if (password.length < 6) {
        errorMessage.textContent = 'La clave web debe tener al menos 6 caracteres.';
        valid = false;
    } else if (password !== passwordConfirmed) {
        errorMessage.textContent = 'Las claves no coinciden.';
        valid = false;
    }

    if (valid) {
        const user = {
            numIdentification: dni,
            firstName: nombre,
            lastName: apellidos,
            email: correo,
            phone: celular,
            birthDate: fechaNacimiento,
            password: password
        };

        try {
            const response = await fetch('http://104.248.7.1:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Registration failed');
            }

            console.log(response.body);

            showModal();
        } catch (error) {
            errorMessage.textContent = 'Error en el registro: ' + error.message;
        }
    }
    return false;
}

function isValidAge(fechaNacimiento) {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }

    return age >= 18;
}

function showModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
        window.location.href = 'index.html';
    }, 3000);
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    window.location.href = 'index.html';
}
