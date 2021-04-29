import { combineReducers } from 'redux';
import searchReducer from './searchReducer';
import user from './user_reducer';


const rootReducer = combineReducers({
    user,
    searchResult: searchReducer
});

export default rootReducer;