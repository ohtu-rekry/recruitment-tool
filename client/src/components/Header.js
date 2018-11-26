import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { ActionButton, LinkButton } from './Buttons'
import MobileMenu from './MobileMenu'

import * as actions from '../redux/actions/actions'

const emblicaLogo = require('../assets/img/emblica-logo.svg')

export class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      onMobile: false
    }
  }

  componentDidMount() {
    if (window.innerWidth <= 760) {
      this.setState({
        onMobile: true
      })
    }
  }

  render() {
    const { onMobile } = this.state
    const { loggedIn } = this.props
    
    return (
      <div className='navigation-bar'>
        <Link to='/' className='navigation-bar__title'>
          <img src={emblicaLogo} alt='Emblica logo' className='navigation-bar__logo' />
        </Link>

        <div className='navigation-bar__middle'></div>
        {!onMobile ?
          <React.Fragment>
            <LinkButton link='/positions' text='All postings' className='navigation-bar__button' />
            {loggedIn &&
            <React.Fragment>
              <LinkButton link='/position/new' text='New posting' className='navigation-bar__button' />
              <ActionButton actionHandler={this.props.logout} text='Log out' className='navigation-bar__button' />
            </React.Fragment>
            }
          </React.Fragment>
          :
          <MobileMenu/>
        }
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))