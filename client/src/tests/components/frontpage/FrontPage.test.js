/*import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
jest.mock('../../jobPostings')

import FrontPage from '../../../components/frontpage/FrontPage'



describe('<FrontPage />', () => {

  let frontpage
  beforeAll(() => {
    frontpage = mount(<FrontPage />)
  })

  it('renders frontpage with content', () => {
    frontpage.update()
    const jobpostings = frontpage.find()
    const jobPostingList = wrapper.find('.job-postings__list')
    console.log(wrapper.dive().debug())
    expect(jobPostingList).contain(initialState.jobPostings)
  })
})
*/