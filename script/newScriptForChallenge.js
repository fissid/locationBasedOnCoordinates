// google map key:   AIzaSyDgFOCWu_z3Cvo09DNJq39JHVraEqR4mjk
const inputLat = document.querySelector(".lat");
const inputLng = document.querySelector(".lng");
const searchBtn = document.querySelector(".search");
const errData = document.querySelector(".error-page");
const showData = document.querySelector(".get");
const setData = document.querySelector(".set");
const againBtn = document.querySelector(".again");
const errorMsg = document.querySelector(".error");
inputLat.focus();

const displayError = function (err) {
  console.log(err);
  errData.classList.remove("d-none");
  inputLat.focus();
};

const showCountryData = async function (cName) {
  try {
    const resp = await fetch(`https://restcountries.com/v3.1/name/${cName}`);
    if (!resp.ok) throw new Error("An error happened in restcountries.(not OK)");
    const data = await resp.json();
    const [compData] = data;
    //   console.log(compData);
    document.querySelector(".flag img").src = compData.flags.svg;
    document.querySelector(".country-name").textContent = compData.name.common;
    document.querySelector(".capital-name").textContent = compData.capital[0];
    document.querySelector(".continent-name").textContent = compData.region;
    document.querySelector(".population").textContent = `${(Number(compData.population) / 1000000).toFixed(3)} M`;
    document.querySelector(".currency").textContent = Object.values(compData.currencies)[0].name;
    document.querySelector(".language").textContent = Object.values(compData.languages)[0];
    setData.classList.add("d-none");
    showData.classList.remove("d-none");
    //   if there were no borders country return and close the function
    if (!compData.borders) return;
    compData.borders.forEach((each) => {
      document.querySelector(".neighbors").insertAdjacentHTML("afterbegin", `<span>${each}, </span>`);
    });
  } catch (err) {
    displayError(err);
  }
};

// input as an array of: [latitude, longitude]
// auth Code:	309587806577109377427x120060
const whereAmI = async function (coordinates) {
  try {
    const [lat, lng] = coordinates;
    const resp = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=309587806577109377427x120060`);
    if (!resp.ok) throw new Error("An error happened in geocode.(not OK)");
    const data = await resp.json();
    const country = data.country;
    //   console.log(data);
    //   const city = data.region;
    //   console.log(`You are in ${city}, ${country}`);
    document.querySelector(".map").href = `https://www.google.com/maps/@${lat},${lng},20.71z?entry=ttu`;
    document.querySelector(".card").classList.add("animation");
    document.querySelector(".card").classList.remove("fadeout");
    return showCountryData(country);
  } catch (err) {
    displayError(err);
  }
};

const initApp = function () {
  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const coords = [inputLat.value, inputLng.value];
    errorMsg.classList.add("d-none");
    if (!Number.isFinite(Number(coords[0])) || !Number.isFinite(Number(coords[1]))) {
      errorMsg.classList.remove("d-none");
      return;
    }
    whereAmI(coords);
    document.querySelector(".card").classList.add("fadeout");
  });

  againBtn.addEventListener("click", function (e) {
    e.preventDefault();
    inputLat.value = inputLng.value = "";
    document.querySelector(".neighbors").innerHTML = " ";
    setData.classList.remove("d-none");
    showData.classList.add("d-none");
  });
};

initApp();
