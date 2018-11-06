import axios from 'axios'

export const root = '/api/jobapplication'

export default class jobApplicationApi {
  static get() {
    return axios.get(root) }
  static add(payload) {
    return axios.post(root, payload) }
  static moveApplicants(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.token }
    }
    return axios.patch(root, payload.data, config)
  }
}
