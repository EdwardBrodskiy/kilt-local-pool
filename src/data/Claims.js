import React from 'react';
import Kilt from '@kiltprotocol/sdk-js'
import store from "store"
import CreateClaim from "./CreateClaim"
import Claim from "./Claim"


class Claims extends React.Component {
    constructor(props) {
        super(props)

        this.checkLocalData()
        
        this.state = {
            claims: store.get(this.props.storage.claims)
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleAttest = this.handleAttest.bind(this)
    }

    checkLocalData() {
        var claims = store.get(this.props.storage.claims)
        if (claims == null) {
            store.set(this.props.storage.claims, [])
        }
    }

    handleCreate(event, data) {
        event.preventDefault()

        const ctype = require('./ctype.json')

        const userMnemonic = store.get(this.props.storage.users)[this.props.selected.selectedClaimer].mnemonic

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

        var claims = store.get(this.props.storage.claims)

        claims.push(requestForAttestation)

        store.set(this.props.storage.claims, claims)

        this.setState(prevState => {
            return {
                ...prevState,
                claims: store.get(this.props.storage.claims)
            }
        })
    }

    handleRemove(key) {
        var claims = store.get(this.props.storage.claims)
        claims.splice(key, 1)
        store.set(this.props.storage.claims, claims)
        this.setState(prevState => {
            return {
                ...prevState,
                claims: store.get(this.props.storage.claims)
            }
        })
    }

    handleAttest(index, data) {
        const attesterMnemonic = store.get(this.props.storage.attesters)[this.props.selected.selectedAttester].mnemonic

        // console.log(attesterMnemonic)

        const attester = Kilt.Identity.buildFromMnemonic(attesterMnemonic)

        const requestForAttestation = Kilt.RequestForAttestation.fromRequest(
            data
        );

        // Validate
        if (!requestForAttestation.verifyData()) {
            alert("Invalid Data")
            return
        }
        if (!requestForAttestation.verifySignature()) {
            alert("Invalid Signature")
            return
        }

        // build the Attestation object
        const attestation = Kilt.Attestation.fromRequestAndPublicIdentity(
            requestForAttestation,
            attester.getPublicIdentity()
        );

        // connect to the chain (this is one KILT test node)
        
        Kilt.connect('wss://full-nodes.kilt.io:9944')

        // store the attestation on chain
        attestation.store(attester).then(data => {
            console.log('attestation: ', attestation)
        }).then(() => {
            // the attestation was successfully stored on the chain, so you can now create the AttestedClaim object
            const attestedClaim = Kilt.AttestedClaim.fromRequestAndAttestation(
                requestForAttestation,
                attestation
            );
            var claims = store.get(this.props.storage.claims)
            claims[index] = attestedClaim
            store.set(this.props.storage.claims, claims)
            this.setState(prevState => {
                return {
                    ...prevState,
                    claims: store.get(this.props.storage.claims)
                }
            })

        }).catch(e => {
            alert(e)
        }).finally(() => {
            Kilt.disconnect()
        })

    }

    render() {
        console.log(this.state.claims)
        const claims = this.state.claims.map((claim, index) => <Claim key={index} index={index}
            item={claim} handleRemove={this.handleRemove} handleAttest={this.handleAttest}
            selected={this.props.selected === index} />)
        return (
            <div>
                <CreateClaim handleSubmit={this.handleCreate} />
                {claims}
            </div>
        );
    }

}

export default Claims;
