import axios from 'axios'

const root = 'http://0.0.0.0:8080/api/jobpostings'

export default class jobPostingApi {
  static get() {
    return axios.get(root)
  }
  static add(payload) {
    return axios.post(root, payload)
  }
}