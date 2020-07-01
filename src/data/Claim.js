import React from "react"


class Claim extends React.Component { 
    render(){
        var contents = null
        if(this.props.item.attestation){
            contents = this.props.item.request.claim.contents
        }else{
            contents = this.props.item.claim.contents
        }
        return(
        <div className="media content-section ">
            <div className="media-body">
                {this.props.item.attestation ? <span className="badge badge-success ">Attested</span>:
                <span className="badge badge-warning ">Not Attested</span>}
                <h2 className="mt-0">{contents.name}</h2>
                <p>{contents.age}</p>
            </div>
           
            <form className="float-right" >

                {!this.props.item.attestation && <input className="btn btn-outline-secondary" type="button" value="Attest" 
                onClick={() => this.props.handleAttest(this.props.index, this.props.item)}/>}

                <input className="btn btn-outline-danger" type="button" value="Remove" 
                onClick={() => this.props.handleRemove(this.props.index)}/>
                
            
            </form>
            
        </div>
        )
    }
}

export default Claim