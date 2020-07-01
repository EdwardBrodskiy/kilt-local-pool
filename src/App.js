import React from 'react';
import './App.css';
import Claims from "./data/Claims"
import Identeties from "./ids/Identeties"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedClaimer: 0,
      selectedAttester: 0
    }

    this.storage = {
      users: "user-ids",
      claims: "claims",
      attesters: "atterster-ids"
    }

    this.changeSelectedClaimer = this.changeSelectedClaimer.bind(this)
    this.changeSelectedAttester = this.changeSelectedAttester.bind(this)
  }

  changeSelectedClaimer(key) {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedClaimer: key
      }
    })
  }

  changeSelectedAttester(key) {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedAttester: key
      }
    })
  }

  render() {

    return (
      <div className="container-fluid">
        <div className="row ">
          <div className="col-xl-4 m-md">
            <Identeties id="Claimers" selected={this.state.selectedClaimer} 
            changeSelected={this.changeSelectedClaimer} storageLocation={this.storage.users} />
          </div>
          <div className="col-xl-4 m-md">
            <Claims selected={this.state} storage={this.storage} />
          </div>
          <div className="col-xl-4 m-md">
            <Identeties id="Attesters" selected={this.state.selectedAttester} 
            changeSelected={this.changeSelectedAttester} storageLocation={this.storage.attesters} />
          </div>
        </div>
      </div>
    );
  }

}

export default App;
