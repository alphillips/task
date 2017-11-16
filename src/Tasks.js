import React from 'react'

import BackButton from '@react-ag-components/back-button'

import TaskList from './TaskList/TaskList'
import TaskDetail from './TaskDetail/TaskDetail'
import Messages from '@react-ag-components/messages'

class Tasksx extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id:props.id || null
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      id:nextProps.id || null
    }))
  }

  goBack = () => {
    this.props.onChange(null)
  }

  onTaskClick = (id) => {
    if(id){
      this.setMessage(null)
    }
    this.props.onChange(id)
  }

  setMessage = (message) => {
    this.setState({success:message})
  }

  render() {
    return (
      <div>

        {!this.state.id &&
          <div>
          <Messages success={this.state.success}/>
            <TaskList onChange={this.onTaskClick}/>
          </div>
        }

        {this.state.id &&
          <div>
            <TaskDetail
              taskid={this.state.id}
              setMessage={this.setMessage}
              onChange={this.onTaskClick}
            />
          </div>
        }

      </div>
    )
  }
}

export default Tasksx
