import { createAction } from 'redux-actions'

export const login = createAction('LOGIN', (username, password) => ({ username, password }))
export const loginSuccess = createAction('LOGIN_SUCCESS')
export const loginFailure = createAction('LOGIN_FAILURE')