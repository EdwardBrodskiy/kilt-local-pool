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

        this.currentClaimForVerification = -1 // the current Claim we are waiting for a sign request on

        this.handleRemove = this.handleRemove.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleAttest = this.handleAttest.bind(this)
        this.handleValidationRequest = this.handleValidationRequest.bind(this)
        this.handleNonceSigning = this.handleNonceSigning.bind(this)
    }

    checkLocalData() { // check the list exists create it if not
        var claims = store.get(this.props.storage.claims)
        if (claims == null) {
            store.set(this.props.storage.claims, [])
        }
    }

    handleCreate(event, data) { // create new Claim
        event.preventDefault()

        const ctype = require('./ctype.json') // load ctype
        // setup claimer 
        var userMnemonic = null
        try {
            userMnemonic = store.get(this.props.storage.users)[this.props.selected.selectedClaimer].mnemonic
        } catch{
            alert("No Claimer exists")
            return
        }

        const claimer = Kilt.Identity.buildFromMnemonic(userMnemonic)
        // create the claim
        const claim = Kilt.Claim.fromCTypeAndClaimContents(
            ctype,
            data,
            claimer.address,
            null
        );
        // format for attestation request
        const requestForAttestation = Kilt.RequestForAttestation.fromClaimAndIdentity(
            claim,
            claimer,
            []
        );
        // save claim localy
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

    handleRemove(index) { // removes the claim at a give index
        var claims = store.get(this.props.storage.claims)
        claims.splice(index, 1)
        store.set(this.props.storage.claims, claims)
        this.setState(prevState => {
            return {
                ...prevState,
                claims: store.get(this.props.storage.claims)
            }
        })
    }

    handleAttest(index, data) { // attest the claim with selected attestor
        // setup attester
        var attesterMnemonic = null
        try {
            attesterMnemonic = store.get(this.props.storage.attesters)[this.props.selected.selectedAttester].mnemonic
        } catch (e) {
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

        // store on block chain

        Kilt.connect('wss://full-nodes.kilt.io:9944')


        attestation.store(attester).then(() => {
            // create the attestedclaim
            const attestedClaim = Kilt.AttestedClaim.fromRequestAndAttestation(
                requestForAttestation,
                attestation
            );
            // store it localy
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

    handleValidationRequest(index) { // send request for verification and give feedback on result
        this.currentClaimForVerification = index // store index of claim in question
        const result = Verifier.sendForVerification(this.handleNonceSigning)
        switch (result) {
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

    handleNonceSigning(nonce) { // sign the nonce and send of the data to be verified
        // setup claimer
        const claimerMnemonic = store.get(this.props.storage.users)[this.props.selected.selectedClaimer].mnemonic

        const claimer = Kilt.Identity.buildFromMnemonic(claimerMnemonic)
        // sign the nonce as the claimer with your private identity
        const signedNonce = claimer.signStr(nonce)

        // load the Claim and send them off
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
