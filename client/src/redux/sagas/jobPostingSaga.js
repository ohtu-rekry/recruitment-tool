import { delay } from 'redux-saga'
import { takeLatest, takeEvery, put, call } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import jobPostingApi from '../apis/jobPostingApi'

function* creationRequest({ payload }) {

  try {
    const jobPosting = {
      title: payload.title,
      content: payload.content
    }
    const recruiter = payload.recruiter

    const response = yield call(jobPostingApi.add, { jobPosting, recruiter })

    if (response.status === 201) {
      const jobPostingWithRecruiter = response.data

      yield put(actions.addJobPostingSuccess(jobPostingWithRecruiter))
      yield delay(5000)
      yield put(actions.removeJobPostingCreationStatus())
    }
  }
  catch (error) {
    const errorMessage = error.message + (error.response ? '. ' + error.response.data.error : '')

    yield put(actions.addJobPostingFailure({ message: errorMessage }))
    yield delay(5000)
    yield put(actions.removeJobPostingCreationStatus())
  }
}

function* fetchJobPostings() {
  try {
    const response = yield call(jobPostingApi.get)

    if (response.status === 200) {
      yield put(actions.setJobPostings(response.data))
    }
  } catch (e) {
    console.log('Could not fetch job postings')
  }
}

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)
export const watchCreationRequest = takeEvery(actions.addJobPosting().type, creationRequest)
