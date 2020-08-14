import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import { actionCreators, InventoryItem, LoginBodyRequest } from '../store/InventoryItems';
import { Button } from 'reactstrap';
import { useDispatch, batch } from "react-redux";
import { push } from "connected-react-router";
import { Typeahead } from 'react-bootstrap-typeahead';
import { Session } from 'inspector';
import { access } from 'fs';


interface Props {
    isLoading: boolean;
    getInventory: () => void;
    postInventory: (body: InventoryItem) => void;
    deleteInventory: (id: number, index: number) => void;
    items: InventoryItem[];
    accessType: number;
    putInventory: (newBody: InventoryItem, index: number, id: number) => void;
    sortInventory: (sort: number) => void;
    requestSearch: (input: string) => void;
    owners: string[],
    categories: string[],
    locations: string[]
}

function InvList({ isLoading, getInventory, postInventory, deleteInventory, items, putInventory, sortInventory, requestSearch, accessType, owners, categories, locations }: Props) {
    const [isAddingOwner, setIsAddingOwner] = useState<boolean>(false);
    const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
    const [isAddingCategories, setIsAddingCategories] = useState<boolean>(false);
    const [modelName, setModelName] = useState<string>("");
    const [serialNumber, setSerialNumber] = useState<string>("");
    const [hostName, setHostName] = useState<string>("");
    const [ipAddress, setIpAddress] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [owner, setOwner] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<number>();
    const [newModelName, setNewModelName] = useState<string>("");
    const [newSerialNumber, setNewSerialNumber] = useState<string>("");
    const [newHostName, setNewHostName] = useState<string>("");
    const [newIpAddress, setNewIpAddress] = useState<string>("");
    const [newCategory, setNewCategory] = useState<string>("");
    const [newOwner, setNewOwner] = useState<string>("");
    const [newLocation, setNewLocation] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [addNewCategory, setAddNewCategory] = useState<string>("");
    const [addNewLocation, setAddNewLocation] = useState<string>("");
    const [addNewOwner, setAddNewOwner] = useState<string>("");
    const dispatch = useDispatch();

   
  
    useEffect(() => {
        getInventory!();
    }, [])

    const y = sessionStorage.getItem('AUTH_KEY');
    if (!y) {
        dispatch(push(''))
    }
    //Confirms new products added and adds to database
    const testBody = () => {
        let item = { modelName: modelName, serialNumber: serialNumber, hostName: hostName, ipAddress: ipAddress, category: category, owner: owner, location: location } as InventoryItem
        postInventory(item)
        setShowAdd(!setShowAdd)
    }
    //Deletes a product from inventory list
    const testBodyTwo = (id: number) => {
        var x = findItem(id, items)
        deleteInventory(id, x);
    }
    //Edits a product from inventory list
    const testBodyThree = (id: number, list: InventoryItem[]) => {
        let item = { id: id, modelName: newModelName, serialNumber: newSerialNumber, hostName: newHostName, ipAddress: newIpAddress, category: newCategory, owner: newOwner, location: newLocation } as InventoryItem
        console.log(item)
        if (id) {
            putInventory(item, findItem(item.id, list), id)
            setIsEditing(0)
        }
    }
    //Sorts selected header row by ascending order
    const testBodyFour = (sort: number) => {
        sortInventory (sort)
    }
    //Searches for product information 
    const testBodyFive = (search: string) => {
        requestSearch(search)   
    }

    const testBodySix = () => {
        dispatch(actionCreators.postNewCategory(addNewCategory))
        setIsAddingCategories(false)
    }

    const testBodySeven = () => {
        dispatch(actionCreators.postNewOwner(addNewOwner))
        setIsAddingOwner(false)
    }

    const testBodyEight = () => {
        dispatch(actionCreators.postNewLocation(addNewLocation))
        setIsAddingLocation(false)
    }

    const selectEdit = (item: InventoryItem) => {
        setNewModelName(item.modelName)
        setNewSerialNumber(item.serialNumber)
        setNewHostName(item.hostName)
        setNewIpAddress(item.ipAddress)
        setNewCategory(item.category)
        setOwner(item.owner)
        setNewLocation(item.location)
        setIsEditing(item.id)
    }
    //Add New Product button with fields to input new product information, search product serial number, table with data as well as delete and edit functions
    return (
        <React.Fragment><div>

            {showAdd ? null : (<button onClick={() => setShowAdd(!showAdd)}>Add New Product</button>)}

            {accessType === 0 ? (<div>
                <p>For Dropdown List:</p>
                {isAddingCategories ? (<div>
                    <input onChange={(event) => setAddNewCategory(event.target.value)}></input>
                    < button onClick={testBodySix}>Confirm</button><button onClick={() => setIsAddingCategories(false)}>Cancel</button></div>) : (<button onClick={() => setIsAddingCategories(true)}>Add New Category</button>)}
                {isAddingOwner ? (<div>
                    <input onChange={(event) => setAddNewOwner(event.target.value)}></input>
                    <button onClick={testBodySeven}>Confirm</button><button onClick={() => setIsAddingOwner(false)}>Cancel</button></div>) : (<button onClick={() => setIsAddingOwner(true)}>Add New Owner</button>)}
                {isAddingLocation ? (<div>
                    <input onChange={(event) => setAddNewLocation(event.target.value)}></input>
                    <button onClick={testBodyEight}>Confirm</button><button onClick={() => setIsAddingLocation(false)}>Cancel</button></div>) : (<button onClick={() => setIsAddingLocation(true)}>Add New Location</button>)}
            </div>) : null}

            {showAdd ? (<div>
                <div>
                    <p>Model Name</p>
                    <input onChange={(event) => setModelName(event.target.value)}></input>
                </div>
                <div>
                    <p>Serial Number</p>
                    <input onChange={(event) => setSerialNumber(event.target.value)}></input>
                </div>

                <div>
                    <p>Host Name</p>
                    <input onChange={(event) => setHostName(event.target.value)}></input>
                </div>

                <div>
                    <p>IP Address</p>
                    <input onChange={(event) => setIpAddress(event.target.value)}></input>
                </div>

                <div>
                    <p>Category</p>
                    <select onChange={(event) => setCategory(event.target.value)}>
                        {categories ? categories.map((body: any) => <option onClick={() => setCategory(body.name)}>{body.name}</option>) : null}
                    </select>
                </div>

                <div>
                    <p>Owner</p>
                    <select onChange={(event) => setOwner(event.target.value)}>
                        {owners ? owners.map((body: any) => <option onClick={() => setOwner(body.name)}>{body.name}</option>) : null}
                    </select>
                </div>

                <div>
                    <p>Location</p>
                    <select onChange={(event) => setLocation(event.target.value)}>
                        {locations ? locations.map((body: any) => <option onClick={() => setLocation(body.name)}>{body.name}</option>) : null}
                    </select>
                </div>

                <button style={{ marginTop: "25px" }} onClick={() => setShowAdd(!showAdd)}>Cancel</button>
                <button style={{ marginBottom: "25px" }} onClick={testBody}>Confirm</button>
            </div>) : null}

            <p>Search for inventory</p>
            <input onChange={(event) => testBodyFive(event.target.value)}></input>

            {isLoading ? (<b>Loading...</b>) : (<table className='table table-striped' style={{ maxWidth: "90%" }} aria-labelledby="tabelLabel">

                <thead>
                    <tr>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(1)}>Model Name</span></th>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(2)}>Serial Number</span></th>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(3)}>Hostname</span></th>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(4)}>IP Address</span></th>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(5)}>Category</span></th>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(6)}>Owner</span></th>
                        <th><span style={{ cursor: "pointer" }} onClick={() => testBodyFour(7)}>Location</span></th>
                        {accessType === 0 ? (<th><span>Remove</span></th>) : null}
                        {accessType < 2 ? (<th><span>Edit</span></th>) : null}

                    </tr>
                </thead>

                {items.map((info: InventoryItem) =>
                    <tbody>
                        {isEditing === info.id ? (
                            <tr>
                                <td><input onChange={(event) => setNewModelName(event.target.value)} style={{ width: "100%" }} value={newModelName}></input></td>
                                <td><input onChange={(event) => setNewSerialNumber(event.target.value)} style={{ width: "100%" }} value={newSerialNumber}></input></td>
                                <td><input onChange={(event) => setNewHostName(event.target.value)} style={{ width: "100%" }} value={newHostName}></input></td>
                                <td><input onChange={(event) => setNewIpAddress(event.target.value)} style={{ width: "100%" }} value={newIpAddress}></input></td>
                                <td>
                                    <select onChange={(event) => setNewCategory(event.target.value)}>
                                        {categories ? categories.map((body: any) => <option onClick={() => setNewCategory(body.name)}>{body.name}</option>) : null}
                                    </select>
                                </td>
                                <td>
                                    <select onChange={(event) => setNewOwner(event.target.value)}>
                                        {owners ? owners.map((body: any) => <option onClick={() => setNewOwner(body.name)}>{body.name}</option>) : null}
                                    </select>
                                </td>
                                <td>
                                    <select onChange={(event) => setNewLocation(event.target.value)}>
                                        {locations ? locations.map((body: any) => <option onClick={() => setNewLocation(body.name)}>{body.name}</option>) : null}
                                    </select>
                                </td>
                                <td><button onClick={() => testBodyThree(info.id, items)}>Confirm</button></td>
                                <td><button onClick={() => setIsEditing(0)}>Cancel</button></td>
                            </tr>
                        ) : (<tr>
                            <td>{info.modelName}</td>
                            <td>{info.serialNumber}</td>
                            <td>{info.hostName}</td>
                            <td>{info.ipAddress}</td>
                            <td>{info.category}</td>
                            <td>{info.owner}</td>
                            <td>{info.location}</td>
                            {accessType === 0 ? (<td><button onClick={() => testBodyTwo(info.id)}>Delete</button></td>) : null}
                            {accessType < 2 ? (<td><button onClick={() => selectEdit(info)}>Edit</button></td>) : null}


                        </tr>)
                        }
                    </tbody>
                )}

            </table>)}

        </div>


    </React.Fragment>
    );
}

