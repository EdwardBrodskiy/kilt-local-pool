

class Verifier {
    static SUCCESS = 0
    static CLAIMER_NOT_OWNER = 1
    static CLAIM_INVALID = 2
    static NOT_ACCEPTED_CLAIM_FORMAT


    static sendForVerification(nonceSigner) {
        const Kilt = require("@kiltprotocol/sdk-js")

        const uuid = require("uuid")

        // generate nonce
        const nonce = uuid.v4()
        // get Claimer to sign nonce
        const { signedNonce, attestedClaimStruct } = nonceSigner(nonce)

        // check the claimer is the owner of the Claim
        var isSenderOwner = null
        try {
            isSenderOwner = Kilt.Crypto.verify(nonce, signedNonce, attestedClaimStruct.request.claim.owner)
        } catch (e) { // catch if the form is not properly formated
            return this.NOT_ACCEPTED_CLAIM_FORMAT
        }

        if (!isSenderOwner) {
            return this.CLAIMER_NOT_OWNER
        }

        // proceed with verifying the attestedClaim itself
        const attestedClaim = Kilt.AttestedClaim.fromAttestedClaim(attestedClaimStruct);

        // connect to the KILT blockchain
        Kilt.default.connect('wss://full-nodes.kilt.io:9944')

        // verify:
        // - verify that the data is valid for the given CTYPE;
        // - verify on-chain that the attestation hash is present and that the attestation is not revoked.
        const isValid = attestedClaim.verify()

        Kilt.default.disconnect()

        if (isValid) {
            return this.SUCCESS
        }
        return this.CLAIM_INVALID



    }
}


export default Verifier