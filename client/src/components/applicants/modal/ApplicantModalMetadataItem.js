import React, { Component } from 'react'

class ApplicantModalMetadataItem extends Component {
  render() {
    return (
      <div className='applicant-modal__metadata-item'>
        {this.props.icon}
        <div className='applicant-modal__metadata-item-content'>
          {this.props.data}
        </div>
      </div>
    )
  }
}

export default ApplicantModalMetadataItem