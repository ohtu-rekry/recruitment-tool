import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  jobPostings: [],
  creationRequestStatus: null
}

const creationSuccessMessage = 'Job posting successfully added'

const reducer = handleActions(
  {
    [actions.setJobPostings]: (state, action) => ({
      ...state,
      jobPostings: action.payload
    }),
    [actions.addJobPostingSuccess]: (state, action) => ({
      jobPostings: [...state.jobPostings, action.payload],
      creationRequestStatus: { message: creationSuccessMessage, type: 'success' }
    }),
    [actions.addJobPostingFailure]: (state, action) => (
      { ...state, creationRequestStatus: { ...action.payload, type: 'error' } }
    ),
    [actions.removeJobPostingCreationStatus]: (state, action) => (
      { ...state, creationRequestStatus: null }
    )
  },
  initialState
)


export default reducer