const mapStateToProps = (state: {
    inventoryItems: {
        items: InventoryItem[];
        isLoading: boolean;
        accessType: number;
        owners: string[],
        categories: string[],
        locations: string[]
    };
}) => ({
    items: state.inventoryItems.items,
    isLoading: state.inventoryItems.isLoading,
    accessType: state.inventoryItems.accessType,
    owners: state.inventoryItems.owners,
        locations: state.inventoryItems.locations,
        categories: state.inventoryItems.categories,
});

const mapDispatchToProps = (dispatch: (arg0: any) => void) => ({
    getInventory: () => dispatch(actionCreators.requestInventoryItems()),
    postInventory: (body: InventoryItem) => dispatch(actionCreators.postInventoryItems(body)),
    deleteInventory: (id: number, index: number) => dispatch(actionCreators.deleteInvList(id, index)),
    putInventory: (newBody: InventoryItem, index: number, id: number) => dispatch(actionCreators.putNewInventory(newBody, index, id)),
    sortInventory: (sort: number) => dispatch(actionCreators.postSortedList(sort)),
    requestSearch: (input: string) => dispatch(actionCreators.requestSearch(input))
});

const findItem = (id: number, lists: any[]) => {

    var index = 0;
    lists.forEach(element => {
        console.log("found element id: " + element.id)
        if (element.id === id) {
            index = lists.indexOf(element)
        }
    })

    return index;
}
export default connect(mapStateToProps, mapDispatchToProps)(InvList as React.FC);