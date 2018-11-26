import React from 'react'
import { mount } from 'enzyme'
import { getApp, store, mock } from '../../setupTests'

import Header from '../../components/Header'
import { ActionButton, LinkButton } from '../../components/Buttons'
import { root as loginRoot } from '../../redux/apis/loginApi'

const testAdmin = {
  username: 'captain',
  password: 'piggery',
  token: 'pottery'
}

describe('<Header />', () => {
  let app
  let testStore

  beforeAll(() => {
    testStore = store
    app = mount(getApp(<Header />))
  })

  it('renders clickable logo', () => {
    app.update()
    expect(app.find('img[alt="Emblica logo"]').parent()).toEqual(app.find('a[href="/"]'))
  })

  describe('when user is not logged in', () => {

    it('does not render logout button', () => {
      app.update()
      expect(app.find(ActionButton).find('[text="Log out"]')).toHaveLength(0)
    })

    it('does not render button for adding postings ', () => {
      app.update()
      expect(app.find(LinkButton).find('[text="New posting"]')).toHaveLength(0)
    })
  })

  describe('when user is logged in', () => {

    beforeAll(() => {
      testStore = store
      app = mount(getApp(<Header />))
      mock.onPost(loginRoot).reply(200, testAdmin)
      testStore.dispatch({
        payload: {
          username: testAdmin.username,
          password: testAdmin.password
        },
        type:'LOGIN'
      })
    })

    it('renders logout button', () => {
      app.update()
      expect(app.find(ActionButton).find('[text="Log out"]')).toHaveLength(1)
    })

    it('renders button for adding postings ', () => {
      app.update()
      expect(app.find(LinkButton).find('[text="New posting"]')).toHaveLength(1)
    })

    afterAll(() => {
      testStore.dispatch({
        type:'LOGOUT'
      })
    })
  })
})
