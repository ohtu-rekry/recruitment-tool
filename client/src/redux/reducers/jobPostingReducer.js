import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  jobPostings: [],
  jobPostingStages: [{ stageName: 'Applied', canRemove: false }, { stageName: 'Accepted', canRemove: false }, { stageName: 'Rejected', canRemove: false }],
  creationRequestStatus: null,
  startDate: {},
  endDate: {}
}

const creationSuccessMessage = 'Job posting successfully added'

const reducer = handleActions(
  {
    [actions.setJobPostings]: (state, action) => ({
      ...state,
      jobPostings: action.payload
    }),
    [actions.addJobPostingSuccess]: (state, action) => ({
      ...state,
      creationRequestStatus: { message: creationSuccessMessage, type: 'success' }
    }),
    [actions.addJobPostingFailure]: (state, action) => (
      { ...state, creationRequestStatus: { ...action.payload, type: 'error' } }
    ),
    [actions.removeJobPostingCreationStatus]: (state, action) => (
      { ...state, creationRequestStatus: null }
    ),
    [actions.addNewStageForJobPosting]: (state, action) => ({
      jobPostingStages: [
        ...state.jobPostingStages.slice(0, state.jobPostingStages.length - 2),
        action.payload,
        ...state.jobPostingStages.slice(state.jobPostingStages.length - 2)
      ]
    }),
    [actions.removeStageInJobPosting]: (state, action) => ({
      jobPostingStages: [...state.jobPostingStages.filter(state => state !== action.payload)]
    }),
    [actions.addStartDate]: (state, action) => ({
      ...state,
      startDate: action.payload
    }),
    [actions.addEndDate]: (state, action) => ({
      ...state,
      endDate: action.payload
    })
  },
  initialState
)


export default reducer