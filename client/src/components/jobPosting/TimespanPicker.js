import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addShowFrom, addShowTo, clearShowFromAndShowTo, timespanSet } from '../../redux/actions/actions'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

export class TimespanPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFrom: null,
      showTo: null,
      error: ''
    }
    this.handleShowFromChange = this.handleShowFromChange.bind(this)
    this.handleShowToChange = this.handleShowToChange.bind(this)
  }

  componentDidMount() {
    if (this.props.setTimespan) {
      const now = moment()
      const copiedShowFrom = moment(this.props.showFrom)

      if (now.isBefore(copiedShowFrom)) this.setState({ showFrom: copiedShowFrom })
      else this.setState({ showFrom: now })

      if (this.props.showTo) this.setState({ showTo: moment(this.props.showTo) })

      this.props.timespanSet()
    }
  }

  componentDidUpdate() {
    if (this.props.setTimespan) {
      this.setState({ showFrom: moment(this.props.showFrom) })
      if (this.props.showTo) this.setState({ showTo: moment(this.props.showTo) })
      this.props.timespanSet()
    }
  }

  componentWillUnmount() {
    this.props.clearShowFromAndShowTo()
  }

  async handleShowFromChange(date) {
    if (date !== undefined && (date === null || !this.state.showTo || date.isBefore(this.state.showTo))) {
      if (date === null) {
        await this.setState({
          showFrom: null,
          showTo: null
        })
        this.props.addShowFrom(null)
      } else {
        await this.setState({
          showFrom: date,
          error: ''
        })
        const formattedDate = date.toLocaleString()
        this.props.addShowFrom(formattedDate)
      }
    } else {
      this.setState({
        error: 'Selected date needs to be before end date'
      })
    }
  }

  async handleShowToChange(date) {
    if (date !== undefined && (date === null || date.isAfter(this.state.showFrom))) {
      await this.setState({
        showTo: date,
        error: ''
      })
      let formattedDate = date.toLocaleString()
      this.props.addShowTo(formattedDate)

      formattedDate = this.state.showFrom.toLocaleString()
      this.props.addShowFrom(formattedDate)

    } else if (date) {
      this.setState({
        error: 'Selected date needs to be after start date'
      })
    }
  }

  render() {
    const { showFrom } = this.state
    const now = moment()
    const laterDateOfShowFromAndNow = showFrom && now.isBefore(showFrom) ? showFrom : now
    const showToMinDate = moment(laterDateOfShowFromAndNow).add(1, 'd')

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
            minDate={now}
            onChange={this.handleShowFromChange} />
          to
          <DatePicker
            className='timespan-picker__datepicker'
            selected={this.state.showTo}
            dateFormat='DD-MM-YYYY'
            timeFormat='timeFormat="HH:mm'
            placeholderText='Select end date'
            isClearable={true}
            minDate={showToMinDate}
            onChange={this.handleShowToChange} />
        </div>
        {this.state.error && <p className='timespan-picker__error'>{this.state.error}</p>}
      </div>
    )
  }
}

TimespanPicker.propTypes = {
  showFrom: PropTypes.string,
  showTo: PropTypes.string,
  setTimespan: PropTypes.bool
}

const mapStateToProps = (state) => ({
  showFrom: state.jobPostingReducer.showFrom,
  showTo: state.jobPostingReducer.showTo,
  setTimespan: state.jobPostingReducer.setTimespan
})

const mapDispatchToProps = {
  addShowFrom,
  addShowTo,
  clearShowFromAndShowTo,
  timespanSet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanPicker)