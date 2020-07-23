import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import { actionCreators, WeatherForecast, LoginBodyRequest } from '../store/WeatherForecasts';
import { Button } from 'reactstrap';
import { useDispatch, batch } from "react-redux";
import { push } from "connected-react-router";
import { Typeahead } from 'react-bootstrap-typeahead';


interface Props {
    isLoading: boolean;
    getInventory: () => void;
    postInventory: (body: WeatherForecast) => void;
    deleteInventory: (id: number, index: number) => void;
    forecasts: WeatherForecast[];
    putInventory: (newBody: WeatherForecast, index: number, id: number) => void;
    sortInventory: (sort: number) => void;
    requestSearch: (input: string) => void;
}

function InvList({ isLoading, getInventory, postInventory, deleteInventory, forecasts, putInventory, sortInventory, requestSearch }: Props) {
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
    const [showSearch, setShowSearch] = useState<boolean>(false);

    useEffect(() => {
        getInventory!();
    }, [])
    //Confirms new products added and adds to database
    const testBody = () => {
        let item = { modelName: modelName, serialNumber: serialNumber, hostName: hostName, ipAddress: ipAddress, category: category, owner: owner, location: location } as WeatherForecast
        postInventory(item)
        setShowAdd(!setShowAdd)
    }
    //Deletes a product from inventory list
    const testBodyTwo = (id: number) => {
        var x = findItem(id, forecasts)
        deleteInventory(id, x);
    }
    //Edits a product from inventory list
    const testBodyThree = (id: number, list: WeatherForecast[]) => {
        let item = { modelName: newModelName, serialNumber: newSerialNumber, hostName: newHostName, ipAddress: newIpAddress, category: newCategory, owner: newOwner, location: newLocation } as WeatherForecast
        console.log(list)
        console.log(findItem(item.id, list))
        putInventory(item, findItem(item.id, list) + 1, id)
        setIsEditing(0)
    }
    //Sorts selected header row by ascending order
    const testBodyFour = (sort: number) => {
        sortInventory (sort)
    }

    const selectEdit = (item: WeatherForecast) => {
        setNewModelName(item.modelName)
        setNewSerialNumber(item.serialNumber)
        setNewHostName(item.hostName)
        setNewIpAddress(item.ipAddress)
        setNewCategory(item.category)
        setNewOwner(item.owner)
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
                    <input onChange={(event) => setCategory(event.target.value)}></input>
                </div>

                <div>
                    <p>Owner</p>
                    <input onChange={(event) => setOwner(event.target.value)}></input>
                </div>

                <div>
                    <p>Loaction</p>
                    <input onChange={(event) => setLocation(event.target.value)}></input>
                </div>

                <button onClick={() => setShowAdd(!showAdd)}>Cancel</button>
                <button onClick={testBody}>Confirm</button>
            </div>) : null}

            <Typeahead
                placeholder="Search for a serial number"
                options={getStringSerials(forecasts)}
                onChange={(selected) => {
                   requestSearch(selected[0]);
                }}
            />
           
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
                        <th><span>Remove</span></th>
                        <th><span>Edit</span></th> 
                    </tr>
                </thead>

                {forecasts.map((info: WeatherForecast) =>
                    <tbody>
                        {isEditing === info.id ? (
                            <tr>
                                <td><input onChange={(event) => setNewModelName(event.target.value)} style={{ width: "100%" }} value={newModelName}></input></td>
                                <td><input onChange={(event) => setNewSerialNumber(event.target.value)} style={{ width: "100%" }} value={newSerialNumber}></input></td>
                                <td><input onChange={(event) => setNewHostName(event.target.value)} style={{ width: "100%" }} value={newHostName}></input></td>
                                <td><input onChange={(event) => setNewIpAddress(event.target.value)} style={{ width: "100%" }} value={newIpAddress}></input></td>
                                <td><input onChange={(event) => setNewCategory(event.target.value)} style={{ width: "100%" }} value={newCategory}></input></td>
                                <td><input onChange={(event) => setNewOwner(event.target.value)} style={{ width: "100%" }} value={newOwner}></input></td>
                                <td><input onChange={(event) => setNewLocation(event.target.value)} style={{ width: "100%" }} value={newLocation}></input></td>
                                <td><button onClick={() => testBodyThree(info.id, forecasts)}>CONFIRM</button></td>
                                <td><button onClick={() => setIsEditing(0)}>CANCEL</button></td>
                            </tr>
                        ) : (<tr>
                            <td>{info.modelName}</td>
                            <td>{info.serialNumber}</td>
                            <td>{info.hostName}</td>
                            <td>{info.ipAddress}</td>
                            <td>{info.category}</td>
                            <td>{info.owner}</td>
                            <td>{info.location}</td>
                            <td><button onClick={() => testBodyTwo(info.id)}>Trash</button></td>
                            <td><button onClick={() => selectEdit(info)}>Edit</button></td>
                        </tr>)
                        }
                    </tbody>
                )}

            </table>)}


        </div>


        </ React.Fragment>
    );
}

const getStringSerials = (forecasts: WeatherForecast[]) => {
    var string = [""]
    forecasts.forEach(element => string.push(element.serialNumber))
    return string
}

const mapStateToProps = (state: {
    weatherForecasts: {
        forecasts: WeatherForecast[];
        isLoading: boolean;
    };
}) => ({
    forecasts: state.weatherForecasts.forecasts,
    isLoading: state.weatherForecasts.isLoading
});

const mapDispatchToProps = (dispatch: (arg0: any) => void) => ({
    getInventory: () => dispatch(actionCreators.requestWeatherForecasts()),
    postInventory: (body: WeatherForecast) => dispatch(actionCreators.postWeatherForecasts(body)),
    deleteInventory: (id: number, index: number) => dispatch(actionCreators.deleteInvList(id, index)),
    putInventory: (newBody: WeatherForecast, index: number, id: number) => dispatch(actionCreators.putNewInventory(newBody, index, id)),
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