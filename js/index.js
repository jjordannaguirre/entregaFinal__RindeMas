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

  // Delegar el evento de cambio de checkbox
  dayGroup.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const updatedData = JSON.parse(localStorage.getItem('habit_days')) || {};
      const checkedDays = Array.from(dayGroup.querySelectorAll('input:checked')).map(cb => cb.value);
      updatedData[habitName] = checkedDays;
      localStorage.setItem('habit_days', JSON.stringify(updatedData));

      // Actualizar el progreso en la carta
      updateHabitProgress(habitName);
      // Actualizar el gráfico de progreso general
      updateProgressChart();
    }
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
  const habitsList = JSON.parse(localStorage.getItem('habits_list')) || [];
  habitsList.forEach(habitName => createHabitCard(habitName)); // Crear las cartas de los hábitos existentes
  updateProgressChart();
});

// Función para crear un nuevo hábito
const addHabitBtn = document.querySelector('.add-button'); // Asegúrate de que este selector sea correcto
const habitContainer = document.querySelector('.habits-grid'); // Contenedor donde se agregarán las cartas

addHabitBtn.addEventListener('click', () => {
  Swal.fire({
    title: 'Nuevo Hábito',
    input: 'text',
    inputLabel: 'Nombre del hábito',
    showCancelButton: true,
    confirmButtonText: 'Crear',
  }).then(result => {
    if (result.isConfirmed && result.value) {
      const habitName = result.value.trim();
      if (habitName) {
        createHabitCard(habitName);
        saveHabitToLocalStorage(habitName);
      }
    }
  });
});

// Crear una carta de hábito dinámicamente
function createHabitCard(habitName) {
  const habitId = habitName.replace(/\s/g, '-').toLowerCase();
  const card = document.createElement('div');
  card.className = 'habit-card';
  card.innerHTML = `
    <div class="habit-header">
      <div>
        <h3>${habitName}</h3>
        <p class="category">Nuevo hábito</p>
      </div>
      <button class="delete-btn">Borrar</button> <!-- Botón para eliminar -->
    </div>
    <div class="week-days" data-habit="${habitName}" id="${habitId}">
      ${createCheckboxesHTML()}
    </div>
  `;

  // Agregar el botón de eliminar funcional
  card.querySelector('.delete-btn').addEventListener('click', () => {
    deleteHabit(habitName, card);
  });

  habitContainer.appendChild(card);

  // Añadir el progreso y los eventos
  updateHabitProgress(habitName);
  updateProgressChart();
}

// Generar los checkboxes de los días de la semana
function createCheckboxesHTML() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  return days.map(day => `<label><input type="checkbox" value="${day}">${day}</label>`).join('');
}

// Función para eliminar un hábito
function deleteHabit(habitName, card) {
  // Eliminar del DOM
  card.remove();

  // Eliminar del localStorage
  const habits = JSON.parse(localStorage.getItem('habits_list')) || [];
  const updatedHabits = habits.filter(h => h !== habitName);
  localStorage.setItem('habits_list', JSON.stringify(updatedHabits));

  // Eliminar el progreso del hábito del localStorage
  const habitData = JSON.parse(localStorage.getItem('habit_days')) || {};
  delete habitData[habitName];
  localStorage.setItem('habit_days', JSON.stringify(habitData));

  // Actualizar el gráfico de progreso general
  updateProgressChart();
}

// Guardar el hábito en localStorage
function saveHabitToLocalStorage(habitName) {
  const habits = JSON.parse(localStorage.getItem('habits_list')) || [];
  if (!habits.includes(habitName)) {
    habits.push(habitName);
    localStorage.setItem('habits_list', JSON.stringify(habits));
  }
}


