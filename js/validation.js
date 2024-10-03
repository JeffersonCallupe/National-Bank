document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    loginForm.addEventListener('submit', validateForm);
});

async function validateForm(event) {
    event.preventDefault();

    const documentType = document.getElementById('document-type').value;
    const dni = document.getElementById('dni').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    let valid = true;

    if (!dni) {
        showError(errorMessage, 'El número de documento es obligatorio.');
        valid = false;
    } else if (!isValidDNI(documentType, dni)) {
        showError(errorMessage, 'El número de documento no es válido.');
        valid = false;
    }

    if (!password) {
        showError(errorMessage, 'La clave web es obligatoria.');
        valid = false;
    }

    if (valid) {
        try {
            const user = await loginUser(dni, password);
            console.log(user);
            storeUserData(user);
            window.location.href = 'menu.html';
        } catch (error) {
            showError(errorMessage, 'Error en el inicio de sesión: ' + error.message);
        }
    }

    return valid;
}

function showError(element, message) {
    element.textContent = message;
}

function isValidDNI(documentType, dni) {
    return (documentType === 'DNI' && /^\d{8}$/.test(dni)) ||
        (documentType === 'Carnet de Extranjeria' && /^[a-zA-Z0-9]{9}$/.test(dni));
}

async function loginUser(dni, password) {
    const response = await fetch('http://104.248.7.1:8080/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            numIdentification: dni,
            password: password
        })
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
}

function storeUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userPassword', user.password);
}
