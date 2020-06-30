import React from "react"


class Claimer extends React.Component { 
    render(){
        return(
        <div className="Claimer">
            <h2>{this.props.id.name}</h2>
            <p>{this.props.id.mnemonic}</p>
            <form>
                <input type="button" value="Remove" onClick={() => this.props.handleRemove(this.props.id.name)}/>
            </form>
        </div>
        )
    }
}

export default Claimer