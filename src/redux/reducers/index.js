import initializer from './initializer';

const rootReducer = (state = {}, action) => {
    return {
        initial_data: initializer(state.initial_data, action),
    }
}

export default rootReducer;