/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

// google map key:   AIzaSyDgFOCWu_z3Cvo09DNJq39JHVraEqR4mjk
const inputLat = document.querySelector(".lat");
const inputLng = document.querySelector(".lng");
const searchBtn = document.querySelector(".search");
const errorMsg = document.querySelector(".error");
const showData = document.querySelector(".get");
const setData = document.querySelector(".set");
const againBtn = document.querySelector(".again");
inputLat.focus();

const displayError = function (err) {
  errorMsg.classList.remove("d-none");
};

const showCountryData = function (cName) {
  fetch(`https://restcountries.com/v3.1/name/${cName}`)
    .then((response) => response.json())
    .then((data) => {
      setData.classList.add("d-none");
      showData.classList.remove("d-none");
      const [compData] = data;
      //   console.log(compData);
      document.querySelector(".flag img").src = compData.flags.svg;
      document.querySelector(".country-name").textContent = compData.name.common;
      document.querySelector(".capital-name").textContent = compData.capital[0];
      document.querySelector(".continent-name").textContent = compData.region;
      document.querySelector(".population").textContent = `${(Number(compData.population) / 1000000).toFixed(3)} M`;
      document.querySelector(".currency").textContent = Object.values(compData.currencies)[0].name;
      document.querySelector(".language").textContent = Object.values(compData.languages)[0];

      if (!compData.borders) return;
      compData.borders.forEach((each) => {
        document.querySelector(".neighbors").insertAdjacentHTML("afterbegin", `<span>${each}, </span>`);
      });
    });
};

// input as an array of: [latitude, longitude]
// auth Code:	309587806577109377427x120060
const whereAmI = function (coordinates) {
  const [lat, lng] = coordinates;
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=309587806577109377427x120060`)
    .then((response) => response.json())
    .then((data) => {
      const country = data.country;
      console.log(data);
      //   const city = data.region;
      //   console.log(`You are in ${city}, ${country}`);
      document.querySelector(".map").href = `https://www.google.com/maps/@${lat},${lng},20.71z?entry=ttu`;
      return showCountryData(country);
    })
    .catch((err) => {
      console.log(err);
      displayError(err);
    });
};

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const coords = [inputLat.value, inputLng.value];
  errorMsg.classList.add("d-none");
  if (!Number.isFinite(Number(coords[0])) || !Number.isFinite(Number(coords[1]))) {
    errorMsg.classList.remove("d-none");
    return;
  }
  whereAmI(coords);
});

againBtn.addEventListener("click", function (e) {
  e.preventDefault();
  inputLat.value = inputLng.value = "";
  document.querySelector(".neighbors").innerHTML = " ";
  setData.classList.remove("d-none");
  showData.classList.add("d-none");
});

// const berlin = [52.508, 13.381];
// const mumbai = [19.037, 72.873];
// const tehran = [35.65793, 51.39779];
// const cape = [-33.933, 18.474];
