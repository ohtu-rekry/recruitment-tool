import { createAction } from 'redux-actions'

export const sample = createAction('SAMPLE')
export const secondSample = createAction('SECOND_SAMPLE', (type1, type2) => ({ type1, type2 }))