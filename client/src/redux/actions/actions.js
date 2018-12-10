import { createAction } from 'redux-actions'

export const login = createAction('LOGIN', (username, password) => ({ username, password }))
export const loginSuccess = createAction('LOGIN_SUCCESS')
export const loginFailure = createAction('LOGIN_FAILURE')

export const logout = createAction('LOGOUT')
export const logoutSuccess = createAction('LOGOUT_SUCCESS')
export const logoutFailure = createAction('LOGOUT_FAILURE')
export const emptyTokenExpired = createAction('EMPTY_TOKEN_EXPIRED')

export const submitJobPosting = createAction(
  'SUBMIT_JOB_POSTING', (title, content, stages, showFrom, showTo, mode, id) => ({
    title, content, stages, showFrom, showTo, mode, id
  }))

export const copyJobPosting = createAction('COPY_JOB_POSTING', (jobPosting, stages) => ({ jobPosting, stages }))

export const addJobPostingSuccess = createAction('ADDED_JOB_POSTING')
export const addJobPostingFailure = createAction('ADD_JOB_POSTING_FAILED')
export const removeJobPostingStatus = createAction('REMOVE_JOB_POSTING_CREATION_STATUS')
export const addNewStageForJobPosting = createAction('ADD_NEW_STAGE_FOR_JOB_POSTING', (newStage) => (newStage))
export const removeStageInJobPosting = createAction('REMOVE_STAGE_IN_JOB_POSTING', (stage) => (stage))

export const addShowFrom = createAction('ADD_SHOW_FROM', (showFrom) => ({ showFrom }))
export const addShowTo = createAction('ADD_SHOW_TO', (showTo) => ({ showTo }))
export const clearShowFromAndShowTo = createAction('CLEAR_SHOW_FROM_AND_SHOW_TO')
export const setTimeSpan = createAction('SET_TIMESPAN', (showFrom, showTo) => ({ showFrom, showTo }))
export const timespanHasBeenSet = createAction('TIMESPAN_HAS_BEEN_SET')

export const setStages = createAction('SET_STAGES', (stages) => ({ stages }))
export const clearStages = createAction('CLEAR_STAGES')
export const renamePostingStage = createAction('RENAME_POSTING_STAGE', (postingStage, stageUnderEdit) => ({ postingStage, stageUnderEdit }))
export const setStageError = createAction('SET_STAGE_ERROR', (errorMessage) => ( errorMessage ))

export const clearErrorMessage = createAction('CLEAR_ERROR_MESSAGE')

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail, jobPostingId, attachments) => ({
    applicantName, applicantEmail, jobPostingId, attachments
  }))

export const fetchJobPosting = createAction(
  'FETCH_JOBPOSTING', (postingId, recruiter) => ({
    postingId, recruiter
  }))
export const fetchJobPostingWithStages = createAction('FETCH_JOBPOSTING_WITH_STAGES', (id) => ({ id }))
export const emptyJobPosting = createAction('EMPTY_JOBPOSTING')
export const fetchJobPostings = createAction('FETCH_JOBPOSTINGS', (recruiter) => ({ recruiter }))
export const setJobPosting = createAction('SET_JOBPOSTING')
export const setJobPostings = createAction('SET_JOBPOSTINGS')

export const applySuccess = createAction('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')

export const fetchApplicants = createAction('FETCH_APPLICANTS')
export const fetchApplicantsSuccess = createAction('FETCH_APPLICANTS_SUCCESS')

export const moveApplicant = createAction('MOVE_APPLICANT', (applicant, newStage, oldStage, oldIndex, oldStages) => ({ applicant, newStage, oldStage, oldIndex, oldStages }))

export const getApplicants = createAction('GET_APPLICANTS')
export const getApplicantsSuccess = createAction('GET_APPLICANTS_SUCCESS')

export const moveStage = createAction('MOVE_STAGE', (oldIndex, newIndex, oldStages) => ({ oldIndex, newIndex, oldStages }))
export const moveStageSuccess = createAction('MOVE_STAGE_SUCCESS')

export const addComment = createAction('ADD_COMMENT', (comment, applicationId, attachments) => ({ comment, applicationId, attachments }))
export const addCommentSuccess = createAction('ADD_COMMENT_SUCCESS')

export const getComments = createAction('GET_COMMENTS')
export const getCommentsSuccess = createAction('GET_COMMENTS_SUCCESS')
export const emptyComments = createAction('EMPTY_COMMENTS')
