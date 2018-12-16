export const getUser = state => state.loginReducer.loggedIn
export const getTokenExpiredStatus = state => state.loginReducer.tokenExpired