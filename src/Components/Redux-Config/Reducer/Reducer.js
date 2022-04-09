import './Reducer.css';
import { HEADER, CLEAR, REQUEST, SUCCESS, FAILURE, LOGIN_USER_INFO, LOGIN_AUTH_TOKEN, LOGIN_CLEAR, ACCESS_SECURITY } from '../Action/ActionType';
const initialState = {
  swipPanel :{
    head : false,
    sidepan:false
  },
  auth_token:localStorage.getItem('AUTH_TOKEN'),
  user_id:localStorage.getItem('USER_ID'),
  user_info:localStorage.getItem('USER_INFO'),
  user_email:localStorage.getItem('USER_EMAIL'),
  menucode:null,
  menuData:'',
  access_security:''
};

const initialApi = {
  loading: false,
  apiData:[],
  error:''
};
export const Reducers = (state = initialState, action) => {
  switch (action.type){
    case HEADER:
      return Object.assign({}, state, {
        swipPanel: action.payload
      });
    case CLEAR:
      return Object.assign({}, state, {
        swipPanel: ['NOT APPLICABLE']
      });
    case LOGIN_USER_INFO:
      return{
          ...state,
          user_info:JSON.stringify(action.payload),
          user_id:action.payload.user_id,
          user_email:action.payload.user_email
      }
    case LOGIN_AUTH_TOKEN:
      return{
          ...state,
          auth_token:action.payload,
      }
    case LOGIN_CLEAR:
      return {
        ...state,
        user_info: "",
        user_id: "",
        user_email: ""
      }
    case 'MENUCODE':
      return {
        ...state,
        menucode: action.payload,
      }
    case 'MENUDATA':
      return {
        ...state,
        menuData: action.payload,
      }
    case ACCESS_SECURITY:
      return {
        ...state,
        access_security: action.payload,
      }
    default:
      return state;
    }
};

export const serverApiReducer = (state = initialApi, action) => {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        apiData: action.payload,
        error: ''
      });
    case FAILURE:
      return Object.assign({}, state, {
        loading: false,
        apiData: [],
        error: action.payload
      });
    default:
      return state;
  }
};

// export default Reducer;