document.addEventListener('DOMContentLoaded', () => {
    // Función para obtener los datos del usuario desde localStorage
    function getUserLocalData() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Función para actualizar el nombre del usuario en el banner
    function updateBanner() {
        const user = getUserLocalData();
        if (user) {
            const firstName = user.firstName;
            document.getElementById('user-name').textContent = firstName;
        }
    }

    // Llamar a la función updateBanner
    updateBanner();

    
});
