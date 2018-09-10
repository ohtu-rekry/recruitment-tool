import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  status: '',
}

const reducer = handleActions(
  {
    [actions.sample]: (state, action) => ({
      ...state,
      status: action.payload
    }),
    [actions.secondSample]: (state, action) => ({
      ...state,
      status: action.payload.type1
    }),
  },
  initialState
)

export default reducer