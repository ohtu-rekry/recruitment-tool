import { all } from 'redux-saga/effects'
import * as jobPostingSaga from './jobPostingSaga'
import * as postingSaga from './postingSaga'

export default function* rootSaga() {
  yield all([
    postingSaga.watchSendApplication,
    jobPostingSaga.watchFetchJobPosting,
    jobPostingSaga.watchFetchJobPostings
  ])
}