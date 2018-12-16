import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  jobPostings: [],
  stages: []
}

const reducer = handleActions(
  {
    [actions.setJobPostings]: (state, action) => ({
      ...state,
      jobPostings: action.payload
    }),
    [actions.updateStages]: (state, action) => ({
      ...state,
      stages: action.payload
    }),
    [actions.emptyJobPosting]: (state, action) => ({
      ...state,
      stages: []
    }),
  },
  initialState
)

export default reducer