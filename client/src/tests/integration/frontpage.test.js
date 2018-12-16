import React from 'react'
import { mount } from 'enzyme'
import { mock, getApp } from '../../setupTests'

import JobPostings from '../../components/jobPostings/JobPostings'
import JobPostingListing from '../../components/jobPostings/JobPostingListing'

import { root as postingRoot } from '../../redux/apis/jobPostingApi'

const jobPostings = [
  {
    id: 1,
    title: 'Frontend developer',
    content: 'We are looking for a new talent'
  },
  {
    id: 2,
    title: 'Senior Node.js backend developer',
    content: 'Welcome to our team'
  }
]

describe('<JobPostings />', () => {
  let app

  beforeAll(() => {
    app = mount(getApp(<JobPostings />))
    mock.onGet(postingRoot).reply(200, jobPostings)
  })

  it('renders all job postings it gets from backend', () => {
    app.update()
    expect(app.find(JobPostingListing)).toHaveLength(jobPostings.length)
  })

  it('each posting is a link to single posting view', () => {
    app.update()

    const listings = app.find(JobPostingListing)

    expect(listings.at(0).find('[href="/position/1"]')).toHaveLength(1)
    expect(listings.at(1).find('[href="/position/2"]')).toHaveLength(1)
  })
})