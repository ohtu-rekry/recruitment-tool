import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  errorMessage: null,
  jobPosting: {},
  stages: []
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
    }),
    [actions.emptyJobPosting]: (state) => ({
      ...state,
      jobPosting: { },
      stages: []
    }),
    [actions.fetchApplicantsSuccess]: (state, action) => (
      {
        ...state,
        stages: action.payload
      }
    ),
    [actions.moveApplicantSuccess]: (state, action) => (
      {
        ...state,
        stages: action.payload
      }
    )
  },
  initialState
)

export default reducer