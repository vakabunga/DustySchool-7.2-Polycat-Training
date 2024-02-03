const DOMAIN_SERVER_NAME = 'http://localhost:3000';

const languagesListFrom = document.querySelector('.languages-list-from');
const languagesListTo = document.querySelector('.languages-list-to');
const textToTranslate = document.querySelector('.text-to-translate');
const translationForm = document.querySelector('.translation-form');
const translationResult = document.querySelector('.translation-result');
const statusText = document.querySelector('.status-text');
const translateButton = document.querySelector('.translate-button');

let languagesList;

// function which fills list of languages: list get from backend, container - <select> from html, defaultLang - selected lang,
// skip - for skipping 'auto' in the list
function fillTheList(list, container, defaultLang, skip) {
  for (const item in list) {
    if (skip === item) {
      continue;
    }

    const option = document.createElement('option');
    option.value = list[item];
    option.textContent = list[item];
    container.appendChild(option);

    if (defaultLang === item) {
      option.selected = 'selected';
    }
  }
}

// get the list of languages
fetch(`${DOMAIN_SERVER_NAME}/getlanguages`)
  .then(response => response.json())
  .then(data => {
    languagesList = data;
    fillTheList(data, languagesListFrom, 'ru');
    fillTheList(data, languagesListTo, 'en', 'auto');
  });

function getLangCodeByLang(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

translationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const originText = textToTranslate.value;
  const langFrom = getLangCodeByLang(languagesList, languagesListFrom.value);
  const langTo = getLangCodeByLang(languagesList, languagesListTo.value);

  statusText.textContent = '';

  if (originText === '') {
    statusText.textContent = 'Введите слово для перевода';
    return;
  };

  if (langFrom === langTo) {
    statusText.textContent = 'Выберете разные языки';
    return;
  }

  fetch(`${DOMAIN_SERVER_NAME}/translate?text=${originText}&from=${langFrom}&to=${langTo}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      statusText.textContent = '';
      translateButton.disabled = true;

      translationResult.textContent = data;
    })
    .catch(error => statusText.textContent = error)
    .finally(() => {
      textToTranslate.value = '';
      translateButton.disabled = false;
    });
})
