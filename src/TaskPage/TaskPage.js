import React from 'react'
import { hashHistory } from 'react-router'
import TaskList from './../TaskList/TaskList'
import TaskDetail from './../TaskDetail/TaskDetail'

class TaskPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id:props.params.id || null
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      id:nextProps.params.id || null
    }))
  }

  handleIdChange = (id) => {
    hashHistory.push('/task-page/' + (id || ''))
  }

  render() {
    return (
        <div>
          {!this.state.id &&

                    <TaskList />
          }

          {this.state.id &&

              <TaskDetail taskid= {this.state.id}/>
          }

        </div>
    )
  }
}

export default TaskPage
