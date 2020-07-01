import React from "react"


class Claim extends React.Component {
    render() {
        var contents = null
        if (this.props.item.attestation) {
            contents = this.props.item.request.claim.contents
        } else {
            contents = this.props.item.claim.contents
        }
        var descriptions = []
        for (const [key, value] of Object.entries(contents)){
            descriptions.push(<li key={key} className="list-group-item"><b>{key} -</b> {value}</li>)
        }
            
        return(
            <div className = "media content-section " >
            <div className="media-body">
                <form className="float-right btn-group" >
                    {!this.props.item.attestation && <input className="btn btn-outline-secondary" type="button" value="Attest"
                        onClick={() => this.props.handleAttest(this.props.index, this.props.item)} />}

                    <input className="btn btn-outline-danger" type="button" value="Remove"
                        onClick={() => this.props.handleRemove(this.props.index)} />
                </form>

                {this.props.item.attestation ? <span className="badge badge-success ">Attested</span> :
                    <span className="badge badge-warning ">Not Attested</span>}

                <ul className="list-group">
                    {descriptions}
                </ul>

            </div>



            </div>
        )
    }
}

export default Claim