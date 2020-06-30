import React from "react"


class Claimer extends React.Component {
    render(){
        return(
        <div>
            <h2>{this.props.id.name}</h2>
            <p>{this.props.id.mnemonic}</p>
        </div>
        )
    }
}

export default Claimer