import React from 'react';
import Kilt from '@kiltprotocol/sdk-js'
import './App.css';
import CreateIdentity from "./CreateIdentity"
import store from "store"
import Claimer from "./Claimer"

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      ids: this.getAllIds()
    }

    this.handleRemove = this.handleRemove.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
  }

  handleCreate(event, identity) {
    event.preventDefault()
    try {
      Kilt.Identity.buildFromMnemonic(identity.mnemonic)
      store.set(identity.name, identity)
    } catch (err) {
      alert("Invalid Mnemonic make sure it made up of 12 words")
    }
    this.setState(prevState => {
      return {
        ...prevState,
        ids: this.getAllIds()
      }
    })
  }

  handleRemove(key) {
    store.remove(key)
    this.setState(prevState => {
      return {
        ...prevState,
        ids: this.getAllIds()
      }
    })
  }

  getAllIds() {
    var listOfIds = []
    store.each((value, key) => {
      listOfIds.push(value)
    })
    return listOfIds
  }
  render() {
    const ids = this.state.ids.map(value => <Claimer key={value.name} id={value} handleRemove={this.handleRemove} />)
    return (
      <div className="container">
        <div className="row ">
          <div className="col-xl-6 m-md">
            <CreateIdentity handleSubmit={this.handleCreate} />
            {ids}
          </div>
          <div className="col-xl-6 m-md">
            
          </div>
        </div>
      </div>
    );
  }

}

export default App;
