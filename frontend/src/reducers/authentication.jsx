/**
 * Initial states for userReducer
 */
export const initialUserState = {
  isAuthenticated: false,
  user: {
    a: "a",
    b: "b",
  },
};


/**
 * Reducer to authenticate a user
 * @param {Object} userState Reducer states object
 * @param {Object} action Reducer actions object
 * @returns States objects depending of the actions object
 */
export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.user,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: null,
      }
    case "SET_AS_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: true,
      }
    case "UNSET_AS_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: false,
      }
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      }
    case "UNSET_USER":
      return {
        ...state,
        user: null,
      }
  }
};
