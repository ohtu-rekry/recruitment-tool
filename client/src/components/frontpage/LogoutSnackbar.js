import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import Close from '@material-ui/icons/Close'

const LogoutSnackbar = ({ handleCloseSnackbar }) => (
  <Snackbar
    open={true}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    className='logout-snackbar'
    autoHideDuration={10000}
    message={
      <span id='logged-out-message-id'>
        Your token has expired
      </span>
    }
    onClose={handleCloseSnackbar}
    ContentProps={{
      'aria-describedby': 'logged-out-message-id',
    }}
    action={[
      <Button
        key='close'
        aria-label='Close'
        color='inherit'
        onClick={handleCloseSnackbar}
      >
        <Close />
      </Button>,
    ]}
  />
)

LogoutSnackbar.propTypes = {
  handleCloseSnackbar: PropTypes.func.isRequired
}

export default LogoutSnackbar