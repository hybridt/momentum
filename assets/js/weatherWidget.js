const cityInput = document.querySelector('.weather__city');
const weatherIcon = document.querySelector('.weather__image');
const temperature = document.querySelector('.weather__temp');
const weatherDescription = document.querySelector('.weather__description');
const wind = document.querySelector('.weather__wind');
const humidity = document.querySelector('.weather__humidity');

const weatherTranslate = {
  en: ['Wind speed', 'Humidity'],
  ru: ['Ветер', 'Влажность'],
}

let lang = getLanguageFromStorage();
const apiKey = '1abb018ddf12ff265160c42a6df22fe0';
const defaultCity = 'Minsk';

async function getWeather(city) {
  lang = getLanguageFromStorage();
  const units = (lang === 'en') ? 'imperial' : 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`
  const response = await fetch(url);
  if (response.ok) {
    const weatherData = await response.json();
    showWeather(weatherData);
  }
  else {
    showError();
    setTimeout(hideError, 2000);
    localStorage.setItem('city', defaultCity);
  }
}

function showWeather(data) {
  if (lang === 'ru') {
    degrees = '°C';
    speedUnit = 'м/с';
  } else {
    degrees = '°F';
    speedUnit = 'mph';
  }
  const city = data.name;

  cityInput.value = city;
  weatherIcon.className = 'weather__image owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}${degrees}`;
  weatherDescription.textContent = `${data.weather[0].description}`;
  wind.textContent = `${Math.round(data.wind.speed)} ${speedUnit}`;
  humidity.textContent = `${data.main.humidity}%`;
}

function inputHandler() {
  const city = cityInput.value.trim();

  if (city) {
    getWeather(city);
    setCityToLocalStorage(city);
  }
  else {
    showError();
    setTimeout(hideError, 2000);
  }
}

function setCityToLocalStorage(city) {
  localStorage.setItem('city', city);
}

function getCityFromLocalStorage() {
  let city = localStorage.getItem('city') ?? defaultCity;
  cityInput.value = city;
  getWeather(city);
  return city;
}

function showError() {
  const weatherInput = document.querySelector('.weather__input');
  const error = document.createElement('span');

  error.innerHTML = (lang === 'en') ? 'City not found' : 'Город не найден';
  error.className = 'error';
  weatherInput.appendChild(error);

  requestAnimationFrame(() => {
    error.style.opacity = 1;
  })
}

function hideError() {
  const error = document.querySelector('.error');
  error.remove();
}

function updateWeather() {
  const updateInterval = 60000;
  const city = localStorage.getItem('city') ?? defaultCity;
  getWeather(city);
  setTimeout(updateWeather, updateInterval);
}

function getLanguageFromStorage() {
  return localStorage.getItem('lang') ?? 'en';
}

function translateWeather(language = 'en') {
  const weatherHeaders = document.querySelectorAll('.weather__header');
  weatherHeaders.forEach((header, index) => {
    const translatedHeader = weatherTranslate[language][index];
    header.childNodes[0].textContent = `${translatedHeader}: `;
  })
}

cityInput.addEventListener('change', inputHandler);
window.addEventListener('load', getCityFromLocalStorage);

updateWeather();