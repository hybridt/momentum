const settingsButton = document.querySelector('.settings__button');
const settings = document.querySelector('.settings');
const toggleInputs = document.querySelectorAll('.toggle__input');
const optionsInputs = document.querySelectorAll('.options__input');
const settingsWindow = document.querySelector('.settings__menu');

const settingsTranslate = {
  en: {
    headers: ['Language', 'Background Source', 'Audio Player', 'Weather', 'Clock', 'Date', 'Greeting', 'Quote of the Day', 'Todo'],
    options: ['English', 'Russian'],
  },

  ru: {
    headers: ['Язык', 'Источник фотографий', 'Аудиоплеер', 'Погода', 'Время', 'Дата', 'Приветствие', 'Цитата дня', 'Список дел'],
    options: ['Английский', 'Русский'],
  }
}

const defaultConfig = {
  lang: 'en',
  background: 'github',
  blocks: ['audio', 'clock', 'greeting', 'quote', 'weather', 'calendar', 'todo'],
}

window.addEventListener('load', () => {
  const blocks = JSON.parse(localStorage.getItem('blocks')) ?? defaultConfig.blocks;
  const language = localStorage.getItem('lang') ?? defaultConfig.lang;
  const background = localStorage.getItem('background') ?? defaultConfig.background;
  
  renderBlocks(blocks);
  translateWeather(language);
  translateSettingsWindow(language);
  translateGreetingPlaceholder(language);

  //Установка кнопок опций языка и фона
  optionsInputs.forEach(input => {
    if (input.value === language || input.value === background) {
      input.checked = true;
      switchOptionButton(input);
    }
  })
})

settingsWindow.addEventListener('transitionend', () => {
  if (!isMenuOpened()) {
    settingsWindow.style.display = 'none';
  }
})

settingsButton.addEventListener('click', toggleSettingsMenu);

toggleInputs.forEach(input => {
  input.addEventListener('click', () => {
    switchToggleButton(input.name);
    toggleBlockVisibility(input.name);
    saveVisibleBlocksToStorage();
  });
})

optionsInputs.forEach(input => {
  input.addEventListener('change', () => {
    switchOptionButton(input)
    saveOptionsToStorage();
    if (input.name === 'background') {
      getImage();
      setBackground();
    }
    if (input.name === 'lang') {
      updateWeather();
      setDate();
      translateWeather(input.value);
      translateQuote(input.value);
      translateSettingsWindow(input.value);
      translateGreetingPlaceholder(input.value);
    }
  })
})


function switchOptionButton(button) {
  resetOptionsList(button.name)
  const option = document.querySelector(`#${button.value}`);
  option.classList.toggle('options__item_selected');
}

function resetOptionsList(optionsName) {
  const optionsList = document.querySelectorAll(`.options__item_${optionsName}`);
  optionsList.forEach(option => {
    if (option.classList.contains('options__item_selected')) {
      option.classList.toggle('options__item_selected');
    }
  })
}

function isMenuOpened() {
  return settings.classList.contains('active');
}

function toggleSettingsMenu() {
  if (!isMenuOpened()) {
    settingsWindow.style.removeProperty('display');
    setTimeout(() => settings.classList.add('active'), 0);
  } else {
    settings.classList.remove('active');
  }
}

function switchToggleButton(buttonName) {
  const toggleButton = document.querySelector(`#${buttonName}`);
  toggleButton.classList.toggle('toggle_selected');
}

function toggleBlockVisibility(blockName) {
  const block = document.querySelector(`.${blockName}`);
  if (block) {
    block.classList.toggle('hidden');
  }
}

function renderBlocks(blocksList) {
  blocksList.forEach((block) => {
    toggleBlockVisibility(block);
    
    toggleInputs.forEach(input => {
      if (input.name === block) {
        input.checked = true;
      }
    })

    switchToggleButton(block);
  });
}

function saveVisibleBlocksToStorage() {
  const blocks = [];
  toggleInputs.forEach(input => {
    if (input.checked) {
      blocks.push(input.name);
    }
  })
  localStorage.setItem('blocks', JSON.stringify(blocks));
}

function saveOptionsToStorage() {
  optionsInputs.forEach(input => {
    if (input.checked) {
      localStorage.setItem(`${input.name}`, `${input.value}`);
    }
  });
}

function translateSettingsWindow(language = 'en') {
  const headers = document.querySelectorAll('.settings__title');
  const options = document.querySelectorAll('.options__item_lang');
  headers.forEach((header, index) => {
    const translatedHeader = settingsTranslate[language].headers[index];
    header.textContent = translatedHeader;
  })
  
  options.forEach((option, index) => {
    const translatedOption = settingsTranslate[language].options[index];
    option.childNodes[0].textContent = translatedOption;
  })
}