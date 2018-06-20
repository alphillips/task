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
import DateInput from '@react-ag-components/date-input'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import QuickLinks from './../QuickLinks/QuickLinks';
import SvgIcon from 'material-ui/SvgIcon';
import {CSVLink, CSVDownload} from 'react-csv';


const searchOptions = [
  { value: "ASSIGNEDTOME",label: "Assigned to me" },
  { value: "COMPLETED",   label: "Completed" , type : "text"  },
  { value: "DATE_COMPLETED_AFTER",  label: "Completed On or After" , type : "date" },
  { value: "DATE_COMPLETED_BEFORE",  label: "Completed On or Before", type : "date"  },
  { value: "ASSIGNED",    label: "Pending" , type : "text" },
  { value: "DATE_ASSIGNED_AFTER",   label: "Pending - Received On or After", type : "date" },
  { value: "DATE_ASSIGNED_BEFORE",   label: "Pending - Received On or Before", type : "date" }

];


class TaskList extends React.Component {

  constructor(props) {
      super(props);
      console.log(props);
      this.state = {
        searchTypeCode :  props.searchTypeCode || "ASSIGNED",
        searchKeyword: ( props.searchKeyword && props.searchTypeCode && !props.searchTypeCode.includes("DATE")) ? props.searchKeyword :  null,
        searchDate: (props.searchKeyword && props.searchTypeCode && props.searchTypeCode.includes("DATE")) ? props.searchKeyword :  null,
        quickLinkType: props.quickLinkType || null,
        tasks:[],
        success:props.success,
        error:props.error,
      }
  }


  componentDidMount () {
     if(this.props.searchKeyword && this.props.searchTypeCode && !this.props.searchTypeCode.includes("DATE")){
        this.setState({searchKeyword: this.props.searchKeyword})
     }

     if(this.props.searchKeyword && this.props.searchTypeCode && this.props.searchTypeCode.includes("DATE")){
        this.setState({ searchDate : this.props.searchKeyword }  );
        this.searchDate = this.props.searchKeyword;
     }


     if(this.props.quickLinkType && this.props.quickLinkType.length>0){
        this.setState( { quickLinkType :  this.props.quickLinkType } );
     }

     this.refreshTasksList(this.state.searchKeyword , this.state.searchTypeCode , this.state.quickLinkType);

  }



  refreshTasksList = (searchKeyword, searchTypeCode, quickLinkType) => {
      if(quickLinkType && quickLinkType.length>0){
         this.setState({showQuickLinks: true , launchQuickLinkType : quickLinkType});
         this.quicklinksRef.openQuicklink(quickLinkType);
      } else if(searchTypeCode &&  (searchTypeCode=="COMPLETED" || searchTypeCode=="ASSIGNED" ) && searchKeyword)  {
          this.searchTasksByKeywordsInTitle();
      }else if(searchTypeCode &&  (searchTypeCode=="COMPLETED" || searchTypeCode=="ASSIGNED" ||  searchTypeCode=="ASSIGNEDTOME") && !searchKeyword) {
          this.readTasksList();
      }else {
          this.searchByDate();
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

      if(this.state.searchTypeCode == 'DATE_COMPLETED_AFTER' || this.state.searchTypeCode == 'DATE_COMPLETED_BEFORE' ||
         this.state.searchTypeCode == 'DATE_ASSIGNED_AFTER'  || this.state.searchTypeCode == 'DATE_ASSIGNED_BEFORE' ){
        this.searchByDate();
      }else  if(this.state.searchTypeCode == 'ASSIGNEDTOME' || !this.state.searchKeyword){
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
    api.performSearchByTitleKeyword(this.state.searchKeyword, this.state.searchTypeCode).then((data) =>{
      this.setStateKeyVal('tasks', data)
      this.prepareTasksRelatedMessage(data);
    })
  }

  searchByDate = () =>{

    if( !this.searchDate || Date.parse(this.searchDate)==NaN ){
       console.log("Invalid date supplied");
       console.log(this.searchDate);
       this.setStateKeyVal( 'error', 'Date required to search');
       this.prepareTasksRelatedMessage(null);
       return;
    }else{
       this.setStateKeyVal( 'error', '');
    }

    let state;
    let searchType;

    if(this.state.searchTypeCode && this.state.searchTypeCode.includes('ASSIGNED') ){
      state = "ASSIGNED";
    } else  {
      state = "COMPLETED";
    }

    if(this.state.searchTypeCode && this.state.searchTypeCode.includes('DATE_ASSIGNED_AFTER' ) ){
      searchType = "SEARCH_FOR_TASKS_ASSIGNED_AFTER_SUPPLIED_DATE";
    } else if(this.state.searchTypeCode && this.state.searchTypeCode.includes('DATE_ASSIGNED_BEFORE' )) {
      searchType = "SEARCH_FOR_TASKS_ASSIGNED_BEFORE_SUPPLIED_DATE";
    }else if(this.state.searchTypeCode && this.state.searchTypeCode.includes('DATE_COMPLETED_AFTER' )) {
      searchType = "SEARCH_FOR_TASKS_COMPLETED_AFTER_SUPPLIED_DATE";
    }else if(this.state.searchTypeCode && this.state.searchTypeCode.includes('DATE_COMPLETED_BEFORE' )) {
      searchType = "SEARCH_FOR_TASKS_COMPLETED_BEFORE_SUPPLIED_DATE";
    }

    api.getTasksBySearch(state, searchType, this.searchDate ).then((data) =>{
      this.setStateKeyVal('tasks', data)

      this.prepareTasksRelatedMessage(data);

      let url = "tasks/state/"+this.state.searchTypeCode+"/keyword/"+this.searchDate;
      hashHistory.push(url);
    })

  }


  readTasksList = () => {

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
          tasks: data
        })

        this.prepareTasksRelatedMessage(data);
      })
  }

  prepareTasksRelatedMessage = (tasks, quicklinkTypeLabel) => {
    let message = null;
    let quickLinkMessageTxt = "";
    let downloadDataLink = "" ;

    if( quicklinkTypeLabel &&  quicklinkTypeLabel.length>0){
       quickLinkMessageTxt = " ( Quick links / "+quicklinkTypeLabel +" ) ";
    }

    if(tasks !=null && tasks.length==25 ){
       message = " Showing the first 25 results "+ quickLinkMessageTxt  + " "+ downloadDataLink ;
     }else if(tasks !=null){
       message = " Showing "+tasks.length+" results "+ quickLinkMessageTxt + " "+ downloadDataLink ;
     }else {
         message = "  Showing 0 results "+ quickLinkMessageTxt ;
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

          // if(searchOptions[index].value && searchOptions[index].value.includes("DATE")){
          //     this.setState( {searchKeyword : null});
          // }

          this.prepareTasksRelatedMessage();
    };

    onEnter = () => {
          this.searchTasksByKeywordsInTitle();
    };



    doAdvancedSearch = () => {
          let createdDate = new Date(2018, 2, 3)
          var payload = {
            taskState : "ASSIGNED",
            createdDate : createdDate,
            searchType :  "SEARCH_FOR_TASKS_CREATED_BEFORE_SUPPLIED_DATE"
          }
          api.getTasksBySearch(payload).then((data) =>{

          })
    };


     isMatchingSearchOptionFound = (searchType , fieldType) => {

           for(let i=0; i<searchOptions.length; i++) {
               if(searchOptions[i].value == searchType && searchOptions[i].type == fieldType ){
                  return true;
               }
            }

            return false;
     };


     handleDateSelection = (date) => {
             this.setState((prevState, props) => ({
               searchDate: date
             }))
             this.searchDate = date;
     }


     showAssignModal = (assigneeGroups, taskTitle, taskId) =>{
             return (e) => {
                 e.preventDefault();
                 api.fetchEmployeesByGroupName(assigneeGroups).then((data) =>{
                      this.setState({assignModalOpen: true});
                      this.setState({assignees: data});
                      this.setState({assignTaskTitle: taskTitle , assignTaskId : taskId});
                  });
              }
     }

     hideAssignModal = (e) =>{
          //  return (e) => {
             if(e){
               e.preventDefault();
             }

              this.setState({assignModalOpen: false});
          //  }
     }

   handleAssigneeChange = (event, index, value) => {

     this.setState({selectedAssignee : value})

   };

   assignTaskToSomeone = (e) => {

      e.preventDefault();
       if(!this.state.assignTaskId){
         //throw error
       }else if(!this.state.selectedAssignee){
        //throw error
      }else {
         //all good
         var payload= { type:"ASSIGN_TO_SOMEONE" , assigneeName : this.state.selectedAssignee }
         api.performTaskAction(this.state.assignTaskId, payload ).then((data) =>{
             this.refreshTasksList(this.state.searchKeyword , this.state.searchTypeCode, this.state.quickLinkType );
             this.hideAssignModal();
       })
      }


   };

   toggleQuickLink =()=>{
     return(e) => {
       e.preventDefault();
       let quickLinkShowState = !this.state.showQuickLinks;
       this.setState({showQuickLinks: quickLinkShowState });
     }
   }

    setTaskDataOnParent =(data)=> {
      //return(e)=>{
        this.setStateKeyVal('tasks', data);
      //}
    }


 //   rect = (props)=> {
 //       const {ctx, x, y, width, height} = props;
 //       ctx.fillRect(x, y, width, height);
 //   }
 //
 //   updateCanvas = () => {
 //     const ctx = this.refs.canvas.getContext('2d');
 //     ctx.clearRect(0,0, 300, 300);
 //     // draw children “components”
 //     this.rect({ctx, x: 10, y: 10, width: 50, height: 50});
 //     this.rect({ctx, x: 110, y: 110, width: 50, height: 50});
 // }

  render() {

    const headers = [
      {label: 'Title', key: 'title'},
      {label: 'Task ID', key: 'taskId'},
      {label: 'Priority', key: 'priority'},
      {label: 'Created Date', key: 'createdDateFormatted'},
      {label: 'Last Updated By', key: 'updatedBy'},
      {label: 'Updated Date', key: 'updatedDateFormatted'},
      {label: 'Status', key: 'statusLabel'},
      {label: 'Outcome', key: 'outcomeLabel'},

    ];

    const assignTaskModalActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.hideAssignModal}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.assignTaskToSomeone}
      />,
    ];

    const selectFieldStyle = {
      width: "100%",
      'color':'#999'
    };


  let taskCount = 0

    return (
            <div className="task-list-page uikit-grid">

             <Messages success={this.state.success} error={this.state.error}/>

             {this.state.showQuickLinks &&
               <QuickLinks   ref={quicklinksRef => this.quicklinksRef = quicklinksRef}
                     setTaskDataOnParent={this.setTaskDataOnParent}
                     prepareTasksRelatedMessage={this.prepareTasksRelatedMessage}
                     toggleQuickLink={this.toggleQuickLink}
                     launchQuickLinkType={this.state.launchQuickLinkType} />
             }



             <div className="row">
                <div className="col-md-11">  <h1>{this.props.heading || 'Tasks'}</h1> </div>
                 {!this.state.showQuickLinks &&
                    <div className="col-md-1">
                         <a href="#" onClick={this.toggleQuickLink()}>Quick Links</a>
                    {
                       // <SvgIcon>
                       //     <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
                       //   </SvgIcon>
                       }
                      </div>
                  }

             </div>

             <LoadableSection>



             {this.props.showSearch !== false &&
             <div>

             <div>

               <div className="row">

                 <div className="col-md-5">
                         <SelectField
                          floatingLabelText="Show tasks"
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
                 <div className="col-md-5">
                         { this.state.searchTypeCode && this.isMatchingSearchOptionFound(this.state.searchTypeCode, 'text') &&
                           <Input
                             label={"keyword"}
                             id="search"
                             value={this.state.searchKeyword}
                             onChange={this.onSearchFieldChange('searchKeyword')}
                             placeholder="keyword"
                             onEnter={this.onEnter}
                           />
                          }

                          { this.state.searchTypeCode && this.isMatchingSearchOptionFound(this.state.searchTypeCode, 'date') &&
                            <DateInput
                              label="Date"
                              id="date"
                              value={this.state.searchDate}
                              placeholder="Date"
                              handle = {this.handleDateSelection}
                              type="date"/>

                           }

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
                     <div style={{ paddingBottom:"30px",  paddingTop:"20px"}}>
                         {this.state.tasksSearchResultMessage}
                         { this.state.tasks &&   this.state.tasks.length>0 &&
                          <CSVLink
                              filename={'tasks-results.csv'}
                              data={this.state.tasks}
                              headers={headers}>
                              (Download results)
                            </CSVLink>
                         }
                     </div>
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
                          quickLinkType = {this.props.quickLinkType}
                          taskAssigneeGroups = {task.taskAssigneeGroups}
                          showAssignModal = {this.showAssignModal(task.taskAssigneeGroups, task.title, task.taskId)}
                        />
                      </li>
                    )
                 )
               }
             </ul>

             </LoadableSection>

             <Dialog
               title= {"Assign task  (" + this.state.assignTaskTitle + ")"}
               actions={assignTaskModalActions}
               modal={true}
               open={this.state.assignModalOpen}
             >
                  { this.state.assignees  && this.state.assignees.length>0 &&


                   <SelectField
                      floatingLabelText="Choose an assignee"
                      hintText="Select a name"
                      value={this.state.selectedAssignee}
                      autoWidth={true}
                      onChange={this.handleAssigneeChange}
                      style= {{width: '100%'}}
                   >

                   {this.state.assignees.map( (assignee) =>
                      <MenuItem key={assignee} value={assignee} primaryText={assignee} />

                   )}
                   </SelectField>

                 }
             </Dialog>

           </div>



    );
  }
}
export default  TaskList
