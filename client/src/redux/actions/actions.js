import { createAction } from 'redux-actions'

export const login = createAction('LOGIN', (username, password) => ({ username, password }))
export const loginSuccess = createAction('LOGIN_SUCCESS')
export const loginFailure = createAction('LOGIN_FAILURE')

export const logout = createAction('LOGOUT')
export const logoutSuccess = createAction('LOGOUT_SUCCESS')
export const logoutFailure = createAction('LOGOUT_FAILURE')

export const submitJobPosting = createAction(
  'SUBMIT_JOB_POSTING', (title, content, recruiter, stages, showFrom, showTo, mode, id) => ({
    title, content, recruiter, stages, showFrom, showTo, mode, id
  }))
export const addJobPostingSuccess = createAction('ADDED_JOB_POSTING')
export const addJobPostingFailure = createAction('ADD_JOB_POSTING_FAILED')
export const removeJobPostingStatus = createAction('REMOVE_JOB_POSTING_CREATION_STATUS')
export const addNewStageForJobPosting = createAction('ADD_NEW_STAGE_FOR_JOB_POSTING', (newStage) => (newStage))
export const removeStageInJobPosting = createAction('REMOVE_STAGE_IN_JOB_POSTING', (stage) => (stage))

export const addShowFrom = createAction('ADD_SHOW_FROM', (showFrom) => ({ showFrom }))
export const addShowTo = createAction('ADD_SHOW_TO', (showTo) => ({ showTo }))

export const copyStages = createAction('COPY_STAGES', (stages) => ({ stages }))
export const clearCopiedStages = createAction('CLEAR_COPIED_STAGES')
export const setStages = createAction('SET_STAGES', (stages) => ({ stages }))
export const clearStages = createAction('CLEAR_STAGES')

export const sendApplication = createAction(
  'SEND_APPLICATION', (applicantName, applicantEmail, jobPostingId) => ({
    applicantName, applicantEmail, jobPostingId
  }))

export const fetchJobPosting = createAction(
  'FETCH_JOBPOSTING', (postingId) => ({
    postingId
  }))
export const fetchJobPostingWithStages = createAction('FETCH_JOBPOSTING_WITH_STAGES', (id) => ({ id }))
export const emptyJobPosting = createAction('EMPTY_JOBPOSTING')
export const fetchJobPostings = createAction('FETCH_JOBPOSTINGS')
export const setJobPosting = createAction('SET_JOBPOSTING')
export const setJobPostings = createAction('SET_JOBPOSTINGS')

export const applySuccess = createAction('APPLY_SUCCESS')
export const applyFailure = createAction('APPLY_FAIL')

export const fetchApplicants = createAction('FETCH_APPLICANTS')
export const fetchApplicantsSuccess = createAction('FETCH_APPLICANTS_SUCCESS')

export const moveApplicant = createAction('MOVE_APPLICANT', (applicant, newStage) => ({ applicant, newStage }))
export const moveApplicantSuccess = createAction('MOVE_APPLICANT_SUCCESS')

export const getApplicants = createAction('GET_APPLICANTS')
export const getApplicantsSuccess = createAction('GET_APPLICANTS_SUCCESS')


