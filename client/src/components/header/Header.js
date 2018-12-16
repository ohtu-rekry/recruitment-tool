import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ExitToApp from '@material-ui/icons/ExitToApp'
import { LinkButton } from '../Buttons'
import MobileMenu from './MobileMenu'

import * as actions from '../../redux/actions/actions'
import * as selectors from '../../redux/selectors/selectors'

const emblicaLogo = require('../../assets/img/emblica-logo.svg')

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
            <LinkButton link='/positions' text='All postings'/>
            {loggedIn &&
            <React.Fragment>
              <LinkButton link='/position/new' text='New posting'/>
              <button
                onClick={this.props.logout}
                className='navigation-bar__button'
              >
                Log out <ExitToApp style={{ fontSize: 20, marginLeft: 5 }}/>
              </button>
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
  loggedIn: selectors.getUser(state)
})

const mapDispatchToProps = {
  ...actions
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))