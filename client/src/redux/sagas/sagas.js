import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as jobPostingSaga from './jobPostingSaga'
import * as applicationSaga from './applicationSaga'
import * as generalSaga from './generalSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    generalSaga.watchFetchJobPostings,
    generalSaga.watchGetAllApplicants,
    jobPostingSaga.watchFetchJobPosting,
    jobPostingSaga.watchFetchJobPostingWithStages,
    jobPostingSaga.watchSubmitJobPosting,
    jobPostingSaga.watchFetchApplicants,
    jobPostingSaga.watchMoveJobPostingStage,
    applicationSaga.watchSendApplication,
    applicationSaga.watchMoveApplicant,
    applicationSaga.watchAddComment,
    applicationSaga.watchGetComments
  ])
}
