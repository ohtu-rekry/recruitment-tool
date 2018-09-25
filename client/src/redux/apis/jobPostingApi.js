import axios from 'axios'

const root = 'http://0.0.0.0:8080/api/jobposting'

export default class jobPostingApi {

  static add(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.recruiter.token }
    }

    return axios.post(root, payload.jobPosting, config)
  }

}