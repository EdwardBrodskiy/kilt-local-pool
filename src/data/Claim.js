import React from "react"


function Claim(props) {
    // specify location of contents depending on the stage the claim is in
    var contents = null
    if (props.item.attestation) {
        contents = props.item.request.claim.contents
    } else {
        contents = props.item.claim.contents
    }
    // format all of the values into a list
    var descriptions = []
    for (const [key, value] of Object.entries(contents)) {
        descriptions.push(<li key={key} className="list-group-item"><b>{key} -</b> {value}</li>)
    }

    return (
        <div className="media content-section " >
            <div className="media-body">

                <h3>{props.item.attestation ? <span className="badge badge-success ">Attested</span> :
                    <span className="badge badge-warning ">Not Attested</span>}</h3>

                <ul className="list-group">
                    {descriptions}
                </ul>
                <form className="btn-group" >
                    {!props.item.attestation && <input className="btn btn-outline-secondary" type="button" value="Attest"
                        onClick={() => props.handleAttest(props.index, props.item)} />}

                    <input className="btn btn-outline-primary" type="button" value="Send to Verifier"
                        onClick={() => props.handleValidationRequest(props.index)} />

                    <input className="btn btn-outline-danger" type="button" value="Remove"
                        onClick={() => props.handleRemove(props.index)} />
                </form>
            </div>



        </div>
    )
}


export default Claim