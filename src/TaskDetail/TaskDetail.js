import React from 'react'
import { hashHistory } from 'react-router'

import Input from '@react-ag-components/input'
import BackButton from '@react-ag-components/back-button'
import * as api from './../api'
import './task-detail.css'
// import { Grid, Row, Col } from 'react-flexbox-grid'
import LoadableSection from '@react-ag-components/core/lib/LoadableSection'
import Messages from '@react-ag-components/messages'

import TaskCorrespondences from './../TaskCorrespondences/TaskCorrespondences'
import TaskComments from './../TaskComments/TaskComments'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from "react-router";
import moment from 'moment';
import Modal from 'react-aria-modal';
import Dialog from 'material-ui/Dialog';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

const style2 = {
  margin: 12,
};

class TaskDetail  extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        task:'',
        selectedAction:'',
        comments:[],
        newcomment:[],
        loading:false,
        showMore: false,
      }

      this.taskid = props.taskid || null
  }

  onChange = (field) => {
    return (value) => {
      this.setState((prevState, props) => ({
        [field]: value
      }))
    }
  }

  componentDidMount() {

      this.readTaskDetailsById()
  }

  readTaskDetailsById = () => {

      this.setState({loading : true})

      if(this.props.taskid) {
            api.fetchTaskDetailsById(this.props.taskid).then((data) => {
              this.setState({ task : data})
              this.setState({ comments : data.comments==null?[]:data.comments})
              this.setState({ loading : false})
          })
      }
  }



  handleTaskActionButtonClick = (outcome) => {

      this.setState((prevState, props) => ({
        showModal: true,
        taskActionReason:'',
        outcome : outcome,
        taskActionReasonNotSupplied : false
      }))
  }

  handleTaskAction = () => {

       if(this.state.taskActionReason && this.state.taskActionReason.trim().length>0 && this.state.outcome){
          this.performApproveOrRejectTaskAction(this.state.outcome);
          this.setState({showModal:false, outcome: null});
       }else {
         this.setState({taskActionReasonNotSupplied:true});
       }
  }



  performApproveOrRejectTaskAction = (outcome) => {

     if( this.props.taskid &&   outcome){
         this.setState({ loading : true});
         this.setState({ task :  [] });
         var payload= {value: outcome.name, type:"APPROVE_OR_REJECT" , actionReason: this.state.taskActionReason }
         api.performTaskAction(this.props.taskid, payload ).then((data) =>{
            // this.readTaskDetailsById();
            // this.setStateKeyVal('loading', false)
            let message = 'Task ' + (outcome.name === 'APPROVE' ? 'approved' : 'rejected')

            // APPROVE
            // hashHistory.push('/tasks')
            this.props.onChange(null)
            this.props.setMessage(message)
       })
   }
  }



  getCreatedDateDisplayString = (millisecs) => {
    return   this.formatDateToString(millisecs)
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



  callbackCloseParentTask = () => {
    this.setState((prevState, props) => ({
      messagesSectionOpened : true
    }));
  };

  callbackOpenParentTask = () => {
    this.setState((prevState, props) => ({
      messagesSectionOpened : false
    }));
  };

  callbackShowMessage = (type, msg) => {
    this.setState((prevState, props) => ({
        [type]:msg
     }));
  }

  cancelDisable = () => {
    this.setState((prevState, props) => ({
      showModal: false
    }))
  }

  chooseDisplayLabel = (taskStatusLabel) => {

       if(taskStatusLabel == 'APPROVED') {
         return "approved-status";
       }else if(taskStatusLabel == 'REJECTED'){
         return "rejected-status";
       }else {
         return "task-status";
       }
  }

  toggleShowMore = (e) => {
    e.preventDefault();
    if(this.state.showMore){
      this.setState((prevState, props) => ({
        showMore: false
      }))
    }else {
      this.setState((prevState, props) => ({
        showMore: true
      }))
    }
  }

  render() {

    let count = 0
    let commentCount = 0

    return (

      <div className="task-detail">




       {  !this.state.messagesSectionOpened  &&
          <div>
            <Messages success={this.state.success}  error={this.state.error}/>
            <BackButton />
          </div>
       }




      <LoadableSection>

            {  !this.state.messagesSectionOpened  &&
                  <div className="task uikit-grid">
                    <div className="row">
                        <div className="col-md-8">
                          <h2 className="uikit-display-2">{this.state.task.title}</h2>
                        </div>
                        <div className="col-md-4">
                          <div className={this.chooseDisplayLabel(this.state.task.statusLabel)}>{this.state.task.statusLabel}</div>
                          <div className="task-date"><strong>Priority</strong>: {this.state.task.priority}</div>
                          <div className="task-date"><strong>Created on</strong>: {this.getCreatedDateDisplayString(this.state.task.createdDate)}</div>
                          <div className="task-date"><strong>Last updated on</strong>: {this.getCreatedDateDisplayString(this.state.task.updatedDate)}</div>
                        </div>
                    </div>



                    {  window.IS_STAFF && this.state.task.state =="COMPLETED" && this.state.showMore &&
                    <div className="row">
                       <div className="col-md-12">
                         <div className="task-date"><strong>Last updated by</strong>: {this.state.task.updatedBy}</div>
                         <div className="task-date"><strong>Task action outcome </strong>: {this.state.task.outcomeLabel}</div>
                         <div className="task-date"><strong>Task action  reason </strong> : {this.state.task.taskCustomAttributes.taskActionReason == null ? ' Nill ' : ''}  </div>
                         <div className="task-date"> {this.state.task.taskCustomAttributes.taskActionReason} </div>
                       </div>
                    </div>
                    }

                    { window.IS_STAFF  && this.state.task.state =="COMPLETED" &&
                      <div className="task-date"> <a href="#" onClick={this.toggleShowMore} title={!this.state.showMore ?   " Show more " : " hide "} > {!this.state.showMore ?   " (+) ": " (-) "}</a></div>
                    }
                  </div>
           }

           {  !this.state.messagesSectionOpened  &&

              <div className="task uikit-grid">
                  <div className="row task-detail-body">
                    <div className="col-md-12" style={{'backgroundColor': '#fafafa', 'padding-left':'20px', 'padding-right':'20px', }}>
                      <div dangerouslySetInnerHTML={{__html: this.state.task.payloadHtml}}></div>
                    </div>
                  </div>

                  <div className="btn-group outcome">
                    { this.state.task.taskPossibleOutcomes &&
                      this.state.task.state != 'COMPLETED' &&
                      this.state.task.taskPossibleOutcomes.sort((a, b)=>{
                        if(b.name === 'APPROVE' || b.name.toLowerCase().indexOf('reprint') > -1) return 1;
                        return -1;
                     }).map((outcome) => (
                        <div key={count++} style={{float: 'left'}}>
                          {(outcome.name === 'APPROVE' || outcome.name.toLowerCase().indexOf('reprint') > -1 )&&
                            <button className="uikit-btn main-btn" onClick={() =>this.performApproveOrRejectTaskAction( outcome )}>
                            {outcome.name}
                            </button>
                          }
                          {(outcome.name !== 'APPROVE' && outcome.name.toLowerCase().indexOf('reprint') === -1) &&
                            <button className="uikit-btn uikit-btn--tertiary" onClick={() =>this.handleTaskActionButtonClick( outcome )}>
                            {outcome.name}
                            </button>
                          }
                        </div>
                      ))
                    }
                  </div>
                </div>
             }


        </LoadableSection>



          { window.IS_STAFF && this.state.task && this.state.task.serviceRequestId &&  this.state.task.serviceRequestId.length>0 &&
            <TaskCorrespondences task={this.state.task} taskid={this.taskid } serviceRequestId={this.state.task.serviceRequestId}  callbackOpenParentTask={this.callbackOpenParentTask}  callbackCloseParentTask={this.callbackCloseParentTask}  callbackShowMessage={this.callbackShowMessage} />
          }


          { window.IS_STAFF && this.state.task &&  !this.state.messagesSectionOpened  &&
            <TaskComments task={this.state.task} taskid={this.taskid } serviceRequestId={this.state.task.serviceRequestId} callbackShowMessage={this.callbackShowMessage}/>
          }


          <Dialog
              title="Please provide a reason for your decision before this action can be executed"
              modal={true}
              open={this.state.showModal}
              onRequestClose={this.cancelDisable}
            >
            { this.state.taskActionReasonNotSupplied &&
              <p style={{color: 'red'}}> Please provide the reason for your decision </p>

            }
            <Input
              label="Reason"
              value={this.state.taskActionReason}
              onChange={this.onChange('taskActionReason')}
              rows={2}
              multiLine={true}
              maxlength="1900"
              id="taskActionReason"
            />

            <div className="btn-group">
              <button className="uikit-btn " onClick={this.handleTaskAction}>SUBMIT</button>
              <button className="uikit-btn uikit-btn--tertiary main-btn" onClick={this.cancelDisable}>CANCEL</button>

            </div>
          </Dialog>

     </div>

    )
  }
}
export default TaskDetail
