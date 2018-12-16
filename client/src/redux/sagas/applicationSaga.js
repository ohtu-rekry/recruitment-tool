import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import * as selectors from '../selectors/selectors'
import jobApplicationApi from '../apis/jobApplicationApi'

function* sendApplication({ payload }) {
  try {
    const application = {
      applicantName: payload.applicantName,
      applicantEmail: payload.applicantEmail,
      jobPostingId: payload.jobPostingId,
      attachments: payload.attachments
    }
    const response = yield call(jobApplicationApi.add, application)

    if (response.status === 201) {
      yield put(actions.applySuccess())
    }
  } catch (e) {
    yield put(actions.applyFailure('Something went wrong, application not sent.'))
  }
}

function* moveApplicant({ payload }) {
  try {
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    const stages = yield select(selectors.getStages)

    const token = recruiter.token
    const { applicant, newStage, oldStage, oldIndex } = payload
    const data = {
      postingStageId: newStage,
      jobApplicationId: applicant
    }

    const oStage = stages.find(stage => stage.id === oldStage)
    const nStage = stages.find(stage => stage.id === newStage)

    let oldApplicants = Array.from(oStage.applicants)
    let newApplicants = Array.from(nStage.applicants)

    const iterated = oldApplicants.map(a =>
      (a.id === applicant) ?
        { ...a, updatedAt: (new Date()).toJSON() }
        : { ...a }
    )

    if (oldStage !== newStage) {
      const movedApplicant = iterated.splice(oldIndex, 1)[0]
      newApplicants.splice(0, 0, movedApplicant)
    }

    const reArrangedStages = stages.map(stage =>
      (stage.id === oldStage) ?
        { ...stage, applicants: iterated }
        : (stage.id === newStage) ?
          { ...stage, applicants: newApplicants }
          : { ...stage }
    )

    yield put(actions.updateStages(reArrangedStages))

    const response = yield call(jobApplicationApi.moveApplicants, { token, data })

    if (response.status === 200) {
      const jobPosting = yield select(selectors.getJobPosting)
      yield put(actions.fetchApplicants(jobPosting.id))
    }

  } catch (e) {
    console.log(e)
    yield put(actions.updateStages(payload.oldStages))
  }
}

function* addComment({ payload }) {
  try {
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    const data = {
      token: recruiter.token,
      applicationId: payload.applicationId,
      data: {
        comment: payload.comment,
        attachments: payload.attachments
      }
    }

    const response = yield call(jobApplicationApi.addComment, data)

    if (response.status === 201) {
      const stages = yield select(selectors.getStages)

      const newStages = stages.map(stage => {
        const commentedApplicant
          = stage.applicants
            .find(applicant =>
              applicant.id === payload.applicationId
            )

        let newStage = { ...stage }
        if (commentedApplicant) {
          const newApplicant = { ...commentedApplicant }
          newApplicant.applicationComments = newApplicant.applicationComments
            ? [...newApplicant.applicationComments, response.data]
            : [response.data]

          const notCommentedApplicants = [
            ...stage.applicants.filter(applicant =>
              applicant.id !== payload.applicationId)
          ]

          newStage.applicants = [...notCommentedApplicants, newApplicant]
        }
        return newStage
      })

      yield put(actions.updateStages(newStages))
      yield put(actions.getComments(payload.applicationId))
    }

  } catch (e) {
    console.log(e)
  }
}

function* getComments({ payload }) {
  try {
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    const data = {
      token: recruiter.token,
      id: payload
    }

    const response = yield call(jobApplicationApi.getComments, data)

    if (response.status === 200) {
      yield put(actions.getCommentsSuccess(response.data))
    }

  } catch (e) {
    console.log(e)
  }
}

export const watchMoveApplicant = takeLatest(actions.moveApplicant().type, moveApplicant)
export const watchSendApplication = takeLatest(actions.sendApplication().type, sendApplication)
export const watchAddComment = takeLatest(actions.addComment().type, addComment)
export const watchGetComments = takeLatest(actions.getComments().type, getComments)
