import React from 'react'
import { createShallow } from '@material-ui/core/test-utils'
import { expect } from 'chai'
import { JobPostingForm } from '../../../components/jobPosting/JobPostingForm'

describe('JobPostingForm', () => {
  let shallow, emptyJobPostings, emptyFunction,
    exampleSuccessMessage, exampleErrorMessage, exampleTitle, exampleContent, exampleRecruiter

  beforeEach( () => {
    shallow = createShallow()
    emptyJobPostings = {
      jobPostings: [],
      creationRequestStatus: null
    }
    emptyFunction = () => {}
    exampleSuccessMessage = 'Job posting created'
    exampleErrorMessage = 'An error occurred'
    exampleTitle = 'Awesome job'
    exampleContent = 'This job is awesome'
    exampleRecruiter = {
      username: 'awesome_recruiter',
      token: 'example-token'
    }
  })

  it('renders one job posting form if recruiter is logged in', () => {
    const component = shallow(<JobPostingForm jobPostings={emptyJobPostings} loggedIn={exampleRecruiter} addJobPosting={emptyFunction} />)
    expect(component.find('#job-posting-form')).to.have.lengthOf(1)
  })

  describe('functionality of', () => {

    describe('snackbar works when', () => {

      it('creationRequestStatus is null', () => {
        const component = shallow(<JobPostingForm jobPostings={emptyJobPostings} loggedIn={exampleRecruiter} addJobPosting={emptyFunction} />)
        expect(component.find('#snackbar-error')).to.be.empty
        expect(component.find('#snackbar-success')).to.be.empty
      })

      it('creationRequestStatus is an error', () => {
        const errorStatus = {
          message: exampleErrorMessage,
          type: 'error'
        }

        const component = shallow(<JobPostingForm creationRequestStatus={errorStatus} loggedIn={exampleRecruiter} addJobPosting={emptyFunction} />)
        expect(component.exists('#snackbar-error')).to.equal(true)
        expect(component.find('#snackbar-error').html()).to.include(exampleErrorMessage)
        expect(component.find('#snackbar-success')).to.be.empty
      })

      it('creationRequestStatus is of type success', () => {
        const successStatus = {
          message: exampleSuccessMessage,
          type: 'success'
        }

        const component = shallow(<JobPostingForm creationRequestStatus={successStatus} loggedIn={exampleRecruiter} addJobPosting={emptyFunction} />)
        expect(component.exists('#snackbar-success')).to.equal(true)
        expect(component.find('#snackbar-success').html()).to.include(exampleSuccessMessage)
        expect(component.find('#snackbar-error')).to.be.empty
      })
    })

    describe('input fields work when', () => {
      let component, titleField, contentField

      beforeEach( () => {
        component = shallow(<JobPostingForm jobPostings={emptyJobPostings} loggedIn={exampleRecruiter} addJobPosting={emptyFunction} />)
        titleField = component.find('#title')
        contentField = component.find('#content')
      })

      it('field for title is changed', () => {
        titleField.instance.value= exampleTitle

        const event = {
          target: {
            id: 'title',
            value: titleField.instance.value
          }
        }
        titleField.simulate('change', event)

        expect(component.state('title')).to.equal(exampleTitle)
      })

      it('field for content is changed', () => {
        contentField.instance.value= exampleContent

        const event = {
          target: {
            id: 'content',
            value: contentField.instance.value
          }
        }
        contentField.simulate('change', event)

        expect(contentField.instance.value).to.equal(exampleContent)
        expect(component.state('content')).to.equal(exampleContent)
      })

    })

    describe('submit works when', () => {
      let mockAddJobPostingDispatched, component

      beforeEach( () => {
        mockAddJobPostingDispatched = jest.fn((title, content) => ([title, content]))
        component = shallow(<JobPostingForm jobPostings={emptyJobPostings} addJobPosting={mockAddJobPostingDispatched} loggedIn={exampleRecruiter} />)
      })

      it('the title and content have values', () => {

        component.setState({
          title: exampleTitle,
          content: exampleContent
        })

        component.find('#job-posting-form').simulate('submit', { preventDefault() {} })

        expect(mockAddJobPostingDispatched.mock.calls.length).to.equal(1)
        expect(mockAddJobPostingDispatched.mock.calls[0][0]).to.equal(exampleTitle)
        expect(mockAddJobPostingDispatched.mock.calls[0][1]).to.equal(exampleContent)
      })

      it('title is empty', () => {

        component.setState({
          title: '',
          content: exampleContent
        })

        component.find('#job-posting-form').simulate('submit', { preventDefault() {} })
        expect(mockAddJobPostingDispatched.mock.calls.length).to.equal(0)
      })

      it('content is empty', () => {

        component.setState({
          title: exampleTitle,
          content: ''
        })

        component.find('#job-posting-form').simulate('submit', { preventDefault() {} })
        expect(mockAddJobPostingDispatched.mock.calls.length).to.equal(0)
      })
    })
  })
})