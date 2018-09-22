import React ,{ Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/actions'

export class JobPosting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title ? this.props.title : 'Junior fullstack developer',
      description: this.props.description ? this.props.description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a nulla eget elit eleifend tristique. Aenean placerat urna sit amet turpis consequat, placerat rhoncus neque sollicitudin. Aliquam cursus ornare tortor in suscipit. Proin eu mauris augue. Praesent efficitur bibendum magna, sit amet rutrum turpis vehicula non. Integer vehicula pellentesque pharetra. Nunc eleifend erat eget velit dignissim, eget vehicula nisl venenatis. Nunc aliquam sit amet purus eu imperdiet. Sed nibh magna, lobortis laoreet dolor ut, dapibus pellentesque justo. Phasellus venenatis vehicula neque sed lacinia. Integer facilisis bibendum cursus.Mauris dictum porta arcu, dapibus mattis lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis posuere ullamcorper consectetur. Vivamus tincidunt quam vitae massa dapibus, sed accumsan mauris tempor. Integer nec urna eget tellus facilisis vulputate. Cras mattis libero nulla, quis sagittis urna mattis at. Integer ultrices mauris molestie maximus consequat. Aenean dolor mi, luctus id nulla et, pellentesque semper nisi. Sed rutrum, lectus vitae ullamcorper imperdiet, ipsum massa tincidunt metus, ut malesuada justo urna eu nisi. Integer est quam, luctus a massa in, gravida lacinia metus. Aenean enim felis, rhoncus nec suscipit vitae, eleifend ac nunc. Sed id libero quis mi fermentum cursus et laoreet velit.',
      applicantName: '',
      applicantEmail: ''
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { applicantName, applicantEmail } = this.state
    this.props.sendApplication(applicantName, applicantEmail)
    
    this.setState({
      applicantName: '',
      applicantEmail: ''
    })
  }

  render() {
    const { title, description, applicantName, applicantEmail } = this.state
    /* TODO: Add error message to page
    const errorMessage = this.props */
    return (
      <div className='posting'>
        <h2 className='posting__title'>{title}</h2>
        <p className='posting__description'>{description}</p>
        <form className='posting__form' onSubmit={this.handleSubmit}>
          <div className='posting__form-container'>
            <input
              required
              className='posting__form-input'
              id='applicantName'
              placeholder='Full name'
              value={applicantName}
              onChange={this.handleChange}
            ></input>
            <input
              required
              className='posting__form-input'
              id='applicantEmail'
              placeholder='Email'
              value={applicantEmail}
              onChange={this.handleChange}
            ></input>
            <button
              className='posting__submit-button'
              type='submit'>
            Send
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  errorMessage: state.postingReducer.errorMessage,
})

const mapDispatchToProps = {
  ...actions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPosting)