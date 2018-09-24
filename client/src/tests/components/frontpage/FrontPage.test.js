import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import FrontPage from '../../../components/frontpage/FrontPage'

describe('<FrontPage />', () => {

  const jobPosting = [
    {
      'id': 1,
      'title': 'Front-end developer',
      'createdBy': 'Emblica Man',
      'Content': 'Apply here!'
    }
  ]

  it('renders frontpage with content', () => {
    const component = shallow(<FrontPage jobPostings={jobPosting} />)
    console.log(component.debug())
    expect(component.find('.frontpage').isEmpty())
  })
})