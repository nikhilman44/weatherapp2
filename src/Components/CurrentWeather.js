import React from 'react'

const CurrentWeather = prop => {
  const {data} = prop
  const {
    location,
    temperature,
    humidity,
    windSpeed,
    conditionIconUrl,
    conditionText,
  } = data
  console.log(temperature)
  return (
    <div className="weather-card">
      <h2>{location}</h2>
      <p className="temperature">{temperature}</p>
      <p>Humidity: {humidity}%</p>
      <p>Wind Speed: {windSpeed}</p>
      <p>Condition: {conditionText}</p>
      <img src={conditionIconUrl} alt="weather icon" />
    </div>
  )
}

export default CurrentWeather
