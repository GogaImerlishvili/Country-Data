// Selectors
let countriesContainer = document.querySelector(".countries");
let searchButton = document.querySelector(".search-button");
let searchInput = document.querySelector(".search-control");

// AddeventListeners
searchButton.addEventListener("click", getCountryData);

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    return getCountryData();
  }
});

// Functions
function renderCountry(data) {
  const html = `<article class="country">
      <img class="country__img" src="${data.flag}"/>
      <div class="country__data">
        <h3 class="country__name">${data.altSpellings[1]}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${+data.population / 1000000}</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].symbol}</p>
      </div>
    </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
}

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
};

function getCountryData() {
  let searchInput = document.querySelector(".search-control").value.trim();
  fetch(`https://restcountries.com/v2/name/${searchInput}`)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Country not fount ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Country not found ${response.status}`);
      }
      return response.json();
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      console.error(err);
      renderError(`Something went wrong ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}
