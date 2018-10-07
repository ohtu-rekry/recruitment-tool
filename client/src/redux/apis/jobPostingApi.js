import axios from 'axios'

const root = '/api/jobposting'

export default class jobPostingApi {
  static get() {
    return axios.get(root)
  }

  static add(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.recruiter.token }
    }

    return axios.post(root, payload.jobPosting, config)
  }
}
