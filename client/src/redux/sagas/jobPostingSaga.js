import { delay } from 'redux-saga'
import { takeEvery, put, call } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import jobPostingApi from '../apis/jobPostingApi'

function* creationRequest({ payload }) {

  try {
    const jobPosting = {
      title : payload.title,
      content : payload.content
    }
    const recruiter = payload.recruiter
    
    const response = yield call(jobPostingApi.add, { jobPosting, recruiter })

    if(response.status === 201) {
      const jobPostingWithRecruiter = response.data

      yield put(actions.addJobPostingSuccess(jobPostingWithRecruiter))
      yield delay(5000)
      yield put(actions.removeJobPostingCreationStatus())
    }
  }
  catch(error) {
    const errorMessage = error.message + (error.response ? '. ' + error.response.data.error : '')

    yield put(actions.addJobPostingFailure({ message : errorMessage }))
    yield delay(5000)
    yield put(actions.removeJobPostingCreationStatus())
  }
}

export const watchCreationRequest = takeEvery(actions.addJobPosting().type, creationRequest)
