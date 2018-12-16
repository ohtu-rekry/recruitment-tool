import React from 'react'
import { Link } from 'react-router-dom'

export const ApplicationSuccess = () => (
  <div className='application-success'>
    <div className='application-success__title'>
      Application sent successfully
    </div>
    <div className='application-success__content'>
      Thank you for your application! We will be in contact with you as soon as possible.
    </div>

    <Link
      to={'/'}
      className='application-success__link'
    >
      Back to browsing job openings
    </Link>

  </div>
)

export default ApplicationSuccess