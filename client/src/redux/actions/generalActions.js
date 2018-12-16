import { createAction } from 'redux-actions'

export const clearErrorMessage = createAction('CLEAR_ERROR_MESSAGE')

export const fetchJobPostings = createAction('FETCH_JOBPOSTINGS')
export const setJobPostings = createAction('SET_JOBPOSTINGS')

export const getAllApplicants = createAction('GET_ALL_APPLICANTS')
export const getApplicantsSuccess = createAction('GET_APPLICANTS_SUCCESS')


export const updateStages = createAction('UPDATE_STAGES')
