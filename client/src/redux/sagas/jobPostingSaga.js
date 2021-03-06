import { delay } from 'redux-saga'
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import * as selectors from '../selectors/selectors'
import jobPostingApi from '../apis/jobPostingApi'

function* submitJobPosting({ payload }) {

  try {
    const jobPosting = {
      title: payload.title,
      content: payload.content,
      stages: payload.stages,
      showFrom: payload.showFrom,
      showTo: payload.showTo
    }
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    jobPosting.showFrom = jobPosting.showFrom
      ? new Date(jobPosting.showFrom).toJSON() : null
    jobPosting.showTo = jobPosting.showTo
      ? new Date(jobPosting.showTo).toJSON() : null

    const id = payload.id

    let response
    switch (payload.mode) {
      case 'create':
        response = yield call(jobPostingApi.add, { jobPosting, recruiter })
        break
      case 'edit':
        response = yield call(jobPostingApi.edit, { jobPosting, recruiter, id })
        break
      default:
        throw new Error('Job posting mode is neither create nor edit')
    }

    if (response.status === 201 || response.status === 200) {
      yield put(actions.addJobPostingSuccess())
      yield put(actions.fetchJobPostings())
      yield delay(5000)
      yield put(actions.removeJobPostingStatus())
    }
  }
  catch (error) {
    const errorMessage = error.message + (error.response ? '. ' + error.response.data.error : '')

    yield put(actions.addJobPostingFailure({ message: errorMessage }))
    yield delay(5000)
    yield put(actions.removeJobPostingStatus())
  }
}

function* fetchJobPosting({ payload }) {
  try {
    const recruiter = yield select(selectors.getUser)
    const token = recruiter ? recruiter.token : null
    const id = payload.postingId

    const response = yield call(jobPostingApi.getOne, { id, token })

    if (response.status === 200) {
      const jobPosting = response.data

      yield put(actions.setJobPosting(jobPosting))
    }
  }
  catch (e) {
    console.log(e)
  }
}

function* fetchJobPostingWithStages({ payload }) {
  try {
    yield delay(10)
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    const token = recruiter.token
    const id = payload.id

    const response = yield call(jobPostingApi.getOne, { id, token })

    if (response.status === 200) {
      const jobPosting = response.data

      const newJobPosting = {
        ...jobPosting,
        postingStages: null
      }
      yield put(actions.setJobPosting(newJobPosting))

      const stages = [...jobPosting.postingStages]
      stages.sort((a, b) => a.orderNumber - b.orderNumber)
      yield put(actions.setStages(stages))

      yield put(actions.setTimeSpan(jobPosting.showFrom, jobPosting.showTo))
    }

  } catch (error) {
    const errorMessage = 'Could not fetch job posting. '
      + error.message
      + (error.response ? '. ' + error.response.data.error : '')

    yield put(actions.addJobPostingFailure({ message: errorMessage }))
    yield delay(5000)
    yield put(actions.removeJobPostingStatus())
  }
}

function* fetchJobPostingApplicants({ payload }) {
  try {
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    const token = recruiter.token
    const id = payload
    const response = yield call(jobPostingApi.getApplicants, { token, id })

    if (response.status === 200) {
      const jobApplicants = response.data
      yield put(actions.updateStages(jobApplicants))
    }
  }
  catch (e) {
    console.log(e)
  }
}

function* updateJobPostingStages({ payload }) {
  try {
    const recruiter = yield select(selectors.getUser)
    const stages = yield select(selectors.getStages)
    const posting = yield select(selectors.getJobPosting)

    /*
    First remove the moved stage from old index with splice.
    Then move it to its new index, again with splice.
    */
    let newStageOrder = Array.from(stages)
    const movedStage = newStageOrder.splice(payload.oldIndex, 1)[0]
    newStageOrder.splice(payload.newIndex, 0, movedStage)

    /*
    Because stages are sorted by orderNumber, change orderNumbers to match new order.
    */

    const reOrderedStages = newStageOrder.map((stage, index) => {
      return { ...stage, orderNumber: index }
    })

    yield put(actions.updateStages(reOrderedStages))

    const jobPosting = { ...posting, stages: reOrderedStages }
    delete jobPosting.isHidden
    delete jobPosting.postingStages

    jobPosting.showFrom = jobPosting.showFrom
      ? new Date(jobPosting.showFrom).toJSON() : null
    jobPosting.showTo = jobPosting.showTo
      ? new Date(jobPosting.showTo).toJSON() : null

    const response = yield call(
      jobPostingApi.edit,
      { jobPosting, recruiter, id: posting.id }
    )

    if (response.status === 200) {
      yield put(actions.fetchApplicants(posting.id))
    }
  }
  catch (e) {
    console.log(e)
    yield put(actions.updateStages(payload.oldStages))
  }
}

export const watchFetchJobPosting = takeLatest(actions.fetchJobPosting().type, fetchJobPosting)
export const watchFetchJobPostingWithStages = takeLatest(actions.fetchJobPostingWithStages().type, fetchJobPostingWithStages)
export const watchSubmitJobPosting = takeEvery(actions.submitJobPosting().type, submitJobPosting)
export const watchMoveJobPostingStage = takeEvery(actions.moveStage().type, updateJobPostingStages)
export const watchFetchApplicants = takeEvery(
  actions.fetchApplicants().type,
  fetchJobPostingApplicants
)
