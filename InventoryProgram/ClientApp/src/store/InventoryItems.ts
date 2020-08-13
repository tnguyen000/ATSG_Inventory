import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { useDispatch } from 'react-redux';
import { routerActions, CallHistoryMethodAction } from 'connected-react-router';
import { Router } from 'react-router';
import { stat } from 'fs';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface InventoryItemsState {
    isLoading: boolean;
    items: InventoryItem[];
    accessType: number;
    categories: string[];
    owners: string[];
    locations: string[];
}

const AUTH_KEY = "AUTH_KEY";
const USER_ID = "USER_ID";

export interface InventoryItem {
    id: number;
    modelName: string;
    serialNumber: string;
    hostName: string;
    ipAddress: string;
    category: string;
    owner: string;
    location: string;
}

export interface LoginBodyRequest {
    username: string;
    password: string;
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestInventoryItemsAction {
    type: 'REQUEST_INVENTORY_ITEMS';
}

interface ReceiveInventoryItemssAction {
    type: 'RECEIVE_INVENTORY_ITEMS';
    items: InventoryItem[];
}

interface ReceiveLoginRequest {
    type: 'LOGIN_SET_ACCESS';
    body: number;
}

interface PostInventoryItemsActionRequest {
    type: 'POST_INVENTORY_ITEMS_REQUEST';
}

interface PostInventoryItemsAction {
    type: 'POST_INVENTORY_ITEMS';
    body: InventoryItem;
}

interface UpdateInventoryItemsAction {
    type: 'UPDATE_INVENTORY_ITEMS';
    body: InventoryItem;
    index: number;
}

interface DeleteItemResponse {
    type: 'DELETE_ITEM_RESPONSE';
    body: number;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestInventoryItemsAction | ReceiveLoginRequest | ReceiveInventoryItemssAction | PostInventoryItemsAction | PostInventoryItemsActionRequest | DeleteItemResponse | UpdateInventoryItemsAction | CallHistoryMethodAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestInventoryItems: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        //Request to show inventory data
        const appState = getState();
        if (appState && appState.inventoryItems) {
            fetch(`/api/inventory`)
                .then(response => response.json() as Promise<any>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_INVENTORY_ITEMS', items: data.items });
                });

            dispatch({ type: 'REQUEST_INVENTORY_ITEMS' });
        }
    },
    //POST request to add a new product to inventory list
    postInventoryItems: (newInventoryData: InventoryItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`/api/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newInventoryData)
            })
                .then(response => response.json() as Promise<InventoryItem>)
                .then(data => {
                    dispatch({ type: 'POST_INVENTORY_ITEMS', body: data })
                });
            dispatch({ type: 'POST_INVENTORY_ITEMS_REQUEST' })
        }
    },
    //POST request to login an existing user
    postLoginUser: (newInventoryData: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newInventoryData)
            })

                .then(response => {
                    if (response.status === 200) {
                        return response.json() as Promise<any>;
                    } else {
                        alert('Incorrect Username or Password.');
                    }
                })
                .then(data => {
                    if (data) {
                        sessionStorage.setItem(AUTH_KEY, data.key);
                        console.log(data)
                        
                        dispatch(routerActions.push('/InvList'));
                        dispatch({ type: 'LOGIN_SET_ACCESS', body: data.accessType })
                    }
                });
            dispatch({ type: 'POST_INVENTORY_ITEMS_REQUEST' })
        }
    },
    //POST request to create a new user login
    postCreateUser: (newInventoryData: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`api/login/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newInventoryData)
            })
                .then(response => response.json() as Promise<any>)
                .then(data => {
                    dispatch({ type: 'POST_INVENTORY_ITEMS', body: data })
                });
            dispatch({ type: 'POST_INVENTORY_ITEMS_REQUEST' })
        }
    },
    //DELETE request to delete a product from inventory list
    deleteInvList: (id: number, index: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`/api/inventory/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        dispatch({ type: 'DELETE_ITEM_RESPONSE', body: index })
                    } else {
                        alert('Error deleting.');
                    }
                })
            dispatch({ type: 'POST_INVENTORY_ITEMS_REQUEST' })
        }
    },
    //PUT request to edit and update product information in inventory list
    putNewInventory: (newBody: InventoryItem, index: number, id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`/api/inventory/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBody)
            })
                .then(response => {
                    if (response.status === 200) {
                        dispatch({ type: 'UPDATE_INVENTORY_ITEMS', body: newBody, index: index })
                    } else {
                        alert('Error editing.');
                    }
                })
            dispatch({ type: 'POST_INVENTORY_ITEMS_REQUEST' })
        }
    },
    //POST request to get sorted list
    postSortedList: (newBody: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`/api/inventory/sort`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBody)
            })
                .then(response => response.json() as Promise<InventoryItem[]>)
                .then(data => {
                    dispatch({
                        type: 'RECEIVE_INVENTORY_ITEMS', items: data})
                });
            dispatch({ type: 'POST_INVENTORY_ITEMS_REQUEST' })
        }
    },
    //GET request to search for product
    requestSearch: (input: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.inventoryItems) {
            if (input === undefined) {
                input = ""
            }

            fetch(`/api/inventory/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)
            })
                .then(response => response.json() as Promise<InventoryItem[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_INVENTORY_ITEMS', items: data });
                });

            dispatch({ type: 'REQUEST_INVENTORY_ITEMS' });
        }
    },
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: InventoryItemsState = { items: [], isLoading: false, accessType: 5, categories: [], owners: [], locations: [] };

export const reducer: Reducer<InventoryItemsState> = (state: InventoryItemsState | undefined, incomingAction: Action): InventoryItemsState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_INVENTORY_ITEMS':
            return {
                items: state.items,
                isLoading: true,
                accessType: state.accessType,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            };
        case 'RECEIVE_INVENTORY_ITEMS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                items: action.items,
                isLoading: false,
                accessType: state.accessType,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            };
            break;
        case 'POST_INVENTORY_ITEMS':
            var thing = state.items
            thing.push(action.body)
            return {
                items: thing,
                isLoading: false,
                accessType: state.accessType,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            }
        case 'POST_INVENTORY_ITEMS_REQUEST':
            return {
                items: state.items,
                isLoading: true,
                accessType: state.accessType,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            }
        case 'DELETE_ITEM_RESPONSE':
            state.items.splice(action.body, 1)
            return {
                items: state.items,
                isLoading: false,
                accessType: state.accessType,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            }
        case 'UPDATE_INVENTORY_ITEMS':
            state.items[action.index] = action.body
            return {
                items: state.items,
                isLoading: false,
                accessType: state.accessType,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            }
        case 'LOGIN_SET_ACCESS':
            console.log(action.body)
            return {
                items: state.items,
                isLoading: false,
                accessType: action.body,
                owners: state.owners,
                categories: state.categories,
                locations: state.locations
            }
    }

    return state;
}