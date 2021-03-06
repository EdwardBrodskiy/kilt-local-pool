import React from "react"
import Kilt from '@kiltprotocol/sdk-js'

class Identety extends React.Component {
    constructor() {
        super()

        this.state = {
            requestedTokens: false
        }

        this.handleTokenRequest = this.handleTokenRequest.bind(this)
    }


    handleTokenRequest() { // send to Faucet page to get tokens
        this.setState(prevState => {
            return {
                ...prevState,
                requestedTokens: true
            }
        })

        window.open("https://faucet.kilt.io/?" + Kilt.Identity.buildFromMnemonic(this.props.item.mnemonic).address)
    }

    render() {

        return (
            <div className="media content-section ">
                <div className="media-body">

                    <form className="float-right btn-group">
                        {!this.props.selected && <input className="btn btn-outline-secondary" type="button" value="Select"
                            onClick={this.props.handleSelect} />}

                        {!this.state.requestedTokens && <input className="btn btn-outline-primary" type="button" value="Request Tokens"
                            onClick={this.handleTokenRequest} />}

                        {(this.props.did && !this.props.item.did) &&
                            <input className="btn btn-outline-info" type="button" value="Create DID"
                                onClick={this.props.handleCreateDid} />}

                        {(this.props.item.did) &&
                            <input className="btn btn-outline-danger" type="button" value="Remove DID"
                                onClick={this.props.handleRemoveDid} />}

                        <input className="btn btn-outline-danger" type="button" value="Remove"
                            onClick={this.props.handleRemove} />
                    </form>

                    <h2 className="mt-0">
                        {this.props.item.name}  {this.props.selected && <span className="badge badge-success ">Selected</span>}
                    </h2>
                    <ul className="list-group">
                        <li className="list-group-item"><b>Mnemonic - </b>{this.props.item.mnemonic}</li>

                        {this.props.selected && <li className="list-group-item">
                            <b>Address - </b>{Kilt.Identity.buildFromMnemonic(this.props.item.mnemonic).address}
                        </li>}

                        {(this.props.item.did && this.props.selected) &&
                            <li className="list-group-item">
                                <b>DID - </b><pre ><small>{JSON.stringify(this.props.item.did, null, 2)}</small></pre>
                            </li>}
                    </ul>

                </div>



            </div>
        )
    }
}

export default Identety