import React from "react"
import store from "store"
import Kilt from '@kiltprotocol/sdk-js'

class CreateIdentity extends React.Component {
    constructor(){
        super()
        this.state = {
            name:"Alice",
            mnemonic: Kilt.Identity.generateMnemonic()
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState(prevState => {
            return{
            ...prevState,
            name: document.getElementById("Name").value,
            mnemonic: document.getElementById("Mnemonic").value
            }
        })
        
    }

    handleSubmit(event) {
        event.preventDefault()
        try{
            Kilt.Identity.buildFromMnemonic(this.state.mnemonic)
            store.set(this.state.name, this.state)
        }catch(err){
            alert("Invalid Mnemonic make sure it made up of 12 words")
        }
        store.each(function(value, key) {
            console.log(key, '==', value)
        })
        
    }

    render(){
        
        return (
            <form onSubmit={this.handleSubmit}>
                <h4>Name</h4>
                <input id="Name" type="text" value={this.state.name} onChange={this.handleChange}/>
                <h4>Seed</h4>
                <textarea id="Mnemonic" cols={this.state.mnemonic.length + 2} 
                rows="1" onChange={this.handleChange} value={this.state.mnemonic} />
                <hr />
                <input type="submit" />

            </form>
        )
    }
}

export default CreateIdentity