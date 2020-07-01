import React from "react"
import Kilt from '@kiltprotocol/sdk-js'

class Identety extends React.Component { 
    constructor(){
        super()

        this.state = {
            requestedTokens: false
        }

        this.handleTokenRequest = this.handleTokenRequest.bind(this)
    }


    handleTokenRequest(){
        this.setState(prevState => {
            return {
                ...prevState,
                requestedTokens: true
            }
        })
        
        window.open("https://faucet.kilt.io/?" + Kilt.Identity.buildFromMnemonic(this.props.item.mnemonic).address)
    }

    render(){

        return(
        <div className="media content-section ">
            <div className="media-body">
                <h2 className="mt-0">
                    {this.props.item.name}  {this.props.selected && <span className="badge badge-success ">Selected</span>}
                </h2>
                <p>{this.props.item.mnemonic}</p>
                
                {this.props.selected && <p>{Kilt.Identity.buildFromMnemonic(this.props.item.mnemonic).address}</p>}
                
                
            </div>
           
            <form className="float-right">
                {!this.props.selected && <input className="btn btn-outline-secondary" type="button" value="Select" 
                onClick={this.props.handleSelect}/>}

                {!this.state.requestedTokens && <input className="btn btn-outline-primary" type="button" value="Request Tokens" 
                onClick={this.handleTokenRequest}/>}

                <input className="btn btn-outline-danger" type="button" value="Remove" 
                onClick={() => this.props.handleRemove(this.props.index)}/>
                
            
            </form>
            
        </div>
        )
    }
}

export default Identety