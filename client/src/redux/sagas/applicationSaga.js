import { call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import jobApplicationApi from '../apis/jobApplicationApi'

function* sendApplication({ payload }) {
  try {
    const application = {
      applicantName: payload.applicantName,
      applicantEmail: payload.applicantEmail
    }
    const response = yield call(jobApplicationApi.add, application)

    if (response.status === 200) {
      yield put(actions.applySuccess('Application sent succesfully'))
    }
  } catch (e) {
    yield put(actions.applyFailure('Something went wrong, application not sent.'))
  }
}

export const watchSendApplication = takeLatest(actions.sendApplication().type, sendApplication)