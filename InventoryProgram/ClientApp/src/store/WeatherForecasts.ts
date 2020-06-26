import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { useDispatch } from 'react-redux';
import { routerActions } from 'connected-react-router';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface WeatherForecastsState {
    isLoading: boolean;
    forecasts: WeatherForecast[];
}

const AUTH_KEY = "AUTH_KEY";

export interface WeatherForecast {
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

interface RequestWeatherForecastsAction {
    type: 'REQUEST_WEATHER_FORECASTS';
}

interface ReceiveWeatherForecastsAction {
    type: 'RECEIVE_WEATHER_FORECASTS';
    forecasts: WeatherForecast[];
}

interface PostWeatherForecastsActionRequest {
    type: 'POST_WEATHER_FORECASTS_REQUEST';
}

interface PostWeatherForecastsAction {
    type: 'POST_WEATHER_FORECASTS';
    body: WeatherForecast;
}

interface UpdateWeatherForecastsAction {
    type: 'UPDATE_WEATHER_FORECASTS';
    body: WeatherForecast;
    index: number;
}

interface DeleteItemResponse {
    type: 'DELETE_ITEM_RESPONSE';
    body: number;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestWeatherForecastsAction | ReceiveWeatherForecastsAction | PostWeatherForecastsAction | PostWeatherForecastsActionRequest | DeleteItemResponse | UpdateWeatherForecastsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestWeatherForecasts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.weatherForecasts) {
            fetch(`inventory`)
                .then(response => response.json() as Promise<WeatherForecast[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_WEATHER_FORECASTS', forecasts: data });
                });

            dispatch({ type: 'REQUEST_WEATHER_FORECASTS' });
        }
    },
    //POST request to add a new product to inventory lust
    postWeatherForecasts: (newForecastData: WeatherForecast): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newForecastData)
            })
                .then(response => response.json() as Promise<WeatherForecast>)
                .then(data => {
                    dispatch({ type: 'POST_WEATHER_FORECASTS', body: data })
                });
            dispatch({ type: 'POST_WEATHER_FORECASTS_REQUEST' })
        }
    },
    //POST request to login an existing user
    postLoginUser: (newForecastData: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newForecastData)
            })

                .then(response => {
                    if (response.status === 200) {
                        return response.json() as Promise<string>;
                    } else {
                        alert('Incorrect Username or Password.');
                    }
                })
                .then(data => {
                    if (data) {
                        sessionStorage.setItem(AUTH_KEY, data);
                    }
                });
            dispatch({ type: 'POST_WEATHER_FORECASTS_REQUEST' })
        }
    },
    //POST request to create a new user login
    postCreateUser: (newForecastData: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`api/login/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newForecastData)
            })
                .then(response => response.json() as Promise<any>)
                .then(data => {
                    dispatch({ type: 'POST_WEATHER_FORECASTS', body: data })
                });
            dispatch({ type: 'POST_WEATHER_FORECASTS_REQUEST' })
        }
    },
    //DELETE request to delete a product from inventory list
    deleteInvList: (id: number, index: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`inventory/delete/${id}`, {
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
            dispatch({ type: 'POST_WEATHER_FORECASTS_REQUEST' })
        }
    },
    //PUT request to edit product information in onventory list
    putNewInventory: (newBody: WeatherForecast, index: number, id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState) {
            fetch(`inventory/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBody)
            })
                .then(response => {
                    if (response.status === 200) {
                        dispatch({ type: 'UPDATE_WEATHER_FORECASTS', body: newBody, index: index })
                    } else {
                        alert('Error editing.');
                    }
                })
            dispatch({ type: 'POST_WEATHER_FORECASTS_REQUEST' })
        }
    },
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: WeatherForecastsState = { forecasts: [], isLoading: false };

export const reducer: Reducer<WeatherForecastsState> = (state: WeatherForecastsState | undefined, incomingAction: Action): WeatherForecastsState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_WEATHER_FORECASTS':
            return {
                forecasts: state.forecasts,
                isLoading: true
            };
        case 'RECEIVE_WEATHER_FORECASTS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                forecasts: action.forecasts,
                isLoading: false
            };
            break;
        case 'POST_WEATHER_FORECASTS':
            var thing = state.forecasts
            thing.push(action.body)
            return {
                forecasts: thing,
                isLoading: false
            }
        case 'POST_WEATHER_FORECASTS_REQUEST':
            return {
                forecasts: state.forecasts,
                isLoading: true
            }
        case 'POST_WEATHER_FORECASTS':
            var thing = state.forecasts
            thing.push(action.body)
            return {
                forecasts: thing,
                isLoading: false
            }
        case 'DELETE_ITEM_RESPONSE':
            state.forecasts.splice(action.body, 1)
            return {
                forecasts: state.forecasts,
                isLoading: false
            }
        case 'UPDATE_WEATHER_FORECASTS':
            state.forecasts[action.index] = action.body
            return {
                forecasts: state.forecasts,
                isLoading: false
            }

    }

    return state;
}