import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as jobPostingSaga from './jobPostingSaga'
import * as postingSaga from './postingSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    postingSaga.watchSendApplication,
    postingSaga.watchSendApplication,
    jobPostingSaga.watchFetchJobPosting,
    jobPostingSaga.watchFetchJobPostings
  ])
}