import axios from 'axios'

const root = '/api/jobapplication'

export default class jobApplicationApi {
  static get() {
    return axios.get(root) }
  static add(payload) {
    return axios.post(root, payload) }
}
