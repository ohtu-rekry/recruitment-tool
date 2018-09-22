import { createAction } from 'redux-actions'
import { create } from 'domain';

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail) => ({
    applicantName, applicantEmail
}))
export const applySuccess = create('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')