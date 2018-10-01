import { createAction } from 'redux-actions'

export const login = createAction('LOGIN', (username, password) => ({ username, password }))
export const loginSuccess = createAction('LOGIN_SUCCESS')
export const loginFailure = createAction('LOGIN_FAILURE')
export const logout = createAction('LOGOUT')
export const logoutSuccess = createAction('LOGOUT_SUCCESS')
export const logoutFailure = createAction('LOGOUT_FAILURE')

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail) => ({
    applicantName, applicantEmail
  }))

export const fetchJobPosting = createAction(
  'FETCH_JOBPOSTING', (postingId) => ({
    postingId
  }))
export const setJobPosting = createAction('SET_JOBPOSTING')

export const applySuccess = createAction('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')
export const fetchJobPostings = createAction('FETCH_JOBPOSTINGS')
export const setJobPostings = createAction('SET_JOBPOSTINGS')
