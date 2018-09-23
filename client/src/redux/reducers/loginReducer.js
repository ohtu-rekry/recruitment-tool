import { handleActions } from 'redux-actions'

const initialState = { loggedIn: 'yup' }

const reducer = handleActions(
  {},
  initialState
)

export default reducer