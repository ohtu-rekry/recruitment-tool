import { createAction } from 'redux-actions'

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail, jobPostingId, attachments) => ({
    applicantName, applicantEmail, jobPostingId, attachments
  }))

export const applySuccess = createAction('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAILURE')

export const fetchApplicants = createAction('FETCH_APPLICANTS')

export const moveApplicant = createAction('MOVE_APPLICANT', (applicant, newStage, oldStage, oldIndex, oldStages) => ({ applicant, newStage, oldStage, oldIndex, oldStages }))

export const addComment = createAction('ADD_COMMENT', (comment, applicationId, attachments) => ({ comment, applicationId, attachments }))
export const addCommentSuccess = createAction('ADD_COMMENT_SUCCESS')

export const getComments = createAction('GET_COMMENTS')
export const getCommentsSuccess = createAction('GET_COMMENTS_SUCCESS')
export const emptyComments = createAction('EMPTY_COMMENTS')
