function getUserLocalData() {
  // Obtiene el usuario local
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

async function updateUserLocalData() {
  const userId = localStorage.getItem('userId');
  const url = 'http://104.248.7.1:8080/api/user/' + userId;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }
    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));

}


document.getElementById('aperturarCuenta').addEventListener('click',async ()=>{

  const user = getUserLocalData();

  await cargarComponente('./componentes/crear-cuenta/nueva-cuenta.html', 'info');
  

      document.getElementById('numero-documento').value = user.numIdentification;
      document.getElementById('nombres').value = user.firstName;
      document.getElementById('apellidos').value = user.lastName;
      document.getElementById('celular').value = user.phone;
      document.getElementById('fecha-nacimiento').value = user.birthDate;

});

document.getElementById('suspenderCuenta').addEventListener('click',async ()=>{
    function  populateAccountSelect() {
        const user = getUserLocalData();
        
        if (user && user.bankAccounts) {
          const accountSelect = document.getElementById('accountSelect');
          
          user.bankAccounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = `Cuenta: ${account.accountNumber} - Saldo: ${account.balance} - Estado: ${account.status}`;
            if (account.status === 'ACTIVE') {
              accountSelect.appendChild(option);
            }
          });
        } else {
          console.error('No se encontraron cuentas bancarias para el usuario.');
        }
      }

    await cargarComponente('./componentes/suspender-cuenta/suspender-cuenta.html', 'info');
    populateAccountSelect();
    
});

document.getElementById('reactivarCuenta').addEventListener('click',async ()=>{
  function populateAccountSelect() {
      const user = getUserLocalData();
      
      if (user && user.bankAccounts) {
        const accountSelect = document.getElementById('accountSelect');
        
        user.bankAccounts.forEach(account => {
          const option = document.createElement('option');
          option.value = account.id;
          option.textContent = `Cuenta: ${account.accountNumber} - Saldo: ${account.balance} - Estado: ${account.status}`;
            if (account.status === 'SUSPENDIDA') {
              accountSelect.appendChild(option);
            }
            

        });
      } else {
        console.error('No se encontraron cuentas bancarias para el usuario.');
      }
    }

  await cargarComponente('./componentes/reactivar-cuenta/reactivar-cuenta.html', 'info');

      populateAccountSelect();
  
});

document.getElementById('cerrarCuenta').addEventListener('click', async ()=>{
  function populateAccountSelect() {
      const user = getUserLocalData();
      
      if (user && user.bankAccounts) {
        const accountSelect = document.getElementById('accountSelect');
        
        user.bankAccounts.forEach(account => {
          const option = document.createElement('option');
          option.value = account.id;
          option.textContent = `Cuenta: ${account.accountNumber} - Saldo: ${account.balance} - Estado: ${account.status}`;
              
          if (account.status != 'CERRADA') {
            accountSelect.appendChild(option);
          }
        });
      } else {
        console.error('No se encontraron cuentas bancarias para el usuario.');
      }
    }
    await cargarComponente('./componentes/cerrar-cuenta/cerrar-cuenta.html', 'info');  
    populateAccountSelect();
});






