
const iState={
    auth_token:localStorage.getItem('AUTH_TOKEN'),
    user_id:localStorage.getItem('USER_ID'),
    user_info:localStorage.getItem('USER_INFO'),
    user_email:localStorage.getItem('USER_EMAIL')
}

const Reducer=(state=iState,action)=>{
    console.log(action);

    switch (action.type) {
        case 'USER_LOGIN_INFO':
            return{
                ...state,
                user_info:JSON.stringify(action.payload),
                user_id:action.payload.user_id,
                user_email:action.payload.user_email
            }
        case 'AUTH_INFO_TOKEN':
            return{
                ...state,
                auth_token:action.payload,
            }
            
        default:
            return state;
    }
}   
export default Reducer; 