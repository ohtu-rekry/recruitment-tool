import { createAction } from 'redux-actions'

export const addJobPosting = createAction('ADD_JOB_POSTING', (title, content, recruiter) => ({ title, content, recruiter }))
export const addJobPostingSuccess = createAction('ADDED_JOB_POSTING')
export const addJobPostingFailure = createAction('ADD_JOB_POSTING_FAILED')
export const removeJobPostingCreationStatus = createAction('REMOVE_JOB_POSTING_CREATION_STATUS')
