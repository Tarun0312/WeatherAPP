const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const weatherContainer = document.querySelector(".weather-container");
const grantLocationContainer = document.querySelector(
  ".grant-location-container"
);
const grantLocationBtn = document.querySelector("[data-grantAccess]");
const formContainer = document.querySelector(".form-container");
const searchCity = document.querySelector("[data-searchCity]");
const loadingContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector("[data-error]");
const errorText = document.querySelector("[data-notfound]");
// const errorImage=document.querySelector("[data-errorImage]")

// Initial Variables

const API_KEY = "dd147190aa295c67a1a620e22bfd22bd";
let currentTab = userTab;
currentTab.classList.add("current-tab");

// Initially when coordinates availaible already
getFromSessionStorage()



userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // pass clicked tab as an input
  switchTab(searchTab);
});



function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!formContainer.classList.contains("active")) {

      // if form Container is invisible then make it visible
      grantLocationContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      formContainer.classList.add("active");

    } else {


      // previously I'm in search tab and now i switch to user tab
      formContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");

      // now I'm in (user weather) tab then i have to display my weather .so let's check local storage first for coordinates if i have saved them here
      getFromSessionStorage();
    }
  }
}



// Check if coordinates are already present in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  // return JSON string

  if (localCoordinates) {
    // if local coordintes present then use latitude and longitude for API Call

    // convert JSON string into JSON object
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);

    // userInfoContainer.classList.add('active')
  } else {
    grantLocationContainer.classList.add("active");
    // userInfoContainer.classList.remove("active");
  }
}

async function fetchUserWeatherInfo(coordinates) {
  let { lat, lon } = coordinates;

  // make  grantLocationContainer invisible
  grantLocationContainer.classList.remove("active");

  // make loading container visible
  loadingContainer.classList.add("active");

  // API CALL
  try {

      // Hide error classes
      errorContainer.classList.remove("active");
      errorText.innerText = "";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    //    convert response in json format
    const data = await response.json();
    // make loading container invisible
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");

    
    renderWeatherInfo(data);

  } catch (error) {

    console.log("catch")
    // make loading container invisible
    loadingContainer.classList.remove("active");

    userInfoContainer.classList.remove("active")

    /// Make error class visible
    errorContainer.classList.add("active");
    errorText.innerText = "City Not Found";
  }
}

function renderWeatherInfo(weatherInfo) {

  // Firstly,we have to fetch the element

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const weatherDescription = document.querySelector(
    "[data-weatherDescription]"
  );
  const weatherDescriptionImage = document.querySelector(
    "[data-weatherDescriptionImage]"
  );
  const temperature = document.querySelector("[data-temperature]");
  const parameterContainer = document.querySelector("   [parameter-container]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  // fetch values from weatherInfo object and put in UI element
  cityName.innerText =`${weatherInfo?.name}`;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDescription.innerText = `${weatherInfo?.weather?.[0]?.description}`;
  weatherDescriptionImage.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}


grantLocationBtn.addEventListener("click", () => {
  //Fetch the geolocation of user & Save coordinates in session storage

  getGeolocation();
});



function getGeolocation() {
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No geolocation support availaible");
  }
}



function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

  fetchUserWeatherInfo(userCoordinates);
}




//Search City Weather


const searchIcon = document.querySelector("[data-searchIcon]");

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    const cityName = searchCity.value.trim();
    if(cityName == "")
        return
    else
        fetchCityWeatherInfo(cityName);
 
});




async function fetchCityWeatherInfo(city) {
  try {
    // Hide error classes
    errorContainer.classList.remove("active");
    errorText.innerText = "";

    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active")
    grantLocationContainer.classList.remove("active")


    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      
    );

    let data = await response.json();
        console.log("try2",data)
    if(data?.cod==='404')
        throw new Error("error")
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } 
  
  catch (error) {
    console.log("error2")
    loadingContainer.classList.remove("active");

    // Make error class visible
    errorContainer.classList.add("active");
    errorText.innerText = "City Not Found";
  }

}



// Important things to know

// JSON STRing '{"name":Tarun}'
// JSON object {"name":Tarun}

// $
// {} object literal
// Optional Chaining Operator-> that makes easier to safely access nested properties in an JSON object (if property not present then it gives undefined)

// Eg  To get zip value,we use Optional Chaining Operator
// let jsonObj={"name":"alias",
// "address":{
//     "city":"NewYorK",
//     "state":"NewYork",
//     "zip":11001
// }}

// console.log(`${jsonObj?.address?.zip}`)
