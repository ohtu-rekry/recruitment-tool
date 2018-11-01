import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import jobApplicationApi from '../apis/jobApplicationApi'

function* sendApplication({ payload }) {
  try {
    const application = {
      applicantName: payload.applicantName,
      applicantEmail: payload.applicantEmail,
      jobPostingId: payload.jobPostingId
    }
    const response = yield call(jobApplicationApi.add, application)

    if (response.status === 200) {
      yield put(actions.applySuccess('Application sent succesfully'))
    }
  } catch (e) {
    yield put(actions.applyFailure('Something went wrong, application not sent.'))
  }
}

function* moveApplicant({ payload }) {
  try {
    console.log(payload)
    
    const recruiter = yield select(getCurrentUser)
    const jobPosting = yield select(getCurrentJobPosting)
    const token = recruiter.token
    const applicant = payload.applicant.id
    const newStage = payload.newStage.id
    const data = {
      postingStageId: newStage,
      jobApplicationId: applicant
    }

    const response = yield call(jobApplicationApi.moveApplicants, { token, data })
    console.log('resp: ', response)
    
    yield put(actions.fetchApplicants(jobPosting.id))
  } catch (e) {
    console.log(e)
  }
}

export const getCurrentUser = state => state.loginReducer.loggedIn
export const getCurrentJobPosting = state => state.postingReducer.jobPosting

export const watchMoveApplicant = takeLatest(actions.moveApplicant().type, moveApplicant)
export const watchSendApplication = takeLatest(actions.sendApplication().type, sendApplication)