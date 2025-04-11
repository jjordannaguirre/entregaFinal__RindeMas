// Verificar si el usuario está autenticado
const user = JSON.parse(localStorage.getItem('login_success')) || false;
if (!user) {
  window.location.href = 'login.html';
}

// Función para cerrar sesión
const logout = document.querySelector('#logout');
logout.addEventListener('click', () => {
  alert('Hasta pronto!');
  localStorage.removeItem('login_success');
  window.location.href = 'login.html';
});

// Función para manejar el progreso de los hábitos
document.querySelectorAll('.week-days').forEach(dayGroup => {
  const habitName = dayGroup.dataset.habit;
  const savedData = JSON.parse(localStorage.getItem('habit_days')) || {};

  // Marcar los días guardados en el localStorage
  if (savedData[habitName]) {
    const daysCompleted = savedData[habitName];
    dayGroup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      if (daysCompleted.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }

  // Escuchar cambios en los checkboxes
  dayGroup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const updatedData = JSON.parse(localStorage.getItem('habit_days')) || {};
      const checkedDays = Array.from(dayGroup.querySelectorAll('input:checked')).map(cb => cb.value);
      updatedData[habitName] = checkedDays;
      localStorage.setItem('habit_days', JSON.stringify(updatedData));

      // Llamar a la función para actualizar el gráfico de progreso
      updateProgressChart();
    });
  });
});

// Función para actualizar el gráfico de progreso
function updateProgressChart() {
  const habitData = JSON.parse(localStorage.getItem('habit_days')) || {};

  // Asumimos que hay un hábito llamado "Hacer ejercicio"
  const completedDays = habitData['Hacer ejercicio'] || [];
  const totalDays = 7; // Total de días en una semana (Lunes a Domingo)
  const progress = (completedDays.length / totalDays) * 100;

  // Obtener el contexto del gráfico y actualizar
  const ctx = document.getElementById('progressChart').getContext('2d');
  const progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completado', 'Pendiente'],
      datasets: [{
        data: [progress, 100 - progress],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Llamar a la función para cargar el gráfico de progreso al iniciar
document.addEventListener('DOMContentLoaded', updateProgressChart);