import { createAction } from 'redux-actions'

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