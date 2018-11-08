import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addShowFrom, addShowTo } from '../../redux/actions/actions'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

export class TimespanPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFrom: moment(),
      showTo: null,
      error: ''
    }
    this.handleShowFromChange = this.handleShowFromChange.bind(this)
    this.handleShowToChange = this.handleShowToChange.bind(this)
  }

  componentDidMount() {
    this.props.addShowFrom(this.state.showFrom)
  }

  handleShowFromChange(date) {
    if (date !== undefined && (date === null || !this.state.showTo || date.isBefore(this.state.showTo))) {
      if (date === null) {
        this.setState({
          showFrom: null,
          showTo: null,
          error: ''
        })
        this.props.addShowFrom({ date })
        this.props.addShowTo({ date })
      } else {
        this.setState({
          showFrom: date,
          error: ''
        })
        this.props.addShowFrom({ date })
      }
    } else {
      this.setState({
        error: 'Selected date needs to be before end date'
      })
    }
  }

  handleShowToChange(date) {
    if (date !== undefined && (date === null || date.isAfter(this.state.showFrom))) {
      this.setState({
        showTo: date,
        error: ''
      })
      this.props.addShowTo({ date })
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
            selected={this.state.showFrom}
            dateFormat='DD-MM-YYYY'
            timeFormat='timeFormat="HH:mm'
            placeholderText='Select start date'
            isClearable={true}
            minDate={moment()}
            onChange={this.handleShowFromChange} />
          to
          <DatePicker
            className='timespan-picker__datepicker'
            selected={this.state.showTo}
            dateFormat='DD-MM-YYYY'
            timeFormat='timeFormat="HH:mm'
            placeholderText='Select end date'
            isClearable={true}
            minDate={moment()}
            onChange={this.handleShowToChange} />
        </div>
        {this.state.error && <p className='timespan-picker__error'>{this.state.error}</p>}
      </div>
    )
  }
}

TimespanPicker.propTypes = {
  showFrom: PropTypes.object,
  showTo: PropTypes.object
}

const mapStateToProps = (state) => ({
  showFrom: state.jobPostingReducer.showFrom,
  showTo: state.jobPostingReducer.showTo
})

const mapDispatchToProps = {
  addShowFrom,
  addShowTo
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanPicker)