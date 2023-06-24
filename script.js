const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const weatherContainer=document.querySelector(".weather-container")
const grantLocationContainer=document.querySelector(".grant-location-container")
const grantLocationBtn=document.querySelector("[data-grantAccess]")
const formContainer=document.querySelector(".form-container")
const searchCity=document.querySelector("[data-searchCity]")
const loadingContainer=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container")
const cityName=document.querySelector("[data-cityName]")
const countryIcon=document.querySelector("[data-countryIcon]")
const weatherDescription=document.querySelector("[data-weatherDescription]")
const weatherDescriptionImage=document.querySelector("[data-weatherDescriptionImage]")
const temperature=document.querySelector("[data-temperature]")
const parameterContainer=document.querySelector("[parameter-container]")
const windspeed=document.querySelector("[data-windspeed]")
const humidity=document.querySelector("[data-humidity]")
const cloudy=document.querySelector("[data-cloudy]")

// Initial Variables

const API_KEY="dd147190aa295c67a1a620e22bfd22bd"
let currentTab=userTab
currentTab.classList.add("current-tab")



userTab.addEventListener("click",() => {

    switchTab(userTab);
})

searchTab.addEventListener("click",() => {

    // pass clicked tab as an input
    switchTab(searchTab);
})

function switchTab(clickedTab){
 
    if(clickedTab!==currentTab){
        currentTab.classList.remove("current-tab")
        currentTab=clickedTab;
        currentTab.classList.add("current-tab")

        if(!formContainer.classList.contains('active')){
            // if form Container is invisible then make it visible
            grantLocationContainer.classList.remove('active')
            userInfoContainer.classList.remove('active')
            formContainer.classList.add('active');
        }
        else{
            // previously I'm in search tab and now i switch to user tab
            formContainer.classList.remove('active')
            grantLocationContainer.classList.add('active')
            userInfoContainer.classList.remove('active')

            // now I'm in (user weather) tab then i have to display my weather .so let's check local storage first for coordinates if i have saved them here
            getFromSessionStorage();
        }
    }

}


