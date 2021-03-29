import {
    SET_LANG,
    SET_PERMISSIONS,
    SET_CURRENT_USER,
} from '../actionTypes';

export default function initializer(state = [], action) {
    switch (action.type) {
        case SET_LANG:
            return {
                ...state,
                lang: action.payload
            };
        case SET_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            };

        default:
            return state;
    }
}