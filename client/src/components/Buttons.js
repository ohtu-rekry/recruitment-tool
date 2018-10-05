import React from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

export const LinkButton = ({link, text}) => {
  return (
    <div>
      <Button variant='contained' href={link} size='small'>{text}</Button>
    </div>
  )
}

LinkButton.propTypes = {
  link : PropTypes.string.isRequired,
  text : PropTypes.string.isRequired,
  className: PropTypes.string
}

export const ActionButton = ({ actionHandler, text, className }) => {
  return (
    <Button onClick={actionHandler} color='inherit' className={className}>
      {text}
    </Button>
  )
}

ActionButton.propTypes = {
  actionHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string
}
