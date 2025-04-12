const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const Users = JSON.parse(localStorage.getItem('users')) || [];

  const validUser = Users.find(user => user.email === email && user.password === password);

  if (!validUser) {
    return Swal.fire({
      title: 'Error',
      text: 'Usuario y/o contraseña incorrectos!',
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo'
    });
  }

  Swal.fire({
    title: `¡Bienvenido ${validUser.name}!`,
    text: 'Has iniciado sesión con éxito.',
    icon: 'success',
    confirmButtonText: 'Continuar'
  }).then(() => {
    localStorage.setItem('login_success', JSON.stringify(validUser));
    window.location.href = 'index.html';
  });
});
