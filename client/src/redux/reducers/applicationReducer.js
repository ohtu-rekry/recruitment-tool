import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  applicationSuccessful: false,
  comments: []
}

const reducer = handleActions(
  {
    [actions.applySuccess]: (state, action) => ({
      ...state,
      applicationSuccessful: true
    }),
    [actions.applyFailure]: (state, action) => ({
      ...state,
      applicationSuccessful: false
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
      applicationSuccessful: false
    })
  },
  initialState
)

export default reducer