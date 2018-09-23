
import { all, call } from 'redux-saga/effects'
import * as createJobPostingSaga from './jobPostingSaga'

export default function* rootSaga() {
  yield all([
    call(createJobPostingSaga.watchCreationRequest)
  ])
}
