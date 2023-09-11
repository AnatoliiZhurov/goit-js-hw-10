import axios from 'axios';
import SlimSelect from 'slim-select';
// new SlimSelect({
//   select: '.breed-select',
// });
axios.defaults.headers.common['x-api-key'] =
  'live_CgU1QU2osMc3TIjsrnYRN4ibf8FU7xev27hoOGbyeVIeVA0Kn2HO1TQbRNe4Pc6l';

const elements = {
  select: document.querySelector(`.breed-select`),
  catCard: document.querySelector(`.cat-info`),
  loader: document.querySelector('.loader'),
  errInfo: document.querySelector(`.error`),
};

function fetchBreeds() {
  return axios.get(`https://api.thecatapi.com/v1/breeds`).then(response => {
    // console.log(response);

    return response.data;
  });
}

function breedsList() {
  fetchBreeds()
    .then(data => {
      const optionsHtml = data
        .map(({ id, name }) => `<option value="${id}">${name}</option>`)
        .join('');
      elements.select.insertAdjacentHTML('beforeend', optionsHtml); // Додавання списку порід до select елементу
    })
    .catch(err => {
      showError();
      hideLoader();
    });
}

breedsList();

elements.errInfo.style.display = 'none';
elements.loader.style.display = 'none';

function showLoader() {
  elements.loader.style.display = 'block';
  elements.select.style.display = 'none';
  elements.catCard.style.display = 'none';
}

function hideLoader() {
  elements.loader.style.display = 'none';
}

function showError() {
  elements.errInfo.style.display = 'block';
}

function showCatInfo() {
  elements.catCard.style.display = 'block';
  elements.select.style.display = 'block';
}

function fetchCatByBreed(breedId) {
  showLoader();
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      return response.data[0];
    });
}

elements.select.addEventListener(`change`, createCard);

function createCard(event) {
  const selectedBreedId = event.target.value;

  // Отримати дані про кота за вибраною породою
  fetchCatByBreed(selectedBreedId)
    .then(({ url, breeds }) => {
      const { temperament, description, name } = breeds[0];

      console.log(url, temperament, description, name);
      const catInfo = `<img src="${url}" alt="${name}" width="300"/>
      <h1>${name}</h1>
      <h2>${temperament}</h2>
      <p>${description}</p>`;

      elements.catCard.innerHTML = catInfo;
      hideLoader();
      showCatInfo();
    })
    .catch(error => {
      showError();
      hideLoader();
    });
}
