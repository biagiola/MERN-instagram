export const initialState = {
  userName: null,
}

// if there is and user's value in the storage
const data = JSON.parse(localStorage.getItem('user'))
if (data) {
  console.log('reducer data user', data)
  initialState.user = data
}

export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_USER_LOCALSTORAGE: 'SET_USER_LOCALSTORAGE'
}

const reducer = (state, action) => {

  console.log(action)

  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        userName: action.user
      }

    case actionTypes.SET_USER_LOCALSTORAGE:
      return {
        user: action.user
      }

    default:
      return state
  }
}

export default reducer