import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'
import * as postingSaga from './postingSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout,
    postingSaga.watchSendApplication
  ])
}