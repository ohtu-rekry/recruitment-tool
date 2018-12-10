import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const defaultStageNames = ['Applied', 'Accepted', 'Rejected']
const defaultStages = defaultStageNames.map((name) => ({ stageName: name, canRemove: false }))
const creationSuccessMessage = 'Job posting successfully added'

const initialState = {
  jobPostings: [],
  jobPostingStages: defaultStages,
  creationRequestStatus: null,
  showFrom: null,
  showTo: null,
  defaultStageNames,
  stageError: '',
  setTimespan: false
}

const reducer = handleActions(
  {
    [actions.setJobPostings]: (state, action) => ({
      ...state,
      jobPostings: action.payload
    }),
    [actions.copyJobPosting]: (state, action) => ({
      ...state,
      showFrom: action.payload.jobPosting.showFrom,
      showTo: action.payload.jobPosting.showTo,
      setTimespan: true,
      jobPostingStages: action.payload.stages
        .map((stage) => {
          const isRemovable = !defaultStageNames.includes(stage.stageName)
          return ({ stageName: stage.stageName, canRemove: isRemovable })
        })
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
    [actions.setStages]: (state, action) => ({
      ...state,
      jobPostingStages: action.payload.stages
        .map((stage) => {
          const isRemovable = !defaultStageNames.includes(stage.stageName)
                              && stage.jobApplications.length === 0
          return ({ ...stage, canRemove: isRemovable })
        })
    }),
    [actions.clearStages]: (state) => ({
      ...state,
      jobPostingStages: defaultStages
    }),
    [actions.renamePostingStage]: (state, action) => ({
      ...state,
      jobPostingStages: [...state.jobPostingStages.map(stage => {
        if (stage.stageName === action.payload.postingStage.stageName) {
          return { ...stage, stageName: action.payload.stageUnderEdit }
        }
        return stage
      })]
    }),
    [actions.setStageError]: (state, action) => ({
      ...state,
      stageError: action.payload.errorMessage
    }),
    [actions.addShowFrom]: (state, action) => ({
      ...state,
      showFrom: action.payload.showFrom
    }),
    [actions.addShowTo]: (state, action) => ({
      ...state,
      showTo: action.payload.showTo
    }),
    [actions.setTimeSpan]: (state, action) => ({
      ...state,
      showFrom: action.payload.showFrom,
      showTo: action.payload.showTo,
      setTimespan: true
    }),
    [actions.timespanHasBeenSet]: (state) => ({
      ...state,
      setTimespan: false
    }),
    [actions.clearShowFromAndShowTo]: (state, action) => ({
      ...state,
      showFrom: null,
      showTo: null
    })
  },
  initialState
)

export default reducer