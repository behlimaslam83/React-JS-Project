import './Action.css';
import { HEADER, CLEAR, REQUEST, SUCCESS, FAILURE, LOGIN_CLEAR} from "./ActionType";

export const headerNav = (payload) => {
  return { type: HEADER, payload }
};
export const clearLogin = (payload) => {
  return { type: LOGIN_CLEAR, payload }
};
export const clearArticl = (payload) => {
  return { type: CLEAR, payload }
};
export const fetchRequest = () => {
  return {
    type: REQUEST,
  }
}

export const fetchResponse = (response) => {
  return {
    type: SUCCESS,
    payload: response
  }
}

export const errorHandler = (error) => {
  return {
    type: FAILURE,
    payload: error
  }
}