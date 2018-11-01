import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Applicant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragged: false
    }
  }

  handleDrag = (event) => {
    this.props.onDrag(event, this.props.applicant)
    this.setState({ isDragged: true })
  }

  handleDragEnd = (event) => {
    event.preventDefault()
    this.setState({ isDragged: false })
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
    console.log(this.state.isDragged)
    return (
      <div
        className='applicant'
        draggable
        onDragStart={this.handleDrag}
        onDragEnd={this.handleDragEnd}
        style={{ opacity: this.state.isDragged && '0.3' }}
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