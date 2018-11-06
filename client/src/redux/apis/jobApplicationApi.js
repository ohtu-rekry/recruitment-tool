import axios from 'axios'

export const root = '/api/jobapplication'

export default class jobApplicationApi {
  static get() {
    return axios.get(root) }
  static add(payload) {
    return axios.post(root, payload) }
}
