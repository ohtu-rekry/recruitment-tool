import { call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/actions'

import JobPostingAPI from '../apis/jobPostingApi'


function* fetchJobPostings() {
  try {
    const response = yield call(JobPostingAPI.get)

    if (response.status === 200) {
      yield put(actions.setJobPostings(response.data))
    }

  } catch (e) {
    console.log('Could not fetch job postings')
  }
}

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)