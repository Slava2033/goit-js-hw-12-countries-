import css from "./css/styles.css";
import fetchCountry from './js/fetchCountries';
import refs from './js/refs';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';


import { error } from '@pnotify/core';
import countryCardTlt from './templates/country-card.hbs';
import listCountriesTpl from './templates/list-countries.hbs';
import debounce from 'lodash.debounce';

refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch() {
    onInputClear();
    const searchQuery = refs.input.value.trim();
    fetchCountry(searchQuery)
        .then(country => {
            if (country.length > 10) {
                error({
                    text: 'Too many matches found. Please enter a more specific query!',
                });
            } else if (country.status === 404) {
                error({
                    text: 'No country has been found. Please enter a more specific query!',
                });
            } else if (country.length === 1) {
                onRenderCountryCard(country);
            } else if (country.length <= 10) {
                onRenderListCountries(country);
            }
        })
        .catch(onFetchError);
}

function onRenderCountryCard(country) {
    const markup = countryCardTlt(country);
    refs.infoBox.innerHTML = markup;
}

function onRenderListCountries(country) {
    const listMarkup = listCountriesTpl(country);
    refs.countries.insertAdjacentHTML('beforeend', listMarkup);
}

function onInputClear() {
    refs.infoBox.innerHTML = '';
    refs.countries.innerHTML = '';
}

function onFetchError(Error) {
    Error;
}