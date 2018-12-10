import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addShowFrom, addShowTo, clearShowFromAndShowTo, timespanHasBeenSet } from '../../redux/actions/actions'
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
    if (this.props.setTimespan && this.props.showFrom) {
      const now = moment()
      const copiedShowFrom = moment(this.props.showFrom)

      const notEditing = this.props.modeIsNotEdit
      if (notEditing && now.isBefore(copiedShowFrom)) {
        this.setState({ showFrom: copiedShowFrom })
      } else {
        this.setState({ showFrom: now })
      }

      if (this.props.showTo) {
        this.setState({ showTo: moment(this.props.showTo) })
      }
      this.props.timespanHasBeenSet()
    } else if (!this.props.setTimespan) {

      const now = moment().startOf('day')
      this.setState({ showFrom: now })

      const formattedDate = now.toLocaleString()
      this.props.addShowFrom(formattedDate)

    }
  }

  componentDidUpdate() {
    if (this.props.setTimespan && this.props.showFrom) {

      this.setState({ showFrom: moment(this.props.showFrom) })

      if (this.props.showTo) {
        this.setState({ showTo: moment(this.props.showTo) })
      }

      this.props.timespanHasBeenSet()
    }
  }

  componentWillUnmount() {
    this.props.clearShowFromAndShowTo()
  }

  handleShowFromChange = async date => {
    if (!date) {
      await this.setState({
        showFrom: null,
        showTo: null
      })
      this.props.addShowFrom(null)
      this.props.addShowTo(null)
      return
    }

    if (!this.state.showTo || date.isSameOrBefore(this.state.showTo)) {
      await this.setState({
        showFrom: date,
        error: ''
      })
      const formattedDate = date.toLocaleString()
      this.props.addShowFrom(formattedDate)
    } else {
      this.setState({
        error: 'Selected date needs to be before end date'
      })
    }
  }

  handleShowToChange = async date => {

    if (date !== undefined && (date === null || date.isSameOrAfter(this.state.showFrom))) {
      await this.setState({
        showTo: date,
        error: ''
      })

      const formattedDate = date ? date.toLocaleString() : null
      this.props.addShowTo(formattedDate)

    } else if (date) {
      this.setState({
        error: 'Selected date needs to be same or after start date'
      })
    }
  }

  render() {
    const { showFrom, showTo } = this.state
    const now = moment()
    const laterDateOfShowFromAndNow = showFrom && now.isBefore(showFrom) ? showFrom : now
    const showToMinDate = moment(laterDateOfShowFromAndNow)

    return (
      <div>
        <div className='timespan-picker'>
          Visible from
          <DatePicker
            className='timespan-picker__datepicker'
            selected={showFrom}
            dateFormat='DD.MM.YYYY'
            timeFormat='timeFormat="HH:mm'
            placeholderText='Select start date'
            isClearable={true}
            minDate={now}
            onChange={this.handleShowFromChange} />
          to
          <DatePicker
            className='timespan-picker__datepicker'
            selected={showTo}
            dateFormat='DD.MM.YYYY'
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
  setTimespan: PropTypes.bool,
  notEditing: PropTypes.bool
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
  timespanHasBeenSet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanPicker)