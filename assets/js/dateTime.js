const clock = document.querySelector('.clock');
const calendar = document.querySelector('.calendar');
const timeOfDay = document.querySelector('.greeting__time-of-day');
let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let defaultLang = 'en';

function setTime() {
  const date = new Date();
  const locale = localStorage.getItem('lang') ?? defaultLang;
  const currentTime = date.toLocaleTimeString(locale);
  const newTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (currentTime === '00:00:00' || currentTime === '12:00:00 AM' || timeZone !== newTimeZone) {
    timeZone = newTimeZone;
    setDate();
  }
    
  clock.innerHTML = currentTime;
  setGreeting();
  setTimeout(setTime, 1000);
}

function setDate() {
  const date = new Date();
  const locale = localStorage.getItem('lang') ?? defaultLang;
  const dateFormat = {weekday: 'long', month: 'long', day: 'numeric'};
  const currentDate = date.toLocaleDateString(locale, dateFormat);
  calendar.innerHTML = currentDate;
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 0 && hours < 6) return 'night';
  if (hours >= 6 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 18) return 'afternoon';
  if (hours >= 18 && hours < 24) return 'evening';
}

function setGreeting() {
  let greeting;
  const time = getTimeOfDay();
  const lang = localStorage.getItem('lang') ?? defaultLang;
  if (lang !== 'en') {
    if (time === 'night') greeting = 'Доброй ночи';
    if (time === 'morning') greeting = 'Доброе утро';
    if (time === 'afternoon') greeting = 'Доброго дня';
    if (time === 'evening') greeting = 'Добрый вечер';
    timeOfDay.innerHTML = `${greeting},`;
  } else {
    timeOfDay.innerHTML = `Good ${time},`;
  }
}

setTime();
setDate();
setGreeting();
