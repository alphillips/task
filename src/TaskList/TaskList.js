import React from 'react'
// import { Link,hashHistory } from 'react-router'
import TaskSummaryCard from './../TaskSummaryCard'
import Input from '@react-ag-components/input'
import * as api from './../api'
import './task-list.css'
// import { Grid, Row, Col } from 'react-flexbox-grid'
// import Spinner from 'react-spinner-material'
// import Messages from '@react-ag-components/messages'
import Messages from '@react-ag-components/messages'
import LoadableSection from '@react-ag-components/core/lib/LoadableSection'

class TaskList extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        searchKeyword:'',
        tasks:[],
        loading:false,
        success:props.success,
        error:props.error,
      }

  }

  componentDidMount () {
      this.readTasksList()
  }

  formatDateToString = (millisecs) => {
    var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
    var d = new Date(millisecs);
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var dateString = curr_date + " " + m_names[curr_month]   + " " + curr_year;
    return dateString;
  }

  getCreatedDateDisplayString = (millisecs) => {
    return " Created : "+   this.formatDateToString(millisecs)
  }

  getLastUpdatedDateDisplayString = (millisecs) => {
    return " Last updated : "+   this.formatDateToString(millisecs)
  }

  getAssignedUserDisplayString = (assignedUserName) => {
    return " Assigned to : "+   assignedUserName
  }

  onChange = (field) => {
    return (value) => {
      this.setState((prevState, props) => ({
        [field]: value
      }))
    }
  }

  onSearchFieldChange = (field) => {
    return (value) => {
      this.setState((prevState, props) => ({
        [field]: value
      }))

      if(value.length>3){
          //do search by searchKeyword && refresh the list of tasks
        //  this.searchTasksByKeywordsInTitle(value)
      }else if(value.length == 0){
          this.readTasksList()
      }
    }
  }

  searchTasksByKeywordsInTitle = () => {
      this.setStateKeyVal('tasks', [])

      if(!this.state.searchKeyword){
            this.readTasksList()
      }else{
            this.search()
      }
  }

  search = () =>{

    this.setStateKeyVal('loading', true)

    api.performSearchByTitleKeyword(this.state.searchKeyword).then((data) =>{
      this.setStateKeyVal('tasks', data)
      this.setStateKeyVal('loading', false)
    })
  }

  readTasksList = () => {

       this.setState({
         loading:true
       })

      api.fetchUserTasksList().then((data) =>{

        if(this.props.assignedToUser){
          data = data.filter(d => {
            if(d.taskAssignees){
              if(d.taskAssignees[0] && d.taskAssignees[0].assignedToUser === this.props.assignedToUser){
                return true
              }
            }
            return false
          })
        }

        if(this.props.taskCount){
          this.props.taskCount(data.length)
        }

        this.setState({
          tasks: data,
          loading:false
        })
      })
  }



  calculateCommentsButtonLabel = (task) => {

     if(task.commentsCount>0) {
       return 'Comments ('+task.commentsCount+')'
     }else if(task.commentsCount==0 && task.state == "COMPLETED"){
       return ""
     }else if(task.commentsCount==0 && task.state != "COMPLETED"){
      return "Comment"
     }
  }

  hasComments = (task) => {
    return task.commentsCount>0
  }


  setStateKeyVal = (key,val) => {
        this.setState((prevState, props) => ({
            [key]: val
        }))
  }


  onChange = (id) => {
    this.props.onChange(id)
  }

  render() {


  let taskCount = 0

    return (
            <div className="task-list-page">

              <Messages success={this.state.success} error={this.state.error}/>

             <h1>{this.props.heading || 'Tasks'}</h1>

             <LoadableSection>

             {this.props.showSearch !== false &&
             <div>
             <div className="task uikit-grid">
               <div className="row">
                 <div className="col-md-10">

                           <Input
                             label={"Search tasks"}
                             id="search"
                             value={this.state.searchKeyword}
                             onChange={this.onSearchFieldChange('searchKeyword')}
                             placeholder="Search tasks..."
                           />

                 </div>
                 <div className="col-md-2">
                   <div>
                           <button className="uikit-btn main-btn" id="task-list-search-btn" onClick={this.searchTasksByKeywordsInTitle}>Search</button>
                   </div>
                 </div>
               </div>
             </div>
             </div>
            }


             <ul className="task-list">
               { this.state.tasks &&
                 this.state.tasks.map((task) => (
                      <li key={taskCount++}>
                        <TaskSummaryCard
                          type={task.title}
                          createdDate={ this.getCreatedDateDisplayString(task.createdDate)}
                          lastUpdatedDate={ this.getLastUpdatedDateDisplayString(task.lastUpdatedDate)}
                          updatedBy={task.updatedBy}
                          priority= {task.priority}
                          assigned= {task.taskAssignees && task.taskAssignees[0].assignedToUser}
                          taskid={task.taskId}
                          commentsButtonLabel = {this.calculateCommentsButtonLabel(task)}
                          hasComments={this.hasComments(task)}
                          refreshTasksList={this.readTasksList}
                          statusLabel={task.statusLabel}
                          description={task.description}
                          onChange={this.onChange}
                        />
                      </li>
                    )
                 )
               }
             </ul>

             </LoadableSection>

           </div>



    );
  }
}
export default  TaskList
