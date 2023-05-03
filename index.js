import $ from "./jquery.module.js";

// Get the input and list elements
const destinationInput = $("#destination");
const nationalityInput = $("#nationality");
const countryInput = $("#country");
const cityInput = $("#city");
const checkInInput = $("#check-in-date");
const checkOutInput = $("#check-out-date");
const nightsInput = $("#nights");
const countryList = $("#country-list");
const cityList = $("#city-list");
const destinationList = $("#destination-list");
const nationalityList = $("#nationality-list");

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
    $(element).show();
  }

  function hideListBody() {
    $(element).hide();
  }

  var value = input.val();
  element.html("");
  let hasMatch = false;
  if (value.length > 0) {
    data.forEach(function ({ label, value: item_value }) {
      if (!item_value) return;
      if (item_value.toLowerCase().indexOf(value.toLowerCase()) === 0) {
        var li = $("<li>").html(label);
        li.on("click", function () {
          if (type !== "destination") input.val(label);
          else input.val(item_value);
          // $(element).html("");
          hideListBody();
        });
        element.append(li);
        hasMatch = true;
      }
    });
    hasMatch ? showListBody() : hideListBody();
  } else hideListBody();
}

// function to disable dates before today in the check-in and check-out
function disableDatesBeforeToday() {
  const today = new Date().toISOString().slice(0, 10);
  $(checkInInput).attr("min", today);
  $(checkOutInput).attr("min", today);
}

// function to disable dates before the check-in date in the check-out
function disableDatesBeforeCheckIn() {
  $(checkOutInput).attr("min", $(checkInInput).val());
}

function calculateNights(event) {
  const checkInDate = !$(checkInInput).val()
    ? new Date()
    : new Date($(checkInInput).val());
  const checkOutDate = !$(checkOutInput).val()
    ? new Date(checkInDate.getTime() + 1000 * 60 * 60 * 24)
    : new Date($(checkOutInput).val());
  const currentNight = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
  let nights = Math.max(currentNight, 1);
  // if the event is "night", update the nights to match the value of the input
  if (event === "night") {
    nights = $(nightsInput).val();
  }
  // update the value of the nights input
  $(nightsInput).val(nights);
  // update check-out value based on nights
  if (nights > 0) {
    const newCheckOutDate = new Date(
      checkInDate.getTime() + nights * (1000 * 60 * 60 * 24)
    );
    $(checkOutInput).val(newCheckOutDate.toISOString().slice(0, 10));
    $(checkInInput).val(checkInDate.toISOString().slice(0, 10));
  }
}

// Call the functions to disable dates before today
disableDatesBeforeToday();

// Add event listeners to check-in inputs
$(checkInInput).on("input", function () {
  calculateNights();
  disableDatesBeforeCheckIn();
});

// Add event listeners to check-out inputs
$(checkOutInput).on("input", function () {
  calculateNights();
});

// Add event listeners to nights input
$(nightsInput).on("input", function () {
  calculateNights("night");
});

//////////////////////////// AutoComplete ////////////////////////////
var has_fetched_countries = false;
var nationalities = [];
var countries = [];
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    has_fetched_countries = true;
    countries = data.map((country) => ({
      label: `${country.flag} ${country.name.common}`,
      value: country.name.common,
    }));
    nationalities = data.map((country) => ({
      label: `${country.flag} ${country.demonyms?.eng.m}`,
      value: country.demonyms?.eng.m,
    }));
  } catch (error) {
    console.error(error);
  }
}

// Hide the list when the user clicks outside of it
$(document).on("click", function (event) {
  const destination_condition =
    event.target !== destinationInput[0] && event.target !== destinationList[0];
  const nationality_condition =
    event.target !== nationalityInput[0] && event.target !== nationalityList[0];

  const country_condition =
    event.target !== countryInput[0] && event.target !== countryList[0];

  const city_condition =
    event.target !== cityInput[0] && event.target !== cityList[0];

  if (destination_condition) $(destinationList).hide();

  if (nationality_condition) $(nationalityList).hide();

  if (country_condition) $(countryList).hide();

  if (city_condition) $(cityList).hide();
});

// Add an event listener to destination input
$(destinationInput).on("input", function () {
  search.apply(this, [destinationList, destinationInput, destinations_data]);
});

// Add an event listener to the nationality input
$(nationalityInput).on("input", async function (e) {
  e.preventDefault();

  if (!has_fetched_countries) {
    await fetchCountries();
  }

  search.apply(this, [
    nationalityList,
    nationalityInput,
    nationalities,
    "flag",
  ]);
});

// Add an event listener to the country input
$(countryInput).on("input", async function (e) {
  e.preventDefault();
  if (!has_fetched_countries) {
    await fetchCountries();
  }

  search.apply(this, [countryList, countryInput, countries, "flag"]);
});

// Add an event listener to the city input
$(cityInput).on("input", function () {
  search.apply(this, [cityList, cityInput, destinations_data]);
});
// Submit the form
const form = $("#search-form");

$(form).on("submit", function (event) {
  event.preventDefault();

  const destination = $("#destination").val();
  const checkIn = $("#check-in-date").val();
  const checkOut = $("#check-out-date").val();
  const nights = parseInt($("#nights").val());
  const currency = $("#currency").val();
  const city = $("#city").val();
  let country = $("#country").val();
  let nationality = $("#nationality").val();

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
