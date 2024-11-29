import React, {useState, Component} from 'react'

class SearchBar extends Component {
  state = {
    city: '',
  }

  onChangeCity = e => {
    this.setState({city: e.target.value})
  }

  onClickSearch = () => {
    const {handleSearch} = this.props
    const {city} = this.state
    if (city.trim() !== '') {
      handleSearch(city)
    }
  }

  render() {
    const {city} = this.state
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={this.onChangeCity}
        />
        <button onClick={this.onClickSearch}>Search</button>
      </div>
    )
  }
}

export default SearchBar
