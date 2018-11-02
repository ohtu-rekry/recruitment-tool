import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addStartDate, addEndDate } from '../../redux/actions/actions'

import 'react-datepicker/dist/react-datepicker.css'

export class TimespanPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: null,
      endDate: null,
      error: ''
    }
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
  }

  handleStartDateChange(date) {
    console.log(date)
    if (date && (!this.state.endDate || date.isBefore(this.state.endDate))) {
      this.setState({
        startDate: date,
        error: ''
      })
      this.props.addStartDate({ date })
    } else {
      this.setState({
        error: 'Selected date needs to be before end date'
      })
    }
  }

  handleEndDateChange(date) {
    if (date && date.isAfter(this.state.startDate)) {
      this.setState({
        endDate: date,
        error: ''
      })
      this.props.addEndDate({ date })
    } else if (date) {
      this.setState({
        error: 'Selected date needs to be after start date'
      })
    }
  }

  render() {
    return (
      <div>
        <div className='timespan-picker'>
          Visible from
          <DatePicker
            className='timespan-picker__datepicker'
            selected={this.state.startDate}
            dateFormat='DD-MM-YYYY'
            timeFormat='timeFormat="HH:mm'
            placeholderText='Select start date'
            onChange={this.handleStartDateChange} />
          to
          <DatePicker
            className='timespan-picker__datepicker'
            selected={this.state.endDate}
            dateFormat='DD-MM-YYYY'
            timeFormat='timeFormat="HH:mm'
            placeholderText='Select end date'
            onChange={this.handleEndDateChange} />
        </div>
        {this.state.error && <p className='timespan-picker__error'>{this.state.error}</p>}
      </div>
    )
  }
}

TimespanPicker.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object
}

const mapStateToProps = (state) => ({
  startDate: state.jobPostingReducer.startDate,
  endDate: state.jobPostingReducer.endDate
})

const mapDispatchToProps = {
  addStartDate,
  addEndDate
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanPicker)