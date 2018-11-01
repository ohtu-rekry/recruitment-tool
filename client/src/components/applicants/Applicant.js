import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Applicant extends Component {

  handleDrag = (event) => {
    console.log('asd: ', this.props.applicant)
    event.preventDefault()
    this.props.onDrag(event, this.props.applicant)
  }

  render() {
    const { applicantName, applicantEmail, createdAt } = this.props.applicant
    let dateTime = new Date(createdAt).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute:'2-digit'
    })

    return (
      <div
        className='applicant'
        draggable
        onDrag={this.handleDrag}
      >
        <div className='applicant__name'>
          {applicantName}
        </div>
        <div className='applicant__email'>
          {applicantEmail}
        </div>
        <div className='applicant__date'>Application sent: {dateTime}</div>
      </div>
    )
  }
}

Applicant.propTypes = {
  applicant: PropTypes.object.isRequired
}

export default Applicant