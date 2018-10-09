import { createAction } from 'redux-actions'

export const login = createAction('LOGIN', (username, password) => ({ username, password }))
export const loginSuccess = createAction('LOGIN_SUCCESS')
export const loginFailure = createAction('LOGIN_FAILURE')

export const logout = createAction('LOGOUT')
export const logoutSuccess = createAction('LOGOUT_SUCCESS')
export const logoutFailure = createAction('LOGOUT_FAILURE')

export const addJobPosting = createAction('ADD_JOB_POSTING', (title, content, recruiter) => ({ title, content, recruiter }))
export const addJobPostingSuccess = createAction('ADDED_JOB_POSTING')
export const addJobPostingFailure = createAction('ADD_JOB_POSTING_FAILED')
export const removeJobPostingCreationStatus = createAction('REMOVE_JOB_POSTING_CREATION_STATUS')

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail, jobPostingId) => ({
    applicantName, applicantEmail, jobPostingId
  }))

export const fetchJobPosting = createAction(
  'FETCH_JOBPOSTING', (postingId) => ({
    postingId
  }))
export const fetchJobPostings = createAction('FETCH_JOBPOSTINGS')
export const setJobPosting = createAction('SET_JOBPOSTING')
export const setJobPostings = createAction('SET_JOBPOSTINGS')
export const fetchApplicants = createAction('FETCH_APPLICANTS')
export const fetchApplicantsSuccess = createAction('FETCH_APPLICANTS_SUCCESS')

export const applySuccess = createAction('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')
