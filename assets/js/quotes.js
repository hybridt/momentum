const quote = document.querySelector('.quote__text');
const quoteAuthor = document.querySelector('.quote__author');
const newQuoteButton = document.querySelector('.quote__new-btn');
let quoteNumber;

async function getQuote(language) {
  const url = `assets/quotes/quotes-${language}.json`;
  const response = await fetch(url);
  const data = await response.json();
  quoteNumber = getRandomQuoteNumber(data);
  return data[quoteNumber];
}

function getRandomQuoteNumber(data) {
  const max = data.length;
  return Math.floor(Math.random() * max);
}

async function showQuote() {
  let text, author;
  const lang = localStorage.getItem('lang') ?? 'en';
  await getQuote(lang).then(quote => {
    text = `"${quote.text}"`;
    author = quote.author;
  })
  quote.textContent = text;
  quoteAuthor.textContent = author;
}

async function translateQuote(language) {
  const url = `assets/quotes/quotes-${language}.json`;
  const response = await fetch(url);
  const data = await response.json();
  quote.textContent = `"${data[quoteNumber].text}"`;
  quoteAuthor.textContent = data[quoteNumber].author;
}

window.addEventListener('load', showQuote);
newQuoteButton.addEventListener('click', showQuote);