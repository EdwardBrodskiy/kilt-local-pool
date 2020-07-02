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
        this.handleCreateDid = this.handleCreateDid.bind(this)
        this.handleRemoveDid = this.handleRemoveDid.bind(this)
    }

    checkLocalData() { // check the list exists create it if not
        var ids = store.get(this.props.storageLocation)
        if (ids == null) {
            store.set(this.props.storageLocation, [])
        }
    }

    handleCreate(event, identity) { // create a new Identety
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

    handleCreateDid(index) {
        // setup Claimer
        const mnemonic = this.state.ids[index].mnemonic

        const identity = Kilt.Identity.buildFromMnemonic(mnemonic)
        // create did object
        const did = Kilt.Did.fromIdentity(identity)

        // add to blockchain
        Kilt.connect('wss://full-nodes.kilt.io:9944')
        try {
            did.store(identity)
            // store did object 
            var ids = store.get(this.props.storageLocation)
            ids[index]["did"] = did.createDefaultDidDocument()
            store.set(this.props.storageLocation, ids)

            this.setState(prevState => {
                return {
                    ...prevState,
                    ids: store.get(this.props.storageLocation)
                }
            })
        } catch (e) {
            alert(e)
        } finally {
            Kilt.disconnect('wss://full-nodes.kilt.io:9944')
        }
    }

    handleRemoveDid(index) {
        // setup Claimer
        const mnemonic = this.state.ids[index].mnemonic

        const identity = Kilt.Identity.buildFromMnemonic(mnemonic)

        // remove from blockchain
        Kilt.connect('wss://full-nodes.kilt.io:9944')
        try {
            Kilt.Did.remove(identity)
            // remove did object 
            var ids = store.get(this.props.storageLocation)
            delete ids[index]["did"]
            store.set(this.props.storageLocation, ids)

            this.setState(prevState => {
                return {
                    ...prevState,
                    ids: store.get(this.props.storageLocation)
                }
            })
        } catch (e) {
            alert(e)
        } finally {
            Kilt.disconnect('wss://full-nodes.kilt.io:9944')
        }

    }


    render() {

        const ids = this.state.ids.map((value, index) => <Identety key={index}
            item={value} handleRemove={() => this.handleRemove(index)}
            handleSelect={() => this.props.changeSelected(index)} selected={this.props.selected === index}
            did={this.props.did} handleCreateDid={() => this.handleCreateDid(index)}
            handleRemoveDid={() => this.handleRemoveDid(index)} />)
        return (
            <div>
                <h1 className="head">{this.props.id}</h1>
                <CreateIdentity handleSubmit={this.handleCreate} id={this.props.id} />
                {ids}
            </div>
        );
    }

}

export default Identeties;
