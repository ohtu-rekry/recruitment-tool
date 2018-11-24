import { delay } from 'redux-saga'
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import jobPostingApi from '../apis/jobPostingApi'

function* submitJobPosting({ payload }) {

  try {
    /* const jobPosting = {
      title: payload.title,
      content: payload.content,
      stages: payload.stages,
      showFrom: payload.showFrom,
      showTo: payload.showTo
    } */
    const jobPosting = {
      title: payload.title,
      content: payload.content,
      stages: payload.stages
    }
    const recruiter = payload.recruiter
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
      yield call(fetchJobPostings)
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

function* addNewStageForJobPosting({ payload }) {
  yield put(actions.addNewStageForJobPosting(payload.newStage))
}

function* removeStageInJobPosting({ payload }) {
  yield put(actions.removeStageInJobPosting(payload.stage))
}

function* fetchJobPosting({ payload }) {
  try {
    const response = yield call(jobPostingApi.get)

    if (response.status === 200) {
      const postingId = parseInt(payload.postingId, 10)
      let jobPosting = response.data.find(posting => posting.id === postingId)
      if (!jobPosting) jobPosting = { id: 1, title: 'Junior fullstack developer', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a nulla eget elit eleifend tristique. Aenean placerat urna sit amet turpis consequat, placerat rhoncus neque sollicitudin. Aliquam cursus ornare tortor in suscipit. Proin eu mauris augue. Praesent efficitur bibendum magna, sit amet rutrum turpis vehicula non. Integer vehicula pellentesque pharetra. Nunc eleifend erat eget velit dignissim, eget vehicula nisl venenatis. Nunc aliquam sit amet purus eu imperdiet. Sed nibh magna, lobortis laoreet dolor ut, dapibus pellentesque justo. Phasellus venenatis vehicula neque sed lacinia. Integer facilisis bibendum cursus.Mauris dictum porta arcu, dapibus mattis lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis posuere ullamcorper consectetur. Vivamus tincidunt quam vitae massa dapibus, sed accumsan mauris tempor. Integer nec urna eget tellus facilisis vulputate. Cras mattis libero nulla, quis sagittis urna mattis at. Integer ultrices mauris molestie maximus consequat. Aenean dolor mi, luctus id nulla et, pellentesque semper nisi. Sed rutrum, lectus vitae ullamcorper imperdiet, ipsum massa tincidunt metus, ut malesuada justo urna eu nisi. Integer est quam, luctus a massa in, gravida lacinia metus. Aenean enim felis, rhoncus nec suscipit vitae, eleifend ac nunc. Sed id libero quis mi fermentum cursus et laoreet velit.' }
      yield put(actions.setJobPosting(jobPosting))
    }
  }
  catch (e) {
    const jobPosting = { id: 1, title: 'Junior fullstack developer', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a nulla eget elit eleifend tristique. Aenean placerat urna sit amet turpis consequat, placerat rhoncus neque sollicitudin. Aliquam cursus ornare tortor in suscipit. Proin eu mauris augue. Praesent efficitur bibendum magna, sit amet rutrum turpis vehicula non. Integer vehicula pellentesque pharetra. Nunc eleifend erat eget velit dignissim, eget vehicula nisl venenatis. Nunc aliquam sit amet purus eu imperdiet. Sed nibh magna, lobortis laoreet dolor ut, dapibus pellentesque justo. Phasellus venenatis vehicula neque sed lacinia. Integer facilisis bibendum cursus.Mauris dictum porta arcu, dapibus mattis lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis posuere ullamcorper consectetur. Vivamus tincidunt quam vitae massa dapibus, sed accumsan mauris tempor. Integer nec urna eget tellus facilisis vulputate. Cras mattis libero nulla, quis sagittis urna mattis at. Integer ultrices mauris molestie maximus consequat. Aenean dolor mi, luctus id nulla et, pellentesque semper nisi. Sed rutrum, lectus vitae ullamcorper imperdiet, ipsum massa tincidunt metus, ut malesuada justo urna eu nisi. Integer est quam, luctus a massa in, gravida lacinia metus. Aenean enim felis, rhoncus nec suscipit vitae, eleifend ac nunc. Sed id libero quis mi fermentum cursus et laoreet velit.' }
    yield put(actions.setJobPosting(jobPosting))
    console.log(e)
  }
}

function* fetchJobPostingWithStages({ payload }) {
  try {
    const recruiter = yield select(getCurrentUser)
    const token = recruiter.token
    const id = payload.id

    const response = yield call(jobPostingApi.getOne, { id, token })

    if (response.status === 200) {
      const jobPosting = response.data
      yield put(actions.setJobPosting(jobPosting))
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
    const recruiter = yield select(getCurrentUser)
    const token = recruiter.token
    const id = payload
    const response = yield call(jobPostingApi.getApplicants, { token, id })

    if (response.status === 200) {
      const jobApplicants = response.data
      yield put(actions.fetchApplicantsSuccess(jobApplicants))
    }
  }
  catch (e) {
    console.log(e)
  }
}

export const getCurrentUser = state => state.loginReducer.loggedIn

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)
export const watchFetchJobPosting = takeLatest(actions.fetchJobPosting().type, fetchJobPosting)
export const watchFetchJobPostingWithStages = takeLatest(actions.fetchJobPostingWithStages().type, fetchJobPostingWithStages)
export const watchSubmitJobPosting = takeEvery(actions.submitJobPosting().type, submitJobPosting)
export const watchNewStageToJobPosting = takeEvery(actions.addNewStageForJobPosting().type, addNewStageForJobPosting)
export const watchRemoveStageInJobPosting = takeEvery(actions.removeStageInJobPosting().type, removeStageInJobPosting)
export const watchFetchApplicants = takeLatest(
  actions.fetchApplicants().type,
  fetchJobPostingApplicants
)
