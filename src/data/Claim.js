import React from "react"


class Claim extends React.Component { 
    render(){

        return(
        <div className="media content-section ">
            <div className="media-body">
                <h2 className="mt-0">{this.props.item.claim.contents.name}</h2>
                <p>{this.props.item.claim.contents.age}</p>
                
                
                
                
            </div>
           
            <form className="float-right" >
                
                <input className="btn btn-outline-danger" type="button" value="Remove" 
                onClick={() => this.props.handleRemove(this.props.index)}/>
                
            
            </form>
            
        </div>
        )
    }
}

export default Claim