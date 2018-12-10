import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  errorMessage: null,
  applicationSuccessful: false,
  jobPosting: {},
  stages: [],
  applicants: [],
  comments: [],
  attachments: []
}

const reducer = handleActions(
  {
    [actions.applySuccess]: (state, action) => ({
      ...state,
      applicationSuccessful: true
    }),
    [actions.applyFailure]: (state, action) => ({
      ...state,
      errorMessage: action.payload,
      applicationSuccessful: false
    }),
    [actions.setJobPosting]: (state, action) => ({
      ...state,
      jobPosting: action.payload
    }),
    [actions.copyJobPosting]: (state, action) => ({
      ...state,
      jobPosting: action.payload.jobPosting
    }),
    [actions.emptyJobPosting]: (state) => ({
      ...state,
      jobPosting: {},
      stages: []
    }),
    [actions.fetchApplicantsSuccess]: (state, action) => ({
      ...state,
      stages: action.payload
    }),
    [actions.getApplicantsSuccess]: (state, action) => ({
      ...state,
      stages: action.payload
    }),
    [actions.addCommentSuccess]: (state, action) => ({
      ...state,
      stages: action.payload
    }),
    [actions.getCommentsSuccess]: (state, action) => ({
      ...state,
      comments: action.payload
    }),
    [actions.emptyComments]: (state, action) => ({
      ...state,
      comments: []
    }),
    [actions.clearErrorMessage]: (state, action) => ({
      ...state,
      errorMessage: null,
      applicationSuccessful: false
    }),
    [actions.moveStageSuccess]: (state, action) => ({
      ...state,
      stages: action.payload
    }),
  },
  initialState
)

export default reducer