import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as createJobPostingSaga from './jobPostingSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    createJobPostingSaga.watchCreationRequest
  ])
}
