import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { mock, getApp, setWindowLocation } from '../../setupTests'

import JobPosting from '../../components/posting-page/JobPosting'

import { root as applicationRoot } from '../../redux/apis/jobApplicationApi'
import { root as postingRoot } from '../../redux/apis/jobPostingApi'

const postings = [{
  id: 2937503,
  title: 'application-test-title1',
  content: 'application-test-content1'
}]

const application = {
  applicantName: 'application-test-name1',
  applicantEmail: 'application@test.email1'
}

const invalidEmail = 'application-test.email2'

describe('When applying to a job opening', () => {
  let app, applicantName, applicantEmail, applicationForm

  beforeEach(() => {
    mock.onGet(postingRoot).reply(200, postings)
    setWindowLocation(`https://localhost:3000/position/${postings[0].id}/`)
    app = mount(getApp(<JobPosting />))

    applicantName = app.find('#applicantName')
    applicantEmail = app.find('#applicantEmail')

    applicationForm = app.find('.job-posting__form')
  })

  it('the job posting title and content is rendered', () => {
    app.update()

    expect(app.find('.job-posting__content')).toHaveLength(1)
    expect(app.find('ReactMarkdown')).toHaveLength(1)
    expect(app.find(JobPosting).find('ReactMarkdown')).toHaveLength(1)
    expect(app.find('ReactMarkdown').prop('source')).toBe(postings[0].content)

    expect(app.find('.job-posting__title')).toHaveLength(1)
    expect(app.find('.job-posting__title').prop('children')).toBe(postings[0].title)
  })

  it('the application form is rendered on the job posting page', () => {
    app.update()
    expect(applicationForm).toHaveLength(1)
    expect(applicantName.instance().value).toBe('')
    expect(applicantEmail.instance().value).toBe('')
  })

  describe('application is unsuccessful when ', () => {

    it('user does not enter a username', () => {
      applicantName.instance().value = ''
      applicantName.simulate('change')

      applicantEmail.instance().value = application.applicantEmail
      applicantEmail.simulate('change')

      applicationForm.simulate('submit')
      app.update()

      expect(applicantName.instance().value).toBe('')
      expect(applicantEmail.instance().value).toBe(application.applicantEmail)
      expect(app.find(MemoryRouter).instance().history.location.pathname).not.toBe('/success')
    })

    it('user does not enter an email', () => {
      applicantName.instance().value = application.applicantName
      applicantName.simulate('change')

      applicantEmail.instance().value = ''
      applicantEmail.simulate('change')

      applicationForm.simulate('submit')
      app.update()

      expect(applicantName.instance().value).toBe(application.applicantName)
      expect(applicantEmail.instance().value).toBe('')
      expect(app.find(MemoryRouter).instance().history.location.pathname).not.toBe('/success')
    })

    it('user enters an invalid email address', () => {
      applicantName.instance().value = application.applicantName
      applicantName.simulate('change')

      applicantEmail.instance().value = invalidEmail
      applicantEmail.simulate('change')

      applicationForm.simulate('submit')
      app.update()

      expect(applicantName.instance().value).toBe(application.applicantName)
      expect(applicantEmail.instance().value).toBe(invalidEmail)
      expect(app.find('InputErrorMessage').prop('errorMessage')).toBe('Please enter a valid email')
      expect(app.find(MemoryRouter).instance().history.location.pathname).not.toBe('/success')
    })
  })
})
