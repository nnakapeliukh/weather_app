import "./styles.css";

async function getBackgroundImage(keywordIn) {
  let keyword = await keywordIn.imgDesc;
  keyword = keyword.toString().replace(" ", "-");
  let data = await fetch(
    `https://source.unsplash.com/featured/?${keyword})`,
    {}
  );
  return data;
}

async function getWeatherData(cityNameIn) {
  let cityName = cityNameIn || "winnipeg";
  let apiKey = "6d0d7e8c0f66bf6b39b6a90035e03654";
  try {
    let rawData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`,
      { mode: "cors" }
    );
    if (rawData.status == 200) {
      let response = await rawData.json();
      return {
        imgDesc: response.weather[0].description,
        iconId:
          "http://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png",
        name: response.name,
        country: response.sys.country,
        temp: response.main.temp,
        feelsLike: response.main.feels_like,
        tempMin: response.main.temp_min,
        tempMax: response.main.temp_max,
        pressure: response.main.pressure,
        humidity: response.main.humidity,
      };
    } else {
      throw "bad";
    }
  } catch (error) {
    console.log("Caught error" + error);
    throw error;
  }
}
createDisplay();

searchCity();
startSearch("Winnipeg");
async function createDisplay() {
  const displayDiv = document.createElement("div");
  document.body.appendChild(displayDiv);
  displayDiv.classList.add("display-div");

  const cityName = document.createElement("h2");
  displayDiv.appendChild(cityName);
  cityName.innerHTML = "City Holder";
  cityName.classList.add("display-text");
  cityName.id = "city-name";

  const mainTempDiv = document.createElement("div");
  mainTempDiv.id = "main-temp";
  displayDiv.appendChild(mainTempDiv);
  const tempText = document.createElement("h1");
  mainTempDiv.appendChild(tempText);
  tempText.innerHTML = "Temp\nHolder";
  tempText.classList.add("display-text");
  tempText.id = "temp-text";

  const weatherIcon = document.createElement("img");
  mainTempDiv.appendChild(weatherIcon);
  weatherIcon.id = "weather-icon";

  const feelsLike = document.createElement("h3");
  displayDiv.appendChild(feelsLike);
  feelsLike.classList.add("display-text");
  feelsLike.id = "feels-like";

  const minMax = document.createElement("h3");
  displayDiv.appendChild(minMax);
  minMax.classList.add("display-text");
  minMax.id = "min-max";

  const pressure = document.createElement("h3");
  displayDiv.appendChild(pressure);
  pressure.classList.add("display-text");
  pressure.id = "pressure";

  const humidity = document.createElement("h3");
  displayDiv.appendChild(humidity);
  humidity.classList.add("display-text");
  humidity.id = "humidity";
}

async function populate(weatherData) {
  let cityName = document.getElementById("city-name");
  let tempText = document.getElementById("temp-text");
  let weatherIcon = document.getElementById("weather-icon");
  let feelsLike = document.getElementById("feels-like");
  let minMax = document.getElementById("min-max");
  let pressure = document.getElementById("pressure");
  let humidity = document.getElementById("humidity");

  cityName.innerHTML =
    (await weatherData.name) + ", " + (await weatherData.country);
  tempText.innerHTML = Math.round(await weatherData.temp) + " ℃";
  weatherIcon.src = await weatherData.iconId;
  feelsLike.innerHTML = `Feels like ${Math.round(
    await weatherData.feelsLike
  )}°`;
  minMax.innerHTML = `Min: ${Math.round(
    await weatherData.tempMin
  )}°   Max: ${Math.round(await weatherData.tempMax)}°`;
  pressure.innerHTML = `Pressure: ${await weatherData.pressure}hPa`;
  humidity.innerHTML = `Humidity: ${await weatherData.humidity}%`;
}

function searchCity() {
  let searchBoxDiv = document.createElement("div");
  document.body.appendChild(searchBoxDiv);
  searchBoxDiv.id = "searchbox-div";

  let searchEntry = document.createElement("input");
  searchEntry.type = "text";
  searchBoxDiv.appendChild(searchEntry);
  searchEntry.id = "search-input";
  searchEntry.placeholder = "City name...";
  searchEntry.addEventListener("keyup", (keyEvent) => {
    if (keyEvent.key === "Enter") {
      if (searchEntry.value) {
        startSearch(searchEntry.value);
      }
    }
  });

  let searchBtn = document.createElement("button");
  searchBoxDiv.appendChild(searchBtn);
  searchBtn.innerHTML = "Go";

  searchBtn.classList.add("apply-colorchange");
  searchBtn.id = "search-button";
  searchBtn.addEventListener("click", () => {
    if (searchEntry.value) {
      startSearch(searchEntry.value);
    }
  });
}

async function startSearch(cityNameIn) {
  let searchBtn = document.getElementById("search-button");
  let searchInput = document.getElementById("search-input");
  try {
    searchInput.classList.remove("button-error");
    searchBtn.classList.add("apply-colorchange");
    let weatherData = await getWeatherData(cityNameIn);

    let imgUrl = await getBackgroundImage(weatherData);
    Promise.all([weatherData, imgUrl]).then((values) => {
      populate(values[0]);
      document.body.style.backgroundImage = `url(${values[1].url}`;
      searchBtn.classList.remove("apply-colorchange");
    });
  } catch {
    searchBtn.classList.remove("apply-colorchange");
    searchInput.classList.add("button-error");
  }
}
