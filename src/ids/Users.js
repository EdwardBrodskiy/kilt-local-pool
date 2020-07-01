import React from 'react';
import Kilt from '@kiltprotocol/sdk-js'
import CreateIdentity from "./CreateIdentity"
import store from "store"
import Claimer from "./Claimer"

class Users extends React.Component {
    constructor() {
        super()
        this.checkLocalData()
        this.state = {
            ids: store.get("ids")
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }

    checkLocalData() {
        var ids = store.get("ids")
        if (ids == null) {
            store.set("ids", [])
        }
    }

    handleCreate(event, identity) {
        event.preventDefault()
        try {
            Kilt.Identity.buildFromMnemonic(identity.mnemonic)
            var ids = store.get("ids")
            
            ids.push(identity)
            store.set("ids", ids)


        } catch (err) {
            alert("Invalid Mnemonic make sure it made up of 12 words")
        }
        this.setState(prevState => {
            return {
                ...prevState,
                ids: store.get("ids")
            }
        })
    }

    handleRemove(key) {
        var ids = store.get("ids")
        ids.splice(key, 1)
        store.set("ids", ids)
        this.setState(prevState => {
            return {
                ...prevState,
                ids: store.get("ids")
            }
        })
    }


    render() {
        
        const ids = this.state.ids.map((value, index) => <Claimer key={index} index={index} 
        item={value} handleRemove={this.handleRemove} handleSelect={() => this.props.changeSelected(index)}
        selected={this.props.selected === index}/>)
        return (
            <div>
                <CreateIdentity handleSubmit={this.handleCreate} />
                {ids}
            </div>
        );
    }

}

export default Users;
