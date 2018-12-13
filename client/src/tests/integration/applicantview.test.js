import React from 'react'
import { mount } from 'enzyme'
import { mock, getApp, setWindowLocation, store } from '../../setupTests'

import Applicants from '../../components/applicants/Applicants'
import ApplicationStage from '../../components/applicants/ApplicationStage'
import Applicant from '../../components/applicants/Applicant'

import { root as postingRoot } from '../../redux/apis/jobPostingApi'

const testAdmin = {
  username: 'piggery',
  password: 'pottery',
  token: 'themostsecrettoken'
}

const postings = [{
  id: 2937503,
  title: 'application-test-title1',
  content: 'application-test-content1'
}]

const applications = [{
  id: 0,
  applicantName: 'test-applicant-name1',
  applicantEmail: 'test-applicant-email1',
  postingStageId: 1
}, {
  id: 1,
  applicantName: 'test-applicant-name2',
  applicantEmail: 'test-applicant-email2',
  postingStageId: 1
}, {
  id: 2,
  applicantName: 'test-applicant-name3',
  applicantEmail: 'test-applicant-email3',
  postingStageId: 2
}, {
  id: 3,
  applicantName: 'test-applicant-name4',
  applicantEmail: 'test-applicant-email4',
  postingStageId: 4
}]

const stages = [{
  id: 1,
  stageName: 'Applied',
  orderNumber: 0,
  applicants: []
}, {
  id: 2,
  stageName: 'Homework',
  orderNumber: 2,
  applicants: [ applications[0] ]
}, {
  id: 3,
  stageName: 'Approved',
  orderNumber: 1,
  applicants: [ applications[1], applications[2] ]
}, {
  id: 4,
  stageName: 'Rejected',
  orderNumber: 3,
  applicants: [ applications[3] ]
}]

it('Application view does not render applications or stages when user is not logged in', () => {
  mock.onGet(postingRoot).reply(200, postings)
  mock.onGet(`${postingRoot}/${postings[0].id}/applicants`).reply(200, stages)
  setWindowLocation(`https://localhost:3000/position/${postings[0].id}/`)
  store.getState().loginReducer.loggedIn = null
  const app = mount(getApp(<Applicants />))

  expect(app.find(ApplicationStage)).toHaveLength(0)
  expect(app.find(Applicant)).toHaveLength(0)
})

describe('Application view for one posting when user is logged in', () => {
  let app

  beforeAll(() => {
    mock.onGet(postingRoot).reply(200, postings)
    mock.onGet(`${postingRoot}/${postings[0].id}`).reply(200, postings[0])
    mock.onGet(`${postingRoot}/${postings[0].id}/applicants`).reply(200, stages)
    setWindowLocation(`https://localhost:3000/position/${postings[0].id}/`)
    store.getState().loginReducer.loggedIn = testAdmin
    app = mount(getApp(<Applicants />))
  })

  it('renders all stages returned from backend', () => {
    app.update()

    expect(app.find(ApplicationStage)).toHaveLength(stages.length)
    expect(app.find(ApplicationStage)
      .map(element => element.props().stage.id)
      .sort((a, b) => a - b))
      .toEqual(stages.map(stage => stage.id).sort((a, b) => a - b))
  })

  it('renders all applications returned from backend', () => {
    app.update()

    expect(app.find(Applicant)).toHaveLength(applications.length)
    expect(app.find(Applicant)
      .map(element => element.props().applicant.id)
      .sort((a, b) => a - b))
      .toEqual(applications
        .map(application => application.id)
        .sort((a, b) => a - b))
  })

  it('shows each applicant under correct stage', () => {
    app.update()

    expect(app.find(ApplicationStage)
      .map(element => element.find(Applicant)
        .map(applicant => applicant.props().applicant.id))
    ).toEqual([
      [],
      [applications[1].id, applications[2].id],
      [applications[0].id],
      [applications[3].id]
    ])
  })

  it('renders stages in order based on their orderNumber', () => {
    app.update()

    expect(app.find(ApplicationStage).map(element => element.props().stage))
      .toEqual(app.find(ApplicationStage)
        .map(element => element.props().stage)
        .sort((a, b) => a.orderNumber - b.orderNumber))
  })
})