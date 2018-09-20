import { all } from 'redux-saga/effects'
import * as loginSaga from './loginSaga'

export default function* rootSaga() {
  yield all([
    loginSaga.watchRequestLogin,
    loginSaga.watchRequestLogout
  ])
}