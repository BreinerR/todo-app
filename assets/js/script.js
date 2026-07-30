'use strict';

//=====================================
// SELECCIÓN DEL DOM
//=====================================

// --- Formulario para agregar tareas ---
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');

// --- Buscador y filtros ---
const searchInput = document.getElementById('searchInput');
const filtersContainer = document.getElementById('filters');

// --- Estadísticas ---
const totalCountEl = document.getElementById('totalCount');
const pendingCountEl = document.getElementById('pendingCount');
const completedCountEl = document.getElementById('completedCount');

// --- Lista de tareas ---
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

// --- Botón para eliminar todas las tareas ---
const clearAllBtn = document.getElementById('clearAllBtn');


//=====================================
// VARIABLES
//=====================================

/**
 * Arreglo que representa el "estado" de la aplicación: la fuente
 * de la verdad. Cada tarea es un objeto con esta forma:
 * { id: number, text: string, completed: boolean }
 *
 * NOTA TEMPORAL: dejamos 3 tareas de ejemplo para poder probar
 * renderTasks() en este paso. En el Paso 6 (LocalStorage) este
 * arreglo se cargará desde el navegador y estas tareas de prueba
 * desaparecerán.
 */
let tasks = [
    { id: 1, text: 'Aprender Flexbox y CSS Grid', completed: true },
    { id: 2, text: 'Construir la lógica de la To-Do App', completed: false },
    { id: 3, text: 'Subir el proyecto a GitHub', completed: false },
];

/**
 * Filtro actualmente activo: 'all' | 'pending' | 'completed'.
 * Controla qué subconjunto de `tasks` se muestra en pantalla.
 */
let currentFilter = 'all';

/**
 * Texto actual del buscador. Se combina con currentFilter
 * para decidir qué tareas se renderizan.
 */
let searchTerm = '';


//=====================================
// FUNCIONES
//=====================================

/**
 * Aplica el filtro activo (currentFilter) y el término de búsqueda
 * (searchTerm) sobre el arreglo `tasks`, sin modificarlo.
 * @returns {Array<Object>} Subconjunto de tareas a mostrar.
 */
function getFilteredTasks() {
    return tasks.filter((task) => {
        // 1. ¿Coincide con el filtro de estado?
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'pending' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);

        // 2. ¿Coincide con el texto buscado? (insensible a mayúsculas)
        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });
}

/**
 * Construye el elemento <li> de una tarea a partir de sus datos.
 * Aún no tiene eventos conectados (eso lo agregamos en el Paso 6,
 * junto con addTask/deleteTask/toggleTask).
 * @param {Object} task Objeto de tarea { id, text, completed }.
 * @returns {HTMLLIElement} Elemento <li> listo para insertar en el DOM.
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' task-item--completed' : '');
    // Guardamos el id en un data-attribute: así, cuando agreguemos
    // eventos de clic, sabremos a qué tarea corresponde cada botón.
    li.dataset.id = task.id;

    li.innerHTML = `
        <span class="task-item__checkbox${task.completed ? ' task-item__checkbox--checked' : ''}"></span>
        <span class="task-item__text">${task.text}</span>
        <div class="task-item__actions">
            <button type="button" class="task-item__action-btn task-item__action-btn--edit" aria-label="Editar tarea">✎</button>
            <button type="button" class="task-item__action-btn task-item__action-btn--delete" aria-label="Eliminar tarea">🗑</button>
        </div>
    `;

    return li;
}

/**
 * Actualiza los tres contadores del panel de estadísticas
 * (Total, Pendientes, Completadas) a partir de `tasks`.
 * Siempre cuenta sobre el arreglo completo, no sobre el filtrado,
 * para que los números reflejen la realidad aunque estés filtrando.
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    pendingCountEl.textContent = pending;
    completedCountEl.textContent = completed;
}

/**
 * Dibuja en el DOM la lista de tareas visible según el filtro
 * y la búsqueda actuales. Se llama cada vez que el estado cambia
 * (agregar, eliminar, editar, marcar, filtrar, buscar).
 */
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    // Limpiamos la lista antes de volver a dibujarla
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.hidden = false;
        emptyState.textContent =
            tasks.length === 0
                ? 'No tienes tareas todavía. ¡Agrega la primera! 🚀'
                : 'No encontramos tareas que coincidan. 🔍';
    } else {
        emptyState.hidden = true;

        // Usamos un DocumentFragment para insertar todos los <li>
        // de una sola vez y evitar múltiples repintados del navegador.
        const fragment = document.createDocumentFragment();
        filteredTasks.forEach((task) => {
            fragment.appendChild(createTaskElement(task));
        });
        taskList.appendChild(fragment);
    }

    updateStats();
}


//=====================================
// EVENTOS
//=====================================
// Aquí conectaremos los eventos del usuario
// (submit del formulario, clics, etc.) con las funciones.
// (Se completa en el Paso 6: addTask, deleteTask, toggleTask, etc.)

// --- Renderizado inicial ---
// Por ahora, la única "acción" es dibujar el estado inicial
// (las 3 tareas de ejemplo) apenas carga la página.
renderTasks();