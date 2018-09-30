import { call, put, takeLatest } from 'redux-saga/effects'
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
      const user = {
        token: response.data.token,
        username: response.data.username
      }
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      yield put(actions.loginSuccess(user))
    }

  } catch (e) {
    yield put(actions.loginFailure('Could not login. Wrong password or username.'))
  }
}

function* requestLogout() {
  try {
    window.localStorage.clear()
    yield put(actions.logoutSuccess())
  } catch (e) {
    yield put(actions.logoutFailure('Could not logout'))

  }
}

export const watchRequestLogin = takeLatest(actions.login().type, requestLogin)
export const watchRequestLogout = takeLatest(actions.logout().type, requestLogout)