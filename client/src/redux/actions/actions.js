import { createAction } from 'redux-actions'

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail) => ({
    applicantName, applicantEmail
  }))

export const applySuccess = createAction('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')