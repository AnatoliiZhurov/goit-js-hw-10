import axios from 'axios';
import { showLoader } from './index';
axios.defaults.headers.common['x-api-key'] =
  'live_CgU1QU2osMc3TIjsrnYRN4ibf8FU7xev27hoOGbyeVIeVA0Kn2HO1TQbRNe4Pc6l';

function fetchBreeds() {
  showLoader();
  return axios.get(`https://api.thecatapi.com/v1/breeds`).then(response => {
    return response.data;
  });
}

function fetchCatByBreed(breedId) {
  showLoader();
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      return response.data[0];
    });
}

export { fetchBreeds, fetchCatByBreed };
