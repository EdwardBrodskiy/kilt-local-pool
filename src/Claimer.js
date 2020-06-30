import React from "react"


class Claimer extends React.Component { 
    render(){
        return(
        <div className="Claimer media content-section">
            <div className="media-body">
                <h2 className="mt-0">{this.props.id.name}</h2>
                <p>{this.props.id.mnemonic}</p>
            </div>
           
            <form className="float-right">
                <input className="btn btn-outline-danger" type="button" value="Remove" onClick={() => this.props.handleRemove(this.props.id.name)}/>
            </form>
        </div>
        )
    }
}

export default Claimer