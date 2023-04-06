import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import countryInfoMarkup from './templates/countryInfoMarkup.hbs';
import countryListMarkup from './templates/countryListMarkup.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  contryInfoEl: document.querySelector('.country-info'),
};

refs.searchInputEl.addEventListener(
  'input',
  debounce(handleSearchCountry, DEBOUNCE_DELAY)
);

function handleSearchCountry(evt) {
  const countryName = evt.target.value.trim();

  if (countryName === '') {
    return deleteMarkup();
  }

  fetchCountries(countryName)
    .then(country => {
      deleteMarkup();

      if (country.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (country.length === 1) {
        createInfoMarkup(country);
      } else {
        createListMarkup(country);
      }
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name.');
      deleteMarkup();
    });
}

function deleteMarkup() {
  refs.contryInfoEl.innerHTML = '';
  refs.countryListEl.innerHTML = '';
}

function createInfoMarkup(country) {
  refs.countryListEl.insertAdjacentHTML(
    'beforeend',
    countryListMarkup(country)
  );
  refs.contryInfoEl.insertAdjacentHTML('beforeend', countryInfoMarkup(country));
}

function createListMarkup(country) {
  refs.countryListEl.insertAdjacentHTML(
    'beforeend',
    countryListMarkup(country)
  );
}
