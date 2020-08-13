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
}

function InvList({ isLoading, getInventory, postInventory, deleteInventory, items, putInventory, sortInventory, requestSearch, accessType }: Props) {
    const [token, setToken] = useState<string | null>();
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
    const dispatch = useDispatch();
    console.log("access type: " + accessType)
   

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
        let item = { modelName: newModelName, serialNumber: newSerialNumber, hostName: newHostName, ipAddress: newIpAddress, category: newCategory, owner: newOwner, location: newLocation } as InventoryItem
        console.log(item)
        putInventory(item, findItem(item.id, list), id)
        setIsEditing(0)
    }
    //Sorts selected header row by ascending order
    const testBodyFour = (sort: number) => {
        sortInventory (sort)
    }
    //Searches for product information 
    const testBodyFive = (search: string) => {
        requestSearch(search)   
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
                        <option onClick={() => setCategory("Audio System")}>Audio System</option>
                        <option onClick={() => setCategory("Control System")}>Control System</option>
                        <option onClick={() => setCategory("Digital Media Module")}>Digital Media Module</option>
                        <option onClick={() => setCategory("Digital Media Switcher")}>Digital Media Module</option>
                        <option onClick={() => setCategory("Ethernet Control Module")}>Ethernet Control Module</option>
                        <option onClick={() => setCategory("Ethernet Switch")}>Ethernet Switch</option>
                        <option onClick={() => setCategory("Modular Multi-Tuner")}>Modular Multi-Tuner</option>
                        <option onClick={() => setCategory("Power Supply")}>Power Supply</option>
                        <option onClick={() => setCategory("Touchless Panel")}>Touchless Panel</option>
                        <option onClick={() => setCategory("Wireless Gateway")}>Wireless Gateway</option>
                    </select>
                </div>

                <div>
                    <p>Owner</p>
                    <select onChange={(event) => setOwner(event.target.value)}>
                        <option onClick={() => setOwner("Barry Vandenberg")}>Barry Vandenberg</option>
                        <option onClick={() => setOwner("Christopher Rossi")}>Christopher Rossi</option>
                        <option onClick={() => setOwner("Cinto Frausto")}>Cinto Frausto</option>
                        <option onClick={() => setOwner("DK Karnoscak")}>DK Karnoscak</option>
                        <option onClick={() => setOwner("Eric Stover")}>Eric Stover</option>
                        <option onClick={() => setOwner("James Gaylor")}>James Gaylor</option>
                        <option onClick={() => setOwner("Lamont Moore")}>Lamont Moore</option>
                        <option onClick={() => setOwner("Mark Reilly")}>Mark Reilly</option>
                        <option onClick={() => setOwner("Robert Kirby")}>Robert Kirby</option>
                        <option onClick={() => setOwner("Rodrigo Ceballos")}>Rodrigo Ceballos</option>
                        <option onClick={() => setOwner("Ronnie Giron")}>Ronnie Giron</option>
                        <option onClick={() => setOwner("Ryan Kasher")}>Ryan Kasher</option>
                        <option onClick={() => setOwner("Ryan Kemper")}>Ryan Kemper</option>
                        <option onClick={() => setOwner("Toby Ortiz")}>Toby Ortiz</option>
                        <option onClick={() => setOwner("Tres Little")}>Tres Little</option>
                        <option onClick={() => setOwner("William Resendez")}>William Resendez</option>
                    </select>
                </div>

                <div>
                    <p>Location</p>
                    <select onChange={(event) => setLocation(event.target.value)}>
                        <option onClick={() => setLocation("New Jersey ATSG Lab")}>New Jersey ATSG Lab</option>
                        <option onClick={() => setLocation("Plano ATSG Lab")}>Plano ATSG Lab</option>
                        <option onClick={() => setLocation("ATSG Engineering Lab")}>ATSG Engineering Lab</option>
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
                        {accessType < 2 ? (<th><span>Edit</span></th> ) : null}
                        
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
                                        <option onClick={() => setNewCategory("Audio System")}>Audio System</option>
                                        <option onClick={() => setNewCategory("Control System")}>Control System</option>
                                        <option onClick={() => setNewCategory("Digital Media Module")}>Digital Media Module</option>
                                        <option onClick={() => setNewCategory("Digital Media Switcher")}>Digital Media Module</option>
                                        <option onClick={() => setNewCategory("Ethernet Control Module")}>Ethernet Control Module</option>
                                        <option onClick={() => setNewCategory("Ethernet Switch")}>Ethernet Switch</option>
                                        <option onClick={() => setNewCategory("Modular Multi-Tuner")}>Modular Multi-Tuner</option>
                                        <option onClick={() => setNewCategory("Power Supply")}>Power Supply</option>
                                        <option onClick={() => setNewCategory("Touchless Panel")}>Touchless Panel</option>
                                        <option onClick={() => setNewCategory("Wireless Gateway")}>Wireless Gateway</option>
                                    </select>
                                </td>
                                <td>
                                    <select onChange={(event) => setNewOwner(event.target.value)}>
                                        <option onClick={() => setNewOwner("Barry Vandenberg")}>Barry Vandenberg</option>
                                        <option onClick={() => setNewOwner("Christopher Rossi")}>Christopher Rossi</option>
                                        <option onClick={() => setNewOwner("Cinto Frausto")}>Cinto Frausto</option>
                                        <option onClick={() => setNewOwner("DK Karnoscak")}>DK Karnoscak</option>
                                        <option onClick={() => setNewOwner("Eric Stover")}>Eric Stover</option>
                                        <option onClick={() => setNewOwner("James Gaylor")}>James Gaylor</option>
                                        <option onClick={() => setNewOwner("Lamont Moore")}>Lamont Moore</option>
                                        <option onClick={() => setNewOwner("Mark Reilly")}>Mark Reilly</option>
                                        <option onClick={() => setNewOwner("Robert Kirby")}>Robert Kirby</option>
                                        <option onClick={() => setNewOwner("Rodrigo Ceballos")}>Rodrigo Ceballos</option>
                                        <option onClick={() => setNewOwner("Ronnie Giron")}>Ronnie Giron</option>
                                        <option onClick={() => setNewOwner("Ryan Kasher")}>Ryan Kasher</option>
                                        <option onClick={() => setNewOwner("Ryan Kemper")}>Ryan Kemper</option>
                                        <option onClick={() => setNewOwner("Toby Ortiz")}>Toby Ortiz</option>
                                        <option onClick={() => setNewOwner("Tres Little")}>Tres Little</option>
                                        <option onClick={() => setNewOwner("William Resendez")}>William Resendez</option>
                                    </select>
                                </td>
                                <td>
                                    <select onChange={(event) => setNewLocation(event.target.value)}>
                                        <option onClick={() => setNewLocation("New Jersey ATSG Lab")}>New Jersey ATSG Lab</option>
                                        <option onClick={() => setNewLocation("Plano ATSG Lab")}>Plano ATSG Lab</option>
                                        <option onClick={() => setNewLocation("ATSG Remote Lab")}>ATSG Remote Lab</option>
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

            <div> accesstyle : {accessType}</div>
        </div>


        </ React.Fragment>
    );
}

const mapStateToProps = (state: {
    inventoryItems: {
        items: InventoryItem[];
        isLoading: boolean;
        accessType: number;
    };
}) => ({
    items: state.inventoryItems.items,
    isLoading: state.inventoryItems.isLoading,
    accessType: state.inventoryItems.accessType
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
        if (element.id === id) {
            index = lists.indexOf(element)
        }
    })

    return index;
}
export default connect(mapStateToProps, mapDispatchToProps)(InvList as React.FC);