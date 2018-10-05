import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  errorMessage: null,
  jobPosting: {}
}

const reducer = handleActions(
  {
    [actions.applySuccess]: (state, action) => ({
      ...state,
      errorMessage: action.payload
    }),
    [actions.applyFailure]: (state, action) => ({
      ...state,
      errorMessage: action.payload
    }),
    [actions.setJobPosting]: (state, action) => ({
      ...state,
      jobPosting: action.payload
    })
  },
  initialState
)

export default reducer