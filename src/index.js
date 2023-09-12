import axios from 'axios';
import SlimSelect from 'slim-select';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
axios.defaults.headers.common['x-api-key'] =
  'live_CgU1QU2osMc3TIjsrnYRN4ibf8FU7xev27hoOGbyeVIeVA0Kn2HO1TQbRNe4Pc6l';

import { fetchBreeds, fetchCatByBreed } from './cat-api';

const elements = {
  select: document.querySelector(`.breed-select`),
  catCard: document.querySelector(`.cat-info`),
  loader: document.querySelector('.loader'),
};

// function fetchBreeds() {
//   showLoader();
//   return axios.get(`https://api.thecatapi.com/v1/breeds`).then(response => {
//     return response.data;
//   });
// }

function breedsList() {
  fetchBreeds()
    .then(data => {
      const optionsHtml = data
        .map(({ id, name }) => `<option value="${id}">${name}</option>`)
        .join('');
      elements.select.insertAdjacentHTML('beforeend', optionsHtml); // Додавання списку порід до select елементу
      new SlimSelect({
        select: '.breed-select',
      });
      hideLoader();
      showSelect();
    })
    .catch(err => {
      showError();
      hideLoader();
    });
}

breedsList();

function showLoader() {
  elements.loader.style.display = `block`;
}

function hideLoader() {
  elements.loader.style.display = `none`;
}

function showSelect() {
  elements.select.classList.remove(`cat-info-vis`);
}

function showError() {
  Notify.failure(`Oops! Something went wrong! Try reloading the page!`);
}

function showCatInfo() {
  elements.catCard.classList.remove(`cat-info-vis`);
}
function hideCatInfo() {
  elements.catCard.classList.add(`cat-info-vis`);
}

// function fetchCatByBreed(breedId) {
//   showLoader();
//   return axios
//     .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
//     .then(response => {
//       return response.data[0];
//     });
// }

elements.select.addEventListener(`change`, createCard);

function createCard(event) {
  const selectedBreedId = event.target.value;
  hideCatInfo();
  // Отримати дані про кота за вибраною породою
  fetchCatByBreed(selectedBreedId)
    .then(({ url, breeds }) => {
      const { temperament, description, name } = breeds[0];

      const catInfo = `<img class="catImage" src="${url}" alt="${name}" width="180"/>
      <div class="cat-descr"><h1>${name}</h1>
      <h2>${temperament}</h2>
      <p>${description}</p></div>`;

      elements.catCard.innerHTML = catInfo;

      // showCatInfo();
    })
    .then(() => {
      const catImg = document.querySelector('.catImage');
      if (catImg) {
        catImg.style.display = `block`;
        catImg.style.paddingTop = `15px`;
        catImg.style.alignSelf = `flex-start`;
      }
      catImg.addEventListener('load', function () {
        hideLoader();
        showCatInfo();
      });
    })
    .catch(error => {
      showError();
      hideLoader();
    });
}

export { showLoader };
