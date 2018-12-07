import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
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

function* requestLogout({ payload }) {
  try {
    window.localStorage.clear()

    yield put(actions.logoutSuccess(payload === true))
    yield put(push('/'))

    const oldPostings = yield select(getCurrentPostings)
    const filteredPostings
      = oldPostings.filter(posting => !posting.isHidden)

    yield put(actions.setJobPostings(filteredPostings))

  } catch (e) {
    yield put(actions.logoutFailure('Could not logout'))

  }
}

export const getCurrentPostings = state => state.jobPostingReducer.jobPostings

export const watchRequestLogin = takeLatest(actions.login().type, requestLogin)
export const watchRequestLogout = takeLatest(actions.logout().type, requestLogout)
