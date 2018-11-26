import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { ActionButton, LinkButton } from './Buttons'

import * as actions from '../redux/actions/actions'

const emblicaLogo = require('../assets/img/emblica-logo.svg')

export class Header extends Component {

  render() {
    return (
      <div className='navigation-bar'>
        <Link to='/' className='navigation-bar__title'>
          <img src={emblicaLogo} alt='Emblica logo' className='navigation-bar__logo' />
        </Link>

        <div className='navigation-bar__middle'></div>
        <LinkButton link='/positions' text='All postings' className='navigation-bar__button' />
        {this.props.loggedIn && (
          <LinkButton link='/position/new' text='New posting' className='navigation-bar__button' />
        )}
        {this.props.loggedIn && (
          <ActionButton actionHandler={this.props.logout} text='Log out' className='navigation-bar__button' />
        )}

      </div>
    )
  }
}

Header.propTypes = {
  loggedIn: PropTypes.object,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)