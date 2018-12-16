import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

export const LinkButton = ({ link, text }) => {
  const routerLink = props => <Link to={link} {...props} />
  return (
    <Button
      style={{ marginRight: 15 }}
      variant='contained'
      component={routerLink}
      size='small'
    >
      {text}
    </Button>
  )
}

LinkButton.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string
}