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

function* getApplicants() {
  try {
    const recruiter = yield select(getCurrentUser)
    const token = recruiter.token

    const response = yield call(jobApplicationApi.get, { token })
    let stages = []
    if (response.status === 200) {
      response.data.forEach(applicant => {
        stages = [
          ...stages,
          {
            id: applicant.PostingStage.id,
            jobPostingId: applicant.PostingStage.jobPostingId,
            orderNumber: applicant.PostingStage.orderNumber,
            stageName: applicant.PostingStage.stageName,
            applicants: [{
              id: applicant.id,
              postingStageId: applicant.postingStageId,
              applicantEmail: applicant.applicantEmail,
              applicantName: applicant.applicantName,
              createdAt: applicant.createdAt,
              jobPosting: applicant.PostingStage.JobPosting.title
            }]
          }
        ]
      })
      /*
      Returns an array of unique stages.
      First checks final results array res for a Stage object with identical name.
      If there isn't one, it adds the stage to the final array. If there is,
      it finds that stage object and combines applicants from that and the stage with
      identical name.
      */
      const uniqueStages = stages.reduce((res, stg) => {
        let result = res.find(stage =>
          stage.stageName.toLowerCase().trim() === stg.stageName.toLowerCase().trim()
        )
        if(!result) return res.concat(stg)
        const index = res.findIndex(existingStage =>
          existingStage.stageName.toLowerCase().trim() === stg.stageName.toLowerCase().trim()
        )
        res[index].applicants = [...res[index].applicants, ...stg.applicants]
        return res
      }, [])

      /*
      Sorts unique stages based on their order number.
      Makes sure Accepted and Rejected stages are shown last.
      */
      const sortedUniqueStages = uniqueStages.map(stage => {
        const highestOrderNumber = uniqueStages.reduce((a, b) =>
          a.orderNumber > b.orderNumber ? a.orderNumber : b.orderNumber
        )

        if (stage.stageName === 'Rejected') {
          return { ...stage, orderNumber: highestOrderNumber + 2 }
        } else if (stage.stageName === 'Accepted') {
          return { ...stage, orderNumber: highestOrderNumber + 1 }
        }
        return stage
      })

      yield put(actions.getApplicantsSuccess(sortedUniqueStages))
    }

  } catch (e) {
    console.log(e)
  }
}

function* addComment({ payload }) {
  try {
    const recruiter = yield select(getCurrentUser)
    const data = {
      token: recruiter.token,
      applicationId: payload.applicationId,
      data: { comment: payload.comment }
    }

    const response = yield call(jobApplicationApi.addComment, data)

    if (response.status === 201) {
      const stages = yield select(getStages)

      const newStages = stages.map(stage => {
        const commentedApplicant = {
          ...stage.applicants.find(applicant =>
            applicant.id === payload.applicationId
          )
        }

        if (commentedApplicant) {
          commentedApplicant.comments = commentedApplicant.comments
            ? [ ...commentedApplicant.comments, response.data ]
            : []
        }
        return stage
      })

      yield put(actions.addCommentSuccess(newStages))
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
export const watchGetApplicants = takeLatest(actions.getApplicants().type, getApplicants)
export const watchAddComment = takeLatest(actions.addComment().type, addComment)