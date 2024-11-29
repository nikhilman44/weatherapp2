import React, {Component} from 'react'
import SearchBar from './Components/SearchBar'
import {ThreeDots} from 'react-loader-spinner'
import CurrentWeather from './Components/CurrentWeather'
import './App.css'

class App extends Component {
  state = {
    currentWeather: null,
    error: '',
    unit: 'metric',
    favoriteCountriesList: [],
    isLoading: false,
  }

  componentDidMount() {
    const storedCountries = localStorage.getItem('favouriteCountries')

    if (storedCountries) {
      // Safely parse if there is valid data
      this.setState({favoriteCountriesList: JSON.parse(storedCountries)})
    } else {
      // No data found, keep the state as an empty array (default)
      this.setState({favoriteCountriesList: []})
    }
  }

  handleSearch = async city => {
    const {unit} = this.state
    this.setState({isLoading: true})
    const apiKey = 'bac0e780fc724fdc8ed63715242911'
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        // console.log(data)
        const result = {
          location: data.location.name,
          temperature:
            unit === 'metric'
              ? `${data.current.temp_c} °C`
              : `${data.current.temp_f} °F`,
          humidity: data.current.humidity,
          windSpeed:
            unit === 'metric'
              ? `${data.current.wind_kph} kph`
              : `${data.current.wind_mph} mph`,
          conditionIconUrl: data.current.condition.icon,
          conditionText: data.current.condition.text,
        }
        this.setState({currentWeather: result, error: '', isLoading: false})
      } else {
        const errorData = await response.json()
        this.setState({error: errorData.error.message, isLoading: false})
      }
    } catch (err) {
      this.setState({
        error: 'An error occurred while fetching the weather data.',
      })
      // Log the error for debugging purposes
      console.error('Error fetching weather data:', err)
    }
  }

  handleUnitToggle = async () => {
    const {unit, currentWeather} = this.state
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    try {
      if (currentWeather) {
        this.setState({unit: newUnit}, () =>
          this.handleSearch(currentWeather.location),
        )
      } else {
        this.setState({error: 'There is no data to switch units.'})
      }
    } catch (e) {
      this.setState({error: 'Error updating units. Please try again.'})
    }
  }

  handleSaveFavorite = city => {
    const {favoriteCountriesList} = this.state
    if (!favoriteCountriesList.includes(city)) {
      const updatedFavoriteCountriesList = [...favoriteCountriesList, city]
      this.setState(
        {favoriteCountriesList: updatedFavoriteCountriesList},
        () => {
          localStorage.setItem(
            'favoriteCountries',
            JSON.stringify(updatedFavoriteCountriesList),
          )
        },
      )
    }
  }

  handleFavoriteClick = city => {
    this.handleSearch(city)
  }

  render() {
    const {currentWeather, error, favoriteCountriesList, unit, isLoading} =
      this.state

    return (
      <div className="app">
        <h1>Weather Dashboard</h1>
        <SearchBar handleSearch={this.handleSearch} />
        {isLoading ? (
          <div className="loader-container">
            <ThreeDots
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
            />
          </div>
        ) : (
          <>
            <button className="unit-toggle" onClick={this.handleUnitToggle}>
              {unit === 'metric' ? 'Switch to imperical' : 'Switch to metric'}
            </button>
            {favoriteCountriesList.length > 0 ? (
              <div className="favorite-section">
                <h2>Favorite Countries</h2>
                <ul className="unord-list">
                  {favoriteCountriesList.map(city => (
                    <li
                      className="list-item"
                      onClick={() => this.handleFavoriteClick(city)}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error && <p className="error">{error}</p>}
            {currentWeather && (
              <div>
                <CurrentWeather data={currentWeather} unit={unit} />
                <button
                  className="save-favorite"
                  onClick={() =>
                    this.handleSaveFavorite(currentWeather.location)
                  }
                >
                  Save to Favorites
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
}

export default App
