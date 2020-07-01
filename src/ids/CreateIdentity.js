import React from "react"
import Kilt from '@kiltprotocol/sdk-js'

class CreateIdentity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name:"Alice",
            mnemonic: Kilt.Identity.generateMnemonic()
        }
        this.uniqueIds = {
            name: this.props.id + "-name",
            mnemonic: this.props.id + "-mnemonic"
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRandomise = this.handleRandomise.bind(this)
    }

    handleChange(event) {
        this.setState(prevState => {
            return{
            ...prevState,
            name: document.getElementById(this.uniqueIds.name).value,
            mnemonic: document.getElementById(this.uniqueIds.mnemonic).value
            }
        })
        
    }

    handleRandomise() {
        this.setState(prevState => {
            return{
            ...prevState,
            mnemonic:  Kilt.Identity.generateMnemonic()
            }
        })
        
    }
    

    render(){
        
        return (
            <form className="form-group" onSubmit={(event) => this.props.handleSubmit(event, this.state)}>
                <h4>Name</h4>
                <input id={this.uniqueIds.name} type="text" value={this.state.name} onChange={this.handleChange}/>
                <h4>Seed</h4>
                <textarea id={this.uniqueIds.mnemonic} cols={this.state.mnemonic.length + 2} 
                rows="1" onChange={this.handleChange} value={this.state.mnemonic} />

                <input className="btn btn-outline-secondary" type="button" value="Generate Random Seed" onClick={this.handleRandomise} />
                
                <input className="btn btn-outline-primary" type="submit" />

            </form>
        )
    }
}

export default CreateIdentity