import axios from 'axios'

const root = 'http://0.0.0.0:8080/api/jobapplication'

export default class jobApplicationApi {
  static get() {
    return axios.get(root) }
  static add(payload) {
    return axios.post(root, payload) }
}