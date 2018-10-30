import React from 'react'
import { mount } from 'enzyme'
import { Link } from 'react-router-dom'
import { mock, getApp } from '../../setupTests'

import FrontPage from '../../components/frontpage/FrontPage'
import JobPostingListing from '../../components/frontpage/JobPostingListing'

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

describe('<FrontPage />', () => {
  let app

  beforeAll(() => {
    app = mount(getApp(<FrontPage />))
    mock.onGet(postingRoot).reply(200, jobPostings)
  })

  it('renders all job postings it gets from backend', () => {
    app.update()
    expect(app.find(JobPostingListing)).toHaveLength(jobPostings.length)
  })

  it('each posting is a link to single posting view', () => {
    app.update()

    const listings = app.find(JobPostingListing)

    expect(listings.at(0).find('[href="/jobposting/1"]')).toHaveLength(1)
    expect(listings.at(1).find('[href="/jobposting/2"]')).toHaveLength(1)
  })
})