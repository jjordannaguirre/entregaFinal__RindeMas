// Verificar si el usuario está autenticado
const user = JSON.parse(localStorage.getItem('login_success')) || false;
if (!user) {
  window.location.href = 'login.html';
}

// Función para cerrar sesión
const logout = document.querySelector('#logout');
logout.addEventListener('click', () => {
  Swal.fire({
    title: 'Hasta pronto!',
    text: 'Tu sesión ha sido cerrada correctamente.',
    icon: 'info',
    confirmButtonText: 'OK'
  }).then(() => {
    localStorage.removeItem('login_success');
    window.location.href = 'login.html';
  });
});

// Función para manejar el progreso de los hábitos
document.querySelectorAll('.week-days').forEach(dayGroup => {
  const habitName = dayGroup.dataset.habit;
  const habitId = habitName.replace(/\s/g, '-').toLowerCase(); // Para asegurar un ID único

  // Inicializar el progreso desde el localStorage
  const savedData = JSON.parse(localStorage.getItem('habit_days')) || {};
  if (savedData[habitName]) {
    const checkedDays = savedData[habitName];
    dayGroup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = checkedDays.includes(checkbox.value);
    });
  }

  // Escuchar cambios en los checkboxes
  dayGroup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const updatedData = JSON.parse(localStorage.getItem('habit_days')) || {};
      const checkedDays = Array.from(dayGroup.querySelectorAll('input:checked')).map(cb => cb.value);
      updatedData[habitName] = checkedDays;
      localStorage.setItem('habit_days', JSON.stringify(updatedData));

      // Actualizar el progreso en la carta
      updateHabitProgress(habitName);
      // Actualizar el gráfico de progreso general
      updateProgressChart();
    });
  });
});

// Función para actualizar el progreso de un hábito específico
function updateHabitProgress(habitName) {
  const savedData = JSON.parse(localStorage.getItem('habit_days')) || {};
  const checkedDays = savedData[habitName] || [];
  const totalDays = 7; // Se asume que son 7 días de la semana
  const progress = Math.round((checkedDays.length / totalDays) * 100);

  // Actualizar el porcentaje de progreso en el DOM
  const progressElement = document.querySelector(`#${habitName.replace(/\s/g, '-')}-progress`);
  if (progressElement) {
    progressElement.textContent = `${progress}%`;
  }
}

// Función para actualizar el gráfico de progreso general
function updateProgressChart() {
  const habitData = JSON.parse(localStorage.getItem('habit_days')) || {};
  const habits = ['Hacer ejercicio', 'Leer un libro', 'Estudiar matemáticas'];
  let totalProgress = 0;

  habits.forEach(habitName => {
    const checkedDays = habitData[habitName] || [];
    const totalDays = 7;
    totalProgress += (checkedDays.length / totalDays) * 100;
  });

  const averageProgress = totalProgress / habits.length;

  const ctx = document.getElementById('progressChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completado', 'Pendiente'],
      datasets: [{
        data: [averageProgress, 100 - averageProgress],
        backgroundColor: ['#4caf50', '#e0e0e0'],
      }],
    },
  });
}

// Inicializar el progreso cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
  updateHabitProgress('Hacer ejercicio');
  updateHabitProgress('Leer un libro');
  updateProgressChart();
});

