import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as jobPostingSaga from './jobPostingSaga'
import * as applicationSaga from './applicationSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    applicationSaga.watchSendApplication,
    jobPostingSaga.watchFetchJobPosting,
    jobPostingSaga.watchFetchJobPostings
  ])
}