import React, { Component } from 'react'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'

class ApplicantModalAttachments extends Component {

  truncateString = (str, length) => {
    const dots = str.length > length ? '...' : ''
    return str.substring(0, length) + dots
  }

  render() {
    const { applicant } = this.props

    return (
      <React.Fragment>
        {applicant.attachments.map((attachment, index) => {
          return (
            <Tooltip key={index} title={attachment.path.substring(57)}>
              <Chip
                key={index}
                label={this.truncateString(attachment.path.substring(57), 10)}
                clickable={true}
                onClick={() => window.open(attachment.path)} />
            </Tooltip>
          )
        })}
      </React.Fragment>
    )
  }
}

export default ApplicantModalAttachments