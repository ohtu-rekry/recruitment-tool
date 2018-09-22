import { createAction } from 'redux-actions'
import { create } from 'domain';

export const login = createAction('LOGIN', (username, password) => ({ username, password }))
export const loginSuccess = createAction('LOGIN_SUCCESS')
export const loginFailure = createAction('LOGIN_FAILURE')
export const logout = createAction('LOGOUT')

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail) => ({
    applicantName, applicantEmail
}))
export const applySuccess = create('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')
