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
      showFrom: null,
      showTo: null,
      error: ''
    }
    this.handleShowFromChange = this.handleShowFromChange.bind(this)
    this.handleShowToChange = this.handleShowToChange.bind(this)
  }


  handleShowFromChange(date) {
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
        const formattedDate = moment(date).format('YYYY-MM-DD')
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
      let formattedDate = moment(date).format('YYYY-MM-DD')
      this.props.addShowTo(formattedDate)

      formattedDate = moment(this.state.showFrom).format('YYYY-MM-DD')
      this.props.addShowFrom(formattedDate)

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
  showFrom: PropTypes.string,
  showTo: PropTypes.string
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