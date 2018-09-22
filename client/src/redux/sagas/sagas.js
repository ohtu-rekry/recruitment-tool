import { all } from 'redux-saga/effects'
import * as postingSaga from './postingSaga'

export default function* rootSaga() {
  yield all([
    postingSaga.watchSendApplication
  ])
}