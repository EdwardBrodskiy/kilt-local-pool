import React from "react"

class CreateClaim extends React.Component {
    constructor() {
        super()
        this.state = {
            name: "Alice",
            age: 20
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) { // update the state based on the change
        this.setState(prevState => {
            return {
                ...prevState,
                name: document.getElementById("data-name").value,
                age: parseInt(document.getElementById("data-age").value)
            }
        })

    }

    render() {

        return (
            <form className="form-group" onSubmit={(event) => this.props.handleSubmit(event, this.state)}>
                <h4>Name</h4>
                <input id="data-name" type="text" value={this.state.name} onChange={this.handleChange} />
                <h4>Age</h4>
                <input id="data-age" type="number" value={this.state.age} onChange={this.handleChange} />

                <input className="btn btn-outline-primary" type="submit" />

            </form>
        )
    }
}

export default CreateClaim