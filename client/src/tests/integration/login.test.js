import React from 'react'
import { mount } from 'enzyme'
import { mock, getApp, store } from '../../setupTests'

import Login from '../../components/admin/Login'

import { root as loginRoot } from '../../redux/apis/loginApi'

const testAdmin = {
  username: 'piggery',
  password: 'pottery',
  token: 'themostsecrettoken'
}

describe('<Login />', () => {
  let app, username, password, loginForm

  beforeAll(() => {
    app = mount(getApp(<Login />))

    username = app.find('#username')
    password = app.find('#password')

    loginForm = app.find('.admin-login-card')
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders log in form', () => {
    app.update()
    expect(app.find('.admin-login-card')).toHaveLength(1)
    expect(window.localStorage.getItem('loggedUser')).toBeUndefined()
  })

  describe('login is successful when', () => {

    beforeAll(() => {
      mock.onPost(loginRoot).reply(200, testAdmin)

      username.instance().value = testAdmin.username
      username.simulate('change')
      password.instance().value = testAdmin.password
      password.simulate('change')

      loginForm.simulate('submit')
    })

    it('user enters a valid username and password', () => {
      app.update()

      expect(store.getState().loginReducer.loggedIn.username).toEqual(testAdmin.username)
      expect(store.getState().loginReducer.loggedIn.token).toEqual(testAdmin.token)
    })
  })

  describe('login is unsuccessful when ', () => {

    beforeAll(() => {
      username.instance().value = ''
      username.simulate('change')

      password.instance().value = testAdmin.password
      password.simulate('change')

      loginForm.simulate('submit')
    })

    it('user does not enter a username', () => {
      app.update()

      expect(window.localStorage.getItem('loggedUser')).toBeUndefined()
    })
  })

  describe('login is unsuccessful when ', () => {

    beforeAll(() => {
      username.instance().value = testAdmin.username
      username.simulate('change')

      password.instance().value = ''
      password.simulate('change')

      loginForm.simulate('submit')
    })

    it('user does not enter a password', () => {
      app.update()

      expect(window.localStorage.getItem('loggedUser')).toBeUndefined()
    })
  })

  describe('login is unsuccessful when ', () => {

    beforeAll(() => {
      mock.onPost(loginRoot).reply(401)

      username.instance().value = testAdmin.username
      username.simulate('change')

      password.instance().value = testAdmin.password
      password.simulate('change')

      loginForm.simulate('submit')
    })

    it('user enters incorrect credentials', () => {
      app.update()

      expect(window.localStorage.getItem('loggedUser')).toBeUndefined()
    })
  })
})
