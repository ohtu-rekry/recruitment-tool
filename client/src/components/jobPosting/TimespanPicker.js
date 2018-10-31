import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

export class TimespanPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment(),
      endDate: moment(),
      error: ''
    }
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
  }

  handleStartDateChange(date) {
    if (date.isBefore(this.state.endDate)) {
      this.setState({
        startDate: date,
        error: ''
      })
    } else {
      this.setState({
        error: 'Selected date needs to be before end date'
      })
    }
  }

  handleEndDateChange(date) {
    if (date.isAfter(this.state.startDate)) {
      this.setState({
        endDate: date,
        error: ''
      })
    } else {
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
            onChange={this.handleStartDateChange} />
          to
        <DatePicker
            className='timespan-picker__datepicker'
            selected={this.state.endDate}
            onChange={this.handleEndDateChange} />
        </div>
        {this.state.error && <p className='timespan-picker__error'>{this.state.error}</p>}
      </div>
    )
  }
}

export default TimespanPicker