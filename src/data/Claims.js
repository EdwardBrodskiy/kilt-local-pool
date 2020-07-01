import React from 'react';
import Kilt from '@kiltprotocol/sdk-js'
import store from "store"
import CreateClaim from "./CreateClaim"
import Claim from "./Claim"


class Claims extends React.Component {
    constructor() {
        super()
        
        this.checkLocalData()

        this.state = {
            claims: store.get("claims")
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }

    checkLocalData() {
        var claims = store.get("claims")
        if (claims == null) {
            store.set("claims", [])
        }
    }

    handleCreate(event, data) {
        event.preventDefault()

        const ctype = require('./ctype.json')

        const userMnemonic = store.get("ids")[this.props.selected].mnemonic

        console.log(data)

        const claimer = Kilt.Identity.buildFromMnemonic(userMnemonic)

        const claim = Kilt.Claim.fromCTypeAndClaimContents(
            ctype,
            data,
            claimer.address,
            null
        );

        const requestForAttestation = Kilt.RequestForAttestation.fromClaimAndIdentity(
            claim,
            claimer,
            []
        );

        var claims = store.get("claims")
        
        claims.push(requestForAttestation)

        store.set("claims", claims)

        this.setState(prevState => {
            return {
                ...prevState,
                claims: store.get("claims")
            }
        })
    }

    handleRemove(key) {
        var claims = store.get("claims")
        claims.splice(key, 1)
        store.set("claims", claims)
        this.setState(prevState => {
            return {
                ...prevState,
                claims: store.get("claims")
            }
        })
    }


    render() {
        console.log(this.state.claims)
        const claims = this.state.claims.map((value, index) => <Claim key={index} index={index} 
        item={value} handleRemove={this.handleRemove} handleSelect={() => this.props.changeSelected(index)}
        selected={this.props.selected === index}/>)
        return (
            <div>
                <CreateClaim handleSubmit={this.handleCreate}/>
                {claims}
            </div>
        );
    }

}

export default Claims;
