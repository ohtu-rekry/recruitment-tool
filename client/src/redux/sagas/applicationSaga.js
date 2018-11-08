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
    const recruiter = yield select(getCurrentUser)
    const token = recruiter.token
    const applicant = payload.applicant
    const newStage = payload.newStage
    const data = {
      postingStageId: newStage.id,
      jobApplicationId: applicant.id
    }

    const response = yield call(jobApplicationApi.moveApplicants, { token, data })

    if (response.status === 200) {
      const stages = yield select(getStages)
      const filteredStages = stages.map(stage => (
        { ...stage, applicants: stage.applicants.filter(a => a.id !== applicant.id) }
      ))
      const finalStages = filteredStages.map(stage => (stage.id === newStage.id) ?
        { ...stage, applicants: [...stage.applicants, applicant] }
        : { ...stage }
      )
      yield put(actions.moveApplicantSuccess(finalStages))
    }

  } catch (e) {
    console.log(e)
  }
}

export const getCurrentUser = state => state.loginReducer.loggedIn
export const getCurrentJobPosting = state => state.postingReducer.jobPosting
export const getStages = state => state.postingReducer.stages

export const watchMoveApplicant = takeLatest(actions.moveApplicant().type, moveApplicant)
export const watchSendApplication = takeLatest(actions.sendApplication().type, sendApplication)