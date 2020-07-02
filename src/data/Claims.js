import React from 'react';
import Kilt from '@kiltprotocol/sdk-js'
import store from "store"
import CreateClaim from "./CreateClaim"
import Claim from "./Claim"
import Verifier from "../Verifier"


class Claims extends React.Component {
    constructor(props) {
        super(props)

        this.checkLocalData()
        
        this.state = {
            claims: store.get(this.props.storage.claims)
        }

        this.currentClaimForVerification = 0

        this.handleRemove = this.handleRemove.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleAttest = this.handleAttest.bind(this)
        this.handleValidationRequest = this.handleValidationRequest.bind(this)
        this.handleNonceSigning = this.handleNonceSigning.bind(this)
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

        var userMnemonic = null
        try{
            userMnemonic = store.get(this.props.storage.users)[this.props.selected.selectedClaimer].mnemonic
        }catch{
            alert("No Claimer exists")
            return
        }
        
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
        var attesterMnemonic = null
        try{
            attesterMnemonic = store.get(this.props.storage.attesters)[this.props.selected.selectedAttester].mnemonic
        }catch(e){
            alert("No Attester exist")
            return
        }
       


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
        attestation.store(attester).then(() => {
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

    handleValidationRequest(key) {
        this.currentClaimForVerification = key
        const result = Verifier.sendForVerification(this.handleNonceSigning)
        switch(result){
            case Verifier.SUCCESS:
                alert("Claim Accepted by Verifier")
                break
            case Verifier.CLAIMER_NOT_OWNER:
                alert("Claim does not belong to Claimer")
                break
            case Verifier.CLAIM_INVALID:
                alert("Claim denied by Verifier")
                break
            case Verifier.NOT_ACCEPTED_CLAIM_FORMAT:
                alert("Invalid Claim check if it is attested")
                break
            default:
                alert("Unkown result")
        }
    }

    handleNonceSigning(nonce) {
        const claimerMnemonic = store.get(this.props.storage.users)[this.props.selected.selectedClaimer].mnemonic
        

        const claimer = Kilt.Identity.buildFromMnemonic(claimerMnemonic)
        // sign the nonce as the claimer with your private identity
        const signedNonce = claimer.signStr(nonce)

        // same data as in to the simple "Verification" step
        const attestedClaimStruct = this.state.claims[this.currentClaimForVerification]

        const dataToVerify = {
            signedNonce,
            attestedClaimStruct
        }

        return dataToVerify
    }

    render() {
        const claims = this.state.claims.map((claim, index) => <Claim key={index} index={index}
            item={claim} handleRemove={this.handleRemove} handleAttest={this.handleAttest}
            handleValidationRequest={() => this.handleValidationRequest(index)}
             />)
        return (
            <div>
                <h1>Personal Data</h1>
                <CreateClaim handleSubmit={this.handleCreate} />
                {claims}
            </div>
        );
    }

}

export default Claims;
