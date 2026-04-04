import React, { useState } from "react";

const WeatherSearch = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) return alert("Please enter a city name.");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a6f84398a3f19c6c103d223707fffdcc&units=metric`
      );
      const data = await res.json();

      if (data.cod === "404") {
        alert("City not found. Please try again.");
        return;
      }

      setWeather(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;
