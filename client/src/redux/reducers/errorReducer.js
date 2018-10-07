import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  loginError: ''
}

const errorReducer = handleActions(
  {
    [actions.loginFailure]: (state, action) => ({
      ...state,
      loginError: ''
    }),
  },
  initialState
)

export default errorReducer