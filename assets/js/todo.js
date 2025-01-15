const todoButton = document.querySelector('.todo__btn');
const todoBlock = document.querySelector('.todo');
const addButton = document.querySelector('.todo__button');
const todoInput = document.querySelector('#do');
const doList = document.querySelector('.todo__list');
const todoStartBlock = document.querySelector('.todo__start-block');

const todoList = {
  items: [],
  done: [],
}

window.addEventListener('load', () => {
  renderTodoListItems();

  const checkboxes = document.querySelectorAll('.todo__checkbox');
  
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
      const todoItem = checkbox.parentNode;
      if (checkbox.checked) {
        const todoItemText = todoItem.querySelector('.todo__item-text').textContent;
        todoList.done[index] = todoItemText;
      } else {
        todoList.done[index] = null;
      }
    });
  });
})

window.addEventListener('unload', () => {
  saveTodoToStorage()
}) 

todoButton.addEventListener('click', openTodoMenu);
addButton.addEventListener('click', () => {
  setFocusInput();
});

todoInput.addEventListener('change', (event) => {
  const inputValue = event.target.value.trim();
  if (inputValue) {
    todoList.items.push(inputValue);
    todoList.done.push(null);
    saveTodoToStorage();
    addTodoItem(inputValue)
    toggleTodoList();
  }
  event.target.value = '';
})

function openTodoMenu() {
  todoBlock.classList.toggle('active');
};

function setFocusInput() {
  todoInput.focus();
}

function toggleTodoList() {
  const todoItem = document.querySelector('.todo__item');
  if (todoItem) {
    doList.classList.add('active');
    todoStartBlock.classList.add('hidden');
  }
}

function addTodoItem(string) {
  const todoItem = document.createElement('li');
  todoItem.className = 'todo__item';
  todoItem.innerHTML = `
    <input class="todo__checkbox" type="checkbox">
    <span class="todo__item-text">${string}</span>`
  doList.appendChild(todoItem);

  const checkbox = todoItem.querySelector('.todo__checkbox');
  checkbox.addEventListener('change', () => {
    todoItem.classList.toggle('todo__item_done');
  });
}

function renderTodoListItems() {
  todoList.items = JSON.parse(localStorage.getItem('todoItems')) ?? todoList.items;
  todoList.done = JSON.parse(localStorage.getItem('todoDone')) ?? todoList.done;
  if (todoList.items.length) {
    todoList.items.forEach((item, index) => {
      addTodoItem(item);
      if (todoList.done[index]) {
        const checkbox = document.querySelectorAll('.todo__checkbox')[index];
        const todoItemText = document.querySelectorAll('.todo__item')[index];
        todoItemText.classList.add('todo__item_done');
        checkbox.checked = true;
      }
    })
    toggleTodoList();
  }
}

function saveTodoToStorage() {
  localStorage.setItem('todoItems', JSON.stringify(todoList.items));
  localStorage.setItem('todoDone', JSON.stringify(todoList.done));
}