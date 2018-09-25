import { handleActions } from 'redux-actions'

const initialState = { loggedIn: { username: 'test-name', token: 'test-token' } }

const reducer = handleActions(
  {},
  initialState
)

export default reducer