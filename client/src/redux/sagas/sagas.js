import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as createJobPostingSaga from './jobPostingSaga'
import * as jobPostingSaga from './jobPostingSaga'
import * as applicationSaga from './applicationSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    createJobPostingSaga.watchCreationRequest,
    jobPostingSaga.watchFetchJobPostings,
    applicationSaga.watchSendApplication,
    jobPostingSaga.watchFetchJobPosting,
    jobPostingSaga.watchFetchJobPostings,
    jobPostingSaga.watchAddJobPosting
  ])
}
