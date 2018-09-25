import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  jobPostings: []
}

const reducer = handleActions(
  {
    [actions.setJobPostings]: (state, action) => ({
      ...state,
      jobPostings: action.payload
    })
  },
  initialState
)

export default reducer