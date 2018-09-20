import React ,{Component} from 'react'

export class JobOpening extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title ? this.props.title : 'title',
      description: this.props.description ? this.props.description : 'description'
    }
  }
  render() {
    const {title, description} = this.state
    return (
    <div className='admin-login-card'>
    <h3>Skrattista</h3>
      <h2 className='admin-login-card__title'>{title}</h2>
      <div>
        <p>{description}</p>
      </div>
    </div>
    )
  }
}

export default JobOpening