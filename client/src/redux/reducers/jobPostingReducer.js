import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const defaultStages = [{ stageName: 'Applied', canRemove: false }, { stageName: 'Accepted', canRemove: false }, { stageName: 'Rejected', canRemove: false }]
const creationSuccessMessage = 'Job posting successfully added'

const initialState = {
  jobPostings: [],
  jobPostingStages: defaultStages,
  creationRequestStatus: null,
  copiedStages: null,
  showFrom: {},
  showTo: {}
}

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
    [actions.addJobPostingFailure]: (state, action) => ({
      ...state, creationRequestStatus: { ...action.payload, type: 'error' }
    }),
    [actions.removeJobPostingStatus]: (state, action) => ({
      ...state, creationRequestStatus: null
    }),
    [actions.addNewStageForJobPosting]: (state, action) => ({
      ...state,
      jobPostingStages: [
        ...state.jobPostingStages.slice(0, state.jobPostingStages.length - 2),
        action.payload,
        ...state.jobPostingStages.slice(state.jobPostingStages.length - 2)
      ]
    }),
    [actions.removeStageInJobPosting]: (state, action) => ({
      ...state,
      jobPostingStages: [...state.jobPostingStages.filter(state => state !== action.payload)]
    }),
    [actions.copyStages]: (state, action) => ({
      ...state,
      jobPostingStages: defaultStages,
      copiedStages: action.payload.stages
    }),
    [actions.clearCopiedStages]: (state, action) => ({
      ...state,
      copiedStages: null
    }),
    [actions.setStages]: (state, action) => ({
      ...state,
      jobPostingStages: action.payload.stages
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((stage) => {
          const defaultStageNames = defaultStages.map(stage => stage.stageName)
          const isNotDefaultStage = !defaultStageNames.includes(stage.stageName)
          return ({ ...stage, canRemove: isNotDefaultStage })
        }),
    }),
    [actions.clearStages]: (state, action) => ({
      ...state,
      jobPostingStages: defaultStages
    }),
    [actions.addShowFrom]: (state, action) => ({
      ...state,
      showFrom: action.payload
    }),
    [actions.addShowTo]: (state, action) => ({
      ...state,
      showTo: action.payload
    })
  },
  initialState
)

export default reducer