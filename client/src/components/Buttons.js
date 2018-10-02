import React from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

export const LinkButton = (props) => {
  return (
    <div>
      <Button variant='contained' href={props.link}>{props.text}</Button>
    </div>
  )
}

LinkButton.propTypes = {
  link : PropTypes.string.isRequired,
  text : PropTypes.string.isRequired
}