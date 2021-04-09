import { INITIAL_RESULT, TYPING_SEARCH_BAR } from "../actions/types";



export default function (state={},action){
    switch(action.type){
        case "ADD_SEARCH_RESULT":
            const s = action.payload;
            return{...state, s };
        case TYPING_SEARCH_BAR:
            return{...state, status:action.payload.loading};
        case INITIAL_RESULT:
            return { ...state, status:action.payload};
        default:
            return state;    
    }

}