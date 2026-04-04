let current = document.querySelector('.current')
let errorMsg = document.getElementById('errorMsg')

let cityInput = document.getElementById('cityInput')
let searchBtn = document.getElementById('searchBtn')

const apiKey = 'a6f84398a3f19c6c103d223707fffdcc'

async function getWeather() {
    let city = cityInput.value.trim()
    if (!city) {
        errorMsg.textContent = 'Please enter a city name.'
        current.innerHTML = ''
        return
    }
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        let data = await res.json()
        if (data.cod !== 200) {
            errorMsg.textContent = 'City not found. Please try again.'
            current.innerHTML = ''
            return
        }
        errorMsg.textContent = ''
        current.innerHTML = `
        <h2>${data.name}</h2>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Condition:</strong> ${data.weather[0].main}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            <h3>5-Day Forecast:</h3>
            <div id="forecast" class="forecast"></div>
            `
            let forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        let forecastData = await forecastRes.json()

        let forecastDiv = document.getElementById('forecast')
        forecastDiv.innerHTML = ''

        let dailyData = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));

        dailyData.forEach(day => {
            let date = new Date(day.dt_txt).toDateString();
            forecastDiv.innerHTML += `
                <div class="forecast-day">
                    <p><strong>${date}</strong></p>
                    <p>🌡️ Temp: ${day.main.temp}°C</p>
                    <p>☁️ ${day.weather[0].main}</p>
                    <p>💧 Humidity: ${day.main.humidity}%</p>
                </div>
            `
        })

        console.log(forecastData)
    } catch (error) {
        console.log(error)
        errorMsg.textContent = 'Something went wrong. Try again later.'
        current.innerHTML = ''
    }
}

searchBtn.addEventListener('click', getWeather)