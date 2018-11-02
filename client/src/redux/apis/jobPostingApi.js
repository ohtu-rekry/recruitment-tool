import axios from 'axios'

export const root = '/api/jobposting'

export default class jobPostingApi {
  static get(payload) {

    let config = null

    if (payload.recruiter !== null) {

      config = {
        headers: { 'Authorization': 'bearer ' + payload.recruiter.token }
      }
    }

    return axios.get(root, config)
  }

  static add(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.recruiter.token }
    }
    return axios.post(root, payload.jobPosting, config)
  }

  static getApplicants(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.token }
    }
    return axios.get(`${root}/${payload.id}/applicants`, config)
  }

}
