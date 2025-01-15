const nameInput = document.querySelector('.greeting__name');

const translatePlaceholder = {
  en: 'Enter name',
  ru: 'Введи имя',
}

function setNameToLocalStorage(name) {
  localStorage.setItem('username', name);
}

function getNameFromLocalStorage() {
  return localStorage.getItem('username');
}

function setInputValue(input) {
  input.value = getNameFromLocalStorage();
}

nameInput.addEventListener('change', (event) => {
  const name = event.target.value.trim();
  setNameToLocalStorage(name);
})

function translateGreetingPlaceholder(language = 'en') {
  nameInput.setAttribute('placeholder', `[${translatePlaceholder[language]}]`);
}

setInputValue(nameInput);