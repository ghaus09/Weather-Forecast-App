async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "8d7b374039123e39a652aca7ba9a9a76";
  const weatherDiv = document.getElementById("weatherResult");

  if (!city) {
    weatherDiv.innerHTML = `<p>❗ Please enter a city name.</p>`;
    return;
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    const name = currentData.name;
    const temp = currentData.main.temp;
    const condition = currentData.weather[0].description;
    const icon = currentData.weather[0].icon;
    const mainCondition = currentData.weather[0].main.toLowerCase();

    let forecastHTML = "<h3>5-Day Forecast:</h3><div class='forecast'>";
    const daily = {};

    // Extract 5-day forecast (every 12:00pm)
    forecastData.list.forEach(item => {
      if (item.dt_txt.includes("12:00:00")) {
        const date = new Date(item.dt_txt).toDateString();
        if (!daily[date]) {
          daily[date] = item;
          const fIcon = item.weather[0].icon;
          const fTemp = item.main.temp;
          const fDesc = item.weather[0].description;
          forecastHTML += `
            <div class="day">
              <p>${date.split(" ").slice(0, 3).join(" ")}</p>
              <img src="https://openweathermap.org/img/wn/${fIcon}@2x.png" alt="${fDesc}" />
              <p>${fTemp}°C</p>
              <p>${fDesc}</p>
            </div>
          `;
        }
      }
    });
    forecastHTML += "</div>";

    weatherDiv.innerHTML = `
      <h2>${name}</h2>
      <p>🌡️ Temperature: ${temp} °C</p>
      <p>🌤️ Condition: ${condition}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}" />
      ${forecastHTML}
    `;

    const body = document.body;
    if (mainCondition.includes("clear")) {
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')";
    } else if (mainCondition.includes("cloud")) {
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1950&q=80')";
    } else if (mainCondition.includes("rain")) {
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1950&q=80')";
    } else if (mainCondition.includes("snow")) {
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1608889170575-dc4e4b19d5a9?auto=format&fit=crop&w=1950&q=80')";
    } else {
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1950&q=80')";
    }

  } catch (error) {
    weatherDiv.innerHTML = `<p>❌ ${error.message}</p>`;
  }
}
