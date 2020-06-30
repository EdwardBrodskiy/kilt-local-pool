import React from "react"
import Kilt from '@kiltprotocol/sdk-js'

class CreateIdentity extends React.Component {
    constructor(){
        super()
        this.state = {
            name:"Alice",
            mnemonic: Kilt.Identity.generateMnemonic()
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleRandomise = this.handleRandomise.bind(this)
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

    handleRandomise() {
        document.getElementById("Mnemonic").value = Kilt.Identity.generateMnemonic()
    }
    

    render(){
        
        return (
            <form onSubmit={(event) => this.props.handleSubmit(event, this.state)}>
                <h4>Name</h4>
                <input id="Name" type="text" value={this.state.name} onChange={this.handleChange}/>
                <h4>Seed</h4>
                <textarea id="Mnemonic" cols={this.state.mnemonic.length + 2} 
                rows="1" onChange={this.handleChange} value={this.state.mnemonic} />

                <input type="button" value="Generate Random Seed" onClick={this.handleRandomise} />
                <hr />
                <input type="submit" />

            </form>
        )
    }
}

export default CreateIdentity