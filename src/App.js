import React from 'react';
import './App.css';
import Claims from "./data/Claims"
import Users from "./ids/Users"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedClaimer: 0
    }

    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected(key) {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedClaimer: key
      }
    })
  }

  render() {

    return (
      <div className="container">
        <div className="row ">
          <div className="col-xl-6 m-md">
            <Users selected={this.state.selectedClaimer} changeSelected={this.changeSelected} storageLocation="ids" />
          </div>
          <div className="col-xl-6 m-md">
            <Claims selected={this.state.selectedClaimer} />
          </div>
        </div>
      </div>
    );
  }

}

export default App;
