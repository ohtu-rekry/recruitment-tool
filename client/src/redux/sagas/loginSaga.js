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
      const recruiter = response.data
      const username = recruiter.username
      const token = recruiter.token
      window.localStorage.setItem('loggedUser', JSON.stringify(recruiter))
      console.log(recruiter)
      yield put(actions.loginSuccess({ username: username, token: token }))
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