import { delay } from 'redux-saga'
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import jobPostingApi from '../apis/jobPostingApi'

function* addJobPosting({ payload }) {

  try {
    const jobPosting = {
      title: payload.title,
      content: payload.content,
      stages: payload.stages,
      startDate: payload.startDate,
      endDate: payload.endDate
    }
    const recruiter = payload.recruiter

    const response = yield call(jobPostingApi.add, { jobPosting, recruiter })

    if (response.status === 201) {
      yield put(actions.addJobPostingSuccess())
      yield call(fetchJobPostings)
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

function* addNewStageForJobPosting({ payload }) {
  yield put(actions.addNewStageForJobPosting(payload.newStage))
}

function* removeStageInJobPosting({ payload }) {
  yield put(actions.removeStageInJobPosting(payload.stage))
}

function* addStartDate({ payload }) {
  yield put(actions.addStartDate(payload.startDate))
}

function* addEndDate({ payload }) {
  yield put(actions.addEndDate(payload.endDate))
}

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)
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

function* copyStages({ payload }) {
  yield put(actions.copyStages(payload.stages))
}

function* clearCopiedStages() {
  yield put(actions.clearCopiedStages())
}

export const getCurrentUser = state => state.loginReducer.loggedIn

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)
export const watchFetchJobPosting = takeLatest(actions.fetchJobPosting().type, fetchJobPosting)
export const watchAddJobPosting = takeEvery(actions.addJobPosting().type, addJobPosting)
export const watchNewStageToJobPosting = takeEvery(actions.addNewStageForJobPosting().type, addNewStageForJobPosting)
export const watchRemoveStageInJobPosting = takeEvery(actions.removeStageInJobPosting().type, removeStageInJobPosting)
export const watchAddStartDate = takeEvery(actions.addStartDate().type, addStartDate)
export const watchAddEndDate = takeEvery(actions.addEndDate().type, addEndDate)
export const watchFetchApplicants = takeLatest(
  actions.fetchApplicants().type,
  fetchJobPostingApplicants
)
export const watchCopyStages = takeEvery(actions.copyStages().type, copyStages)
export const watchClearCopiedStages = takeEvery(actions.clearCopiedStages().type, clearCopiedStages)