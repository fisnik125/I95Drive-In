const INITIAL_STATE = {
  user: undefined,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGOUT':
      return {
        ...state,
        user: undefined,
      };

    case 'LOGIN':
      return {
        ...state,
        user: action.email,
      }

    default:
      return state;
  }
};

export default userReducer;
