
let currentUnit = "metric"; 

const unitBtn = document.querySelector("#unit-toggle");

unitBtn.addEventListener("click", () => {
    if (currentUnit === "metric") {
        currentUnit = "imperial";
        unitBtn.innerHTML = "Units: °F";
    } else {
        currentUnit = "metric";
        unitBtn.innerHTML = "Units: °C";
    }
    checkWeather(cityInput.value || "Ahmedabad");
});

const apiKey = "a4ed9d53d263d69fa10b95c5903ef904";
const searchBtn = document.querySelector("#search-btn");
const cityInput = document.querySelector("#city-input");

async function checkWeather(city) {
    if (!city) return alert("Please enter a city name!");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status == 404) {
            alert("City not found! Please check the name and try again.!");
        } else {
            console.log(data);


            document.querySelector("#cityname").innerHTML = data.name + ", " + data.sys.country;
            document.querySelector("#maintemp").innerHTML = Math.round(data.main.temp) + "°";


            document.querySelector("#feels-like").innerHTML = Math.round(data.main.feels_like) + "°";
            document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
            document.querySelector("#wind-speed").innerHTML = data.wind.speed + " km/h";

            const rain = data.rain ? data.rain["1h"] : 0;
            document.querySelector("#precip").innerHTML = rain + " mm";

            const d = new Date();
            document.querySelector("#date").innerHTML = d.toDateString();

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

            const forecastRes = await fetch(forecastUrl);
            const forecastData = await forecastRes.json();

            const dailyRow = document.querySelector("#daily-row");
            dailyRow.innerHTML = "";

            for (let i = 0; i < forecastData.list.length; i += 8) {
                const dayData = forecastData.list[i];
                const date = new Date(dayData.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                const card = `
        <div class="day-card">
            <span>${dayName}</span>
            <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="weather">
            <p class="temp-high">${Math.round(dayData.main.temp_max)}°</p>
            <p class="temp-low">${Math.round(dayData.main.temp_min)}°</p>
        </div>
    `;
                dailyRow.innerHTML += card;
            }
            const hourlyList = document.querySelector("#hourly-list");
            hourlyList.innerHTML = "";

            for (let i = 0; i < 5; i++) {
                const hourData = forecastData.list[i];
                const time = new Date(hourData.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

                const item = `
        <div class="hourly-item">
            <span>${time}</span>
            <img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" width="30px">
            <span>${Math.round(hourData.main.temp)}°</span>
        </div>
    `;
                hourlyList.innerHTML += item;
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
searchBtn.addEventListener("click", () => {
    checkWeather(cityInput.value);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(cityInput.value);
    }
});
checkWeather("Ahmedabad");