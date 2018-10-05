import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { ActionButton, LinkButton } from './Buttons'

import * as actions from '../redux/actions/actions'

const emblicaLogo = require('../assets/img/emblica-logo.svg')

export class Header extends Component {

  render() {
    return (
      <AppBar position='static'>
        <Toolbar className='navigation-bar'>

          <Link to='/' className='navigation-bar__logo-and-title'>
            <img src={emblicaLogo} alt='Emblica logo' className='navigation-bar__logo-and-title__logo' />

            <Typography variant='title'>
              RECRUITMENT TOOL
            </Typography>
          </Link>

          <div className='navigation-bar__middle'></div>

          {this.props.loggedIn && (
            <LinkButton link='/jobpostings/new' text='Add new job posting' className='navigation-bar__button' />
          )}

          {this.props.loggedIn && (
            <ActionButton actionHandler={this.props.logout} text='Log out' className='navigation-bar__button' />
          )}

        </Toolbar>
      </AppBar>
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