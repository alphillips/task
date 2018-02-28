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
import moment from 'moment'

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
        loading:false
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




  performApproveOrRejectTaskAction = (outcome) => {


       if( this.props.taskid &&   outcome){
           this.setState({ loading : true});
           this.setState({ task :  [] });
           var payload= {value: outcome.name, type:"APPROVE_OR_REJECT" }
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

  render() {

    let count = 0
    let commentCount = 0

    return (

      <div className="task-detail">


       <Messages success={this.state.success}  error={this.state.error}/>

       {  !this.state.messagesSectionOpened  &&
           <BackButton />
       }




      <LoadableSection>

            {  !this.state.messagesSectionOpened  &&
                  <div className="task uikit-grid">
                    <div className="row">
                        <div className="col-md-9">
                          <h2 className="uikit-display-2">{this.state.task.title}</h2>
                        </div>
                        <div className="col-md-3">
                          <div className="task-status">{this.state.task.statusLabel}</div>
                          <div className="task-date">Created on: {this.getCreatedDateDisplayString(this.state.task.createdDate)}</div>
                          <div className="task-date">Priority: {this.state.task.priority}</div>
                        </div>
                    </div>
                  </div>
           }

          {  !this.state.messagesSectionOpened  &&

          <div className="task uikit-grid">

                      <div className="row task-detail-body">
                        <div className="col-md-12" style={{'backgroundColor': '#fafafa', 'padding':'20px'}}>
                          <div dangerouslySetInnerHTML={{__html: this.state.task.payloadHtml}}></div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7"></div>
                        <div className="col-md-5 btn-group">
                          { this.state.task.taskPossibleOutcomes &&
                            this.state.task.state != 'COMPLETED' &&
                            this.state.task.taskPossibleOutcomes.sort((a, b)=>{
                              if(b.name === 'APPROVE') return 1;
                              return -1;
                           }).map((outcome) => (
                              <div key={count++} style={{float: 'left'}}>
                                {outcome.name === 'APPROVE' &&
                                  <button className="uikit-btn main-btn" onClick={() =>this.performApproveOrRejectTaskAction( outcome )}>
                                  {outcome.name}
                                  </button>
                                }
                                {outcome.name !== 'APPROVE' &&
                                  <button className="uikit-btn uikit-btn--tertiary" onClick={() =>this.performApproveOrRejectTaskAction( outcome )}>
                                  {outcome.name}
                                  </button>
                                }
                              </div>
                            ))
                          }
                        </div>
                      </div>

                    </div>
                 }


        </LoadableSection>



        { window.IS_STAFF && this.state.task && this.state.task.serviceRequestId &&  this.state.task.serviceRequestId.length>0 &&
          <TaskCorrespondences task={this.state.task} serviceRequestId={this.state.task.serviceRequestId}  callbackOpenParentTask={this.callbackOpenParentTask}  callbackCloseParentTask={this.callbackCloseParentTask}  callbackShowMessage={this.callbackShowMessage} />
        }


        { window.IS_STAFF && this.state.task &&  !this.state.messagesSectionOpened  &&
          <TaskComments task={this.state.task} taskid={this.taskid } serviceRequestId={this.state.task.serviceRequestId} callbackShowMessage={this.callbackShowMessage}/>
        }


     </div>

    )
  }
}
export default TaskDetail
