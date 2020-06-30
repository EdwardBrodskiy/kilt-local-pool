import React from 'react';
import './App.css';
import CreateIdentity from "./CreateIdentity"
import store from "store"
import Claimer from "./Claimer"

function App() {
  var listOfIds = new Array()
  store.each((value, key) =>{
    listOfIds.push(value)
  })
  console.log(typeof(listOfIds))
  const ids = listOfIds.map(value => <Claimer id={value} />)
  return (
    <div className="App">
      <CreateIdentity />
      {ids}
    </div>
  );
}

export default App;
