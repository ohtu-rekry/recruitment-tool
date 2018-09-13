import { call, put, takeLatest, all } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import LoginAPI from '../apis/loginApi'

function* requestLogin({ payload }) {
  try {
    const user = {
      username: payload.username,
      password: payload.password
    }
    const response = yield call(LoginAPI.add, user)

    if (response.status === 200) {
      yield put(actions.loginSuccess())
    }
  } catch (e) {
    yield put(actions.loginFailure('Login failed'))
  }
}

const watchRequestLogin = takeLatest(actions.login().type, requestLogin)

export default function* rootSaga() {
  yield all([
    watchRequestLogin
  ])
}