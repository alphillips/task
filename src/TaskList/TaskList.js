import React from 'react'

import TaskSummaryCard from './../TaskSummaryCard'
import Input from '@react-ag-components/input'
import * as api from './../api'
import './task-list.css'

import Messages from '@react-ag-components/messages'
import LoadableSection from '@react-ag-components/core/lib/LoadableSection'
import MenuItem from 'material-ui/MenuItem'
import SelectField from "material-ui/SelectField";
import { hashHistory } from "react-router";

const searchOptions = [
  { value: "ASSIGNED", label: "Pending Tasks" },
  { value: "COMPLETED", label: "Completed Tasks" }
];

class TaskList extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        searchTypeCode :  props.searchTypeCode || "ASSIGNED",
        searchKeyword: props.searchKeyword || null,
        tasks:[],
        loading:false,
        success:props.success,
        error:props.error,
      }

  }

  componentDidMount () {
      if(this.props.searchKeyword && this.props.searchKeyword){
        this.setState({searchKeyword: this.props.searchKeyword})
      }

      this.refreshTasksList(this.state.searchKeyword , this.state.searchTypeCode );
  }


  refreshTasksList = (searchKeyword, searchTypeCode) => {

      if(searchTypeCode &&  searchKeyword)  {
          this.searchTasksByKeywordsInTitle();
      }else {
          this.readTasksList();
      }
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
    }
  }

  searchTasksByKeywordsInTitle = () => {
      this.setStateKeyVal('tasks', [])

      if(!this.state.searchKeyword){
            this.readTasksList();
            let url = "tasks/state/"+this.state.searchTypeCode;
            hashHistory.push(url);
      }else{
            this.search();
            let url = "tasks/state/"+this.state.searchTypeCode+"/keyword/"+this.state.searchKeyword;
            hashHistory.push(url);
      }
  }

  search = () =>{
    this.setStateKeyVal('loading', true)

    api.performSearchByTitleKeyword(this.state.searchKeyword, this.state.searchTypeCode).then((data) =>{
      this.setStateKeyVal('tasks', data)
      this.setStateKeyVal('loading', false)
      this.prepareTasksRelatedMessage(data);
    })
  }

  readTasksList = () => {

       this.setState({
         loading:true
       })

      api.fetchUserTasksList(this.state.searchTypeCode).then((data) =>{

        if(this.props.assignedToUser){
          data = data.filter(d => {
            if(d.taskAssignees){
              if(d.taskAssignees[0] && d.taskAssignees[0].assignedToUser.toLowerCase() === this.props.assignedToUser.toLowerCase()){
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

        this.prepareTasksRelatedMessage(data);
      })
  }

  prepareTasksRelatedMessage = (tasks) => {
    let message = null;

    if(tasks !=null && tasks.length==25 ){
      message = "   Showing the first 25 results ";
    }else if(tasks !=null){
      message = "  Showing "+tasks.length+" results ";
    }

    this.setState({tasksSearchResultMessage  : message});
  }

  calculateCommentsButtonLabel = (task) => {

     if(task.taskCustomAttributes.taskCommentsCount>0) {
       return 'Staff notes ('+task.taskCustomAttributes.taskCommentsCount+')'
     }else if(task.taskCustomAttributes.taskCommentsCount==0 && task.state == "COMPLETED"){
       return ""
     }else if(task.taskCustomAttributes.taskCommentsCount==0 && task.state != "COMPLETED"){
      return "Staff note"
     }
  }

  calculateExternalMessagesButtonLabel = (task) => {

     if(task.taskCustomAttributes.taskExternalMessagesCount>0) {
       return 'External messages ('+task.taskCustomAttributes.taskExternalMessagesCount+')'
     }else if(task.taskCustomAttributes.taskExternalMessagesCount==0 && task.state == "COMPLETED"){
       return ""
     }else if(task.taskCustomAttributes.taskExternalMessagesCount==0 && task.state != "COMPLETED"){
      return "External message"
     }
  }

  hasComments = (task) => {
    return task.taskCustomAttributes.taskCommentsCount>0
  }

  hasExternalMessages = (task) => {
    return task.taskCustomAttributes.taskExternalMessagesCount>0
  }

  taskCommpleted = (task) => {
    return task.state == "COMPLETED";
  }

  setStateKeyVal = (key,val) => {
        this.setState((prevState, props) => ({
            [key]: val
        }))
  }


  onChange = (id) => {
    this.props.onChange(id)
  }

  setSearchTypeCode = (event, index) => {
    this.setState((prevState, props) => ({
      searchTypeCode: searchOptions[index].value,
      searchTypeLabel: searchOptions[index].label,
      searchTypeIndex: index,
      tasks: null,
      validationMessages: null,
      selectFieldClassName: "medium-width"
    }));

    if(searchOptions[index].label === "Client Name") {
      this.setState((prevState, props) => ({
        selectFieldClassName: "small-width"
      }));
    }
  };

    onEnter = () => {
          this.searchTasksByKeywordsInTitle();
    }


  render() {

    const selectFieldStyle = {
      width: "100%",
      'color':'#999'
    };


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

                 <div className="col-md-3">
                         <SelectField
                          floatingLabelText="Search in....."
                          onChange={this.setSearchTypeCode}
                          value={this.state.searchTypeCode}
                          style={selectFieldStyle}
                          floatingLabelStyle={selectFieldStyle}
                          className="search custom-width"
                             onEnter={this.onEnter}
                        >
                          {searchOptions.map((searchOption) =>
                            <MenuItem key={searchOption.value} value={searchOption.value} primaryText={searchOption.label} />
                          )}
                        </SelectField>
                 </div>
                 <div className="col-md-7">

                           <Input
                             label={"keyword"}
                             id="search"
                             value={this.state.searchKeyword}
                             onChange={this.onSearchFieldChange('searchKeyword')}
                             placeholder="keyword"
                             onEnter={this.onEnter}
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

            { this.state.tasksSearchResultMessage!=null &&
                    <div style={{ paddingBottom:"10px"}}> {this.state.tasksSearchResultMessage} </div>
            }


             <ul className="task-list">
               { this.state.tasks &&
                 this.state.tasks.map((task) => (
                      <li key={taskCount++}>
                        <TaskSummaryCard
                          task={task}
                          type={task.title}
                          createdDate={ this.getCreatedDateDisplayString(task.createdDate)}
                          lastUpdatedDate={ this.getLastUpdatedDateDisplayString(task.updatedDate)}
                          updatedBy={task.updatedBy}
                          priority= {task.priority}
                          assigned= {task.taskCustomAttributes.taskAssignees && task.taskCustomAttributes.taskAssignees[0]}
                          taskid={task.taskId}
                          commentsButtonLabel = {this.calculateCommentsButtonLabel(task)}
                          externalMessagesButtonLabel = {this.calculateExternalMessagesButtonLabel(task)}
                          hasComments={this.hasComments(task)}
                          hasExternalMessages={this.hasExternalMessages(task)}
                          taskCommpleted={this.taskCommpleted(task)}
                          refreshTasksList={this.refreshTasksList}
                          statusLabel={task.statusLabel}
                          description={task.description}
                          onChange={this.onChange}
                          searchKeyword = {this.props.searchKeyword}
                          searchTypeCode = {this.props.searchTypeCode}
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
