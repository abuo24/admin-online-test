/* ACTION TYPES */
import {
    SET_LANG,
    SET_PERMISSIONS,
    SET_CURRENT_USER,
} from '../actionTypes';

/* INITIALIZING */
export const setLang = (payload) => ({
    type: SET_LANG,
    payload,
});

export const setPermissions = (payload) => ({
    type: SET_PERMISSIONS,
    payload,
});
export const setCurrentUser = (payload) => ({
    type: SET_CURRENT_USER,
    payload,
});
