const signupForm = document.querySelector('#signupForm');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  const Users = JSON.parse(localStorage.getItem('users')) || [];
  const isUserRegistered = Users.find(user => user.email === email);

  if (isUserRegistered) {
    return Swal.fire({
      title: 'Atención',
      text: 'El usuario ya está registrado!',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  Users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(Users));

  Swal.fire({
    title: 'Registro exitoso!',
    text: 'Ahora podés iniciar sesión.',
    icon: 'success',
    confirmButtonText: 'Ir al login'
  }).then(() => {
    window.location.href = 'login.html';
  });
});
