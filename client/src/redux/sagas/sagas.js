import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as jobPostingSaga from './jobPostingSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    jobPostingSaga.watchFetchJobPostings
  ])
}