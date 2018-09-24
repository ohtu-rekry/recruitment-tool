import React from 'react'
import { shallow, mount, describe, it, beforeEach } from 'enzyme'
import { expect } from 'chai'
import { Login } from '../../../components/admin/Login'

describe('Login', () => {
  it('renders one Login form element', () => {
    const component = shallow(<Login />)
    expect(component.find('.admin-login-card')).to.have.lengthOf(1)
  })

  describe('functionality', () => {
    let component, username, password, button

    beforeEach(() => {
      component = mount(
        <Login login={() => {}}/>
      )
      username = component.find('#username')
      password = component.find('#password')
      button = component.find('button')
    })

    it('of input fields works', () => {
      username.instance().value = 'foo'
      username.simulate('change')

      password.instance().value = 'bar'
      password.simulate('change')

      expect(component.state().username).to.equal('foo')
      expect(component.state().password).to.equal('bar')
    })


    it('of submit works', () => {
      username.instance().value = 'foo'
      username.simulate('change')

      password.instance().value = 'bar'
      password.simulate('change')

      expect(component.state().username).to.equal('foo')
      expect(component.state().password).to.equal('bar')

      button.simulate('submit')

      expect(component.state().username).to.equal('')
      expect(component.state().password).to.equal('')
    })
  })
})