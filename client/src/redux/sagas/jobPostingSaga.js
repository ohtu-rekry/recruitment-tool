import { call, put, takeLatest } from 'redux-saga/effects'
import * as actions from '../actions/actions'

import JobPostingApi from '../apis/jobPostingApi'

function* fetchJobPostings() {
  try {
    const response = yield call(JobPostingApi.get)

    if (response.status === 200) {
      yield put(actions.setJobPostings(response.data))
    }
  } catch (e) {
    console.log('Could not fetch job postings')
  }
}

function* fetchJobPosting({ payload }) {
  try {
    const response = yield call(JobPostingApi.get)

    if (response.status === 200) {
      const jobPosting = response.data.filter(posting => posting.id === payload.id)
      yield put(actions.setJobPosting(jobPosting))
    }
  }
  catch (e) {
    const jobPosting = { id: 1, title: 'Junior fullstack developer', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a nulla eget elit eleifend tristique. Aenean placerat urna sit amet turpis consequat, placerat rhoncus neque sollicitudin. Aliquam cursus ornare tortor in suscipit. Proin eu mauris augue. Praesent efficitur bibendum magna, sit amet rutrum turpis vehicula non. Integer vehicula pellentesque pharetra. Nunc eleifend erat eget velit dignissim, eget vehicula nisl venenatis. Nunc aliquam sit amet purus eu imperdiet. Sed nibh magna, lobortis laoreet dolor ut, dapibus pellentesque justo. Phasellus venenatis vehicula neque sed lacinia. Integer facilisis bibendum cursus.Mauris dictum porta arcu, dapibus mattis lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis posuere ullamcorper consectetur. Vivamus tincidunt quam vitae massa dapibus, sed accumsan mauris tempor. Integer nec urna eget tellus facilisis vulputate. Cras mattis libero nulla, quis sagittis urna mattis at. Integer ultrices mauris molestie maximus consequat. Aenean dolor mi, luctus id nulla et, pellentesque semper nisi. Sed rutrum, lectus vitae ullamcorper imperdiet, ipsum massa tincidunt metus, ut malesuada justo urna eu nisi. Integer est quam, luctus a massa in, gravida lacinia metus. Aenean enim felis, rhoncus nec suscipit vitae, eleifend ac nunc. Sed id libero quis mi fermentum cursus et laoreet velit.' }
    yield put(actions.setJobPosting(jobPosting))
    console.log(e)
  }
}

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)
export const watchFetchJobPosting = takeLatest(actions.fetchJobPosting().type, fetchJobPosting)