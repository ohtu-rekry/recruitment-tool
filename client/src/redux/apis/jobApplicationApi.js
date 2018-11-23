import axios from 'axios'

export const root = '/api/jobapplication'

export default class jobApplicationApi {

  static get(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.token }
    }
    return axios.get(root, config)
  }
<<<<<<< HEAD

  static add(payload) {
    return axios.post(root, payload)
  }

=======
  static add(payload) {
    return axios.post(root, payload)
  }
>>>>>>> Front-end send uploaded files as base64 to back-end
  static moveApplicants(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.token }
    }
    return axios.patch(root, payload.data, config)
  }

  static addComment(payload) {
    const config = {
      headers: { 'Authorization': `bearer ${payload.token}` }
    }
    return axios.post(`${root}/${payload.applicationId}/comment`, payload.data, config)
  }

  static getComments(payload) {
    const config = {
      headers: { 'Authorization': 'bearer ' + payload.token }
    }
    return axios.get(`${root}/${payload.id}/comment`, config)
  }

}
