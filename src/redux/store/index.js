import { createStore, compose } from 'redux';
import reducers from '../reducers';

const initialState = {
    initial_data: {
        lang: 'Uz',
        currentUser: null,
        permissions: [],
    },
}
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV !== 'production' ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : compose;


export default createStore(
    reducers,
    initialState,
    composeEnhancers,
);