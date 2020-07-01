import React from 'react';
import Kilt from '@kiltprotocol/sdk-js'
import CreateIdentity from "./CreateIdentity"
import store from "store"
import Identety from "./Identety"

class Identeties extends React.Component {
    constructor(props) {
        super(props)

        this.checkLocalData()

        this.state = {
            ids: store.get(this.props.storageLocation)
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }

    checkLocalData() {
        var ids = store.get(this.props.storageLocation)
        if (ids == null) {
            store.set(this.props.storageLocation, [])
        }
    }

    handleCreate(event, identity) {
        event.preventDefault()
        try {
            Kilt.Identity.buildFromMnemonic(identity.mnemonic)
            var ids = store.get(this.props.storageLocation)
            
            ids.push(identity)
            store.set(this.props.storageLocation, ids)


        } catch (err) {
            alert("Invalid Mnemonic make sure it made up of 12 words")
        }
        this.setState(prevState => {
            return {
                ...prevState,
                ids: store.get(this.props.storageLocation)
            }
        })
    }

    handleRemove(key) {
        var ids = store.get(this.props.storageLocation)
        ids.splice(key, 1)
        store.set(this.props.storageLocation, ids)
        this.setState(prevState => {
            return {
                ...prevState,
                ids: store.get(this.props.storageLocation)
            }
        })
    }


    render() {
        
        const ids = this.state.ids.map((value, index) => <Identety key={index} index={index} 
        item={value} handleRemove={this.handleRemove} handleSelect={() => this.props.changeSelected(index)}
        selected={this.props.selected === index}/>)
        return (
            <div>
                <CreateIdentity handleSubmit={this.handleCreate} id={this.props.id}/>
                {ids}
            </div>
        );
    }

}

export default Identeties;
