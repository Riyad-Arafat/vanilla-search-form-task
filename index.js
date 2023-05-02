// Get the input and list elements
const destinationInput = document.getElementById("destination");
const nationalityInput = document.getElementById("nationality");
const countryInput = document.getElementById("country");
const cityInput = document.getElementById("city");
const checkInInput = document.getElementById("check-in-date");
const checkOutInput = document.getElementById("check-out-date");
const nightsInput = document.getElementById("nights");
const countryList = document.getElementById("country-list");
const cityList = document.getElementById("city-list");
const destinationList = document.getElementById("destination-list");
const nationalityList = document.getElementById("nationality-list");

// destinations mock array
const destinations = [
  "Dubai, United Arab Emirates",
  "Abu Dhabi, United Arab Emirates",
  "Doha, Qatar",
  "Riyadh, Saudi Arabia",
  "Muscat, Oman",
  "Manama, Bahrain",
  "Amman, Jordan",
  "Beirut, Lebanon",
  "Cairo, Egypt",
  "Marrakech, Morocco",
  "Tokyo, Japan",
  "Paris, France",
  "New York City, USA",
  "Sydney, Australia",
  "Cape Town, South Africa",
  "Rio de Janeiro, Brazil",
  "Barcelona, Spain",
  "Dubai, United Arab Emirates",
  "Bali, Indonesia",
  "Amsterdam, Netherlands",
  "Marrakech, Morocco",
  "Santorini, Greece",
  "Phuket, Thailand",
  "Vancouver, Canada",
  "Istanbul, Turkey",
  "San Francisco, USA",
  "Bangkok, Thailand",
  "Queenstown, New Zealand",
  "Havana, Cuba",
  "Reykjavik, Iceland",
  "Moscow, Russia",
  "Edinburgh, Scotland",
  "Seoul, South Korea",
  "Zurich, Switzerland",
  "Toronto, Canada",
];

// serialize the destinations array to be used in the search function
const destinations_data = destinations.map((destination) => ({
  label: destination,
  value: destination,
}));

function search(element, input, data, type = "destination") {
  function showListBody() {
    if (element.classList.contains("hidden")) {
      element.classList.remove("hidden");
    }
  }

  function hideListBody() {
    if (!element.classList.contains("hidden")) {
      element.classList.add("hidden");
    }
  }

  var value = this.value;
  element.innerHTML = "";
  let hasMatch = false;
  if (value.length > 0) {
    data.forEach(function ({ label, value: item_value }) {
      if (!item_value) return;
      if (item_value.toLowerCase().indexOf(value.toLowerCase()) === 0) {
        var li = document.createElement("li");
        li.innerHTML = label;
        li.addEventListener("click", function () {
          if (type !== "destination") input.value = label;
          else input.value = item_value;
          element.innerHTML = "";
          hideListBody();
        });
        element.appendChild(li);
        hasMatch = true;
      }
    });
    hasMatch ? showListBody() : hideListBody();
  } else hideListBody();
}

// function to disable dates before today in the check-in and check-out
function disableDatesBeforeToday() {
  const today = new Date().toISOString().slice(0, 10);
  checkInInput.setAttribute("min", today);
  checkOutInput.setAttribute("min", today);
}

// function to disable dates before the check-in date in the check-out
function disableDatesBeforeCheckIn() {
  checkOutInput.setAttribute("min", checkInInput.value);
}

function calculateNights(event) {
  const checkInDate = !checkInInput.value
    ? new Date()
    : new Date(checkInInput.value);
  const checkOutDate = !checkOutInput.value
    ? new Date(checkInDate.getTime() + 1000 * 60 * 60 * 24)
    : new Date(checkOutInput.value);
  const currentNight = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
  let nights = Math.max(currentNight, 1);
  // if the event is "night", update the nights to match the value of the input
  if (event === "night") {
    nights = nightsInput.value;
  }
  // update the value of the nights input
  nightsInput.value = nights;
  // update check-out value based on nights
  if (nights > 0) {
    const newCheckOutDate = new Date(
      checkInDate.getTime() + nights * (1000 * 60 * 60 * 24)
    );
    checkOutInput.value = newCheckOutDate.toISOString().slice(0, 10);
    checkInInput.value = checkInDate.toISOString().slice(0, 10);
  }
}

// Call the functions to disable dates before today
disableDatesBeforeToday();

// Add event listeners to check-in  inputs
checkInInput.addEventListener("input", function () {
  calculateNights();
  disableDatesBeforeCheckIn();
});
// Add event listeners to check-out inputs
checkOutInput.addEventListener("input", function () {
  calculateNights();
});

// Add event listeners to nights input
nightsInput.addEventListener("input", function () {
  calculateNights("night");
});

//////////////////////////// AutoComplete ////////////////////////////
let nationalities = null;
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Hide the list when the user clicks outside of it
document.addEventListener("click", function (event) {
  const destination_condition =
    event.target !== destinationInput && event.target !== destinationList;
  const nationality_condition =
    event.target !== nationalityInput && event.target !== nationalityList;

  const country_condition =
    event.target !== countryInput && event.target !== countryList;

  const city_condition =
    event.target !== cityInput && event.target !== cityList;

  if (destination_condition) destinationList.innerHTML = "";

  if (nationality_condition) nationalityList.innerHTML = "";

  if (country_condition) countryList.innerHTML = "";

  if (city_condition) cityList.innerHTML = "";
});

// Add an event listener to destination input
destinationInput.addEventListener("input", function () {
  search.apply(this, [destinationList, destinationInput, destinations_data]);
});

// Add an event listener to the nationality input
nationalityInput.addEventListener("input", async function (e) {
  e.preventDefault();

  if (!nationalities) {
    const Countries = await fetchCountries();
    nationalities = Countries.map((country) => ({
      label: `${country.flag} ${country.demonyms?.eng.m}`,
      value: country.demonyms?.eng.m,
    }));
  }

  search.apply(this, [
    nationalityList,
    nationalityInput,
    nationalities,
    "flag",
  ]);
});

// Add an event listener to the country input
countryInput.addEventListener("input", async function (e) {
  e.preventDefault();

  if (!nationalities) {
    const Countries = await fetchCountries();
    nationalities = Countries.map((country) => ({
      label: `${country.flag} ${country.name.common}`,
      value: country.name.common,
    }));
  }

  search.apply(this, [countryList, countryInput, nationalities, "flag"]);
});

// Add an event listener to the city input
cityInput.addEventListener("input", function () {
  search.apply(this, [cityList, cityInput, destinations_data]);
});

////// Submit the form
document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const destination = document.getElementById("destination").value;
    const checkIn = document.getElementById("check-in-date").value;
    const checkOut = document.getElementById("check-out-date").value;
    const nights = parseInt(document.getElementById("nights").value);
    const currency = document.getElementById("currency").value;
    const city = document.getElementById("city").value;
    let country = document.getElementById("country").value;
    let nationality = document.getElementById("nationality").value;

    // remove the flag
    nationality = nationality.substring(nationality.indexOf(" ") + 1);
    country = country.substring(country.indexOf(" ") + 1);

    const data = {
      destination,
      checkIn,
      checkOut,
      nights,
      nationality,
      currency,
      country,
      city,
    };

    console.table(data);

    alert("Check the console to see the data");
  });
