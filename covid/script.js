const API_URL = "https://pomber.github.io/covid19/timeseries.json";
const MAX_COUNTRIES = 5;

let country = null;
let lineChart = null;
let pieChart = null;
let chartData = null;

function getData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      chartData = data;
      populateCountrySelector();
      createLineChart();
      createPieChart();
    });
}

function createLineChart() {
  let ctx = document.getElementById("covidLineChart");
  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...chartData[country].map(data => data.date)],
      datasets: [
        {
          label: `${country}: Confirmed`,
          data: [...chartData[country].map(data => data.confirmed)],
          borderColor: ["lightblue"],
          backgroundColor: "transparent"
        },
        {
          label: `${country}: Deaths`,
          data: [...chartData[country].map(data => data.deaths)],
          borderColor: ["salmon"],
          backgroundColor: "transparent"
        },
        {
          label: `${country}: Recovered`,
          data: [...chartData[country].map(data => data.recovered)],
          borderColor: ["lightgreen"],
          backgroundColor: "transparent"
        }
      ]
    },
    options: {
      backgroundColor: "transparent"
    }
  });
}

function createPieChart() {
  let ctx = document.getElementById("covidPieChart");
  let latestDataByCountry = Object.keys(chartData).map(country => {
    return {
      country: country,
      ...chartData[country][chartData[country].length - 1]
    };
  });
  latestDataByCountry.sort(sortByConfirmed);

  let labels = latestDataByCountry
    .map(country => country.country)
    .slice(0, MAX_COUNTRIES);
  let dataSet = latestDataByCountry
    .map(country => country.confirmed)
    .slice(0, MAX_COUNTRIES);

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [...labels],
      datasets: [
        {
          label: "# of confirmed cases",
          data: [...dataSet],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)"
          ],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1
        }
      ]
    },
    options: {}
  });
}

function sortByConfirmed(a, b) {
  if (a.confirmed === b.confirmed) {
    return 0;
  }
  if (a.confirmed < b.confirmed) {
    return 1;
  } else {
    return -1;
  }
}

function populateCountrySelector() {
  let countrySelector = document.querySelector("#country-selector");
  countrySelector.addEventListener("change", onCountryChange);
  let countries = Object.keys(chartData).sort();
  onCountryChange({
    target: {
      value: countries[0]
    }
  });
  countries.forEach(country => {
    countrySelector.innerHTML += `
        <option value="${country}">${country}</option>
        `;
  });
}

function onCountryChange(event) {
  country = event.target.value;
  if (lineChart) {
    lineChart.destroy();
    createLineChart();
  }
}

getData();