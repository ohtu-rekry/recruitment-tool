import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  errorMessage: null,
  loginError: '',
  logoutError: null,
  stageError: '',
}

const errorReducer = handleActions(
  {
    [actions.loginSuccess]: (state, action) => ({
      ...state,
      loginError: null
    }),
    [actions.loginFailure]: (state, action) => ({
      ...state,
      loginError: action.payload
    }),
    [actions.logoutFailure]: (state, action) => ({
      ...state,
      logoutError: action.payload
    }),
    [actions.setStageError]: (state, action) => ({
      ...state,
      stageError: action.payload.errorMessage
    }),
    [actions.applyFailure]: (state, action) => ({
      ...state,
      errorMessage: action.payload
    }),
    [actions.clearErrorMessage]: (state, action) => ({
      ...state,
      errorMessage: null
    }),
  },
  initialState
)

export default errorReducer