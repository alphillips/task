import React from 'react'
import { hashHistory } from 'react-router'

import * as api from './../api'
import './task.css'
import Spinner from 'react-spinner-material'
import Input from '@react-ag-components/input'



class TaskSummaryCard extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        comments:props.comments || [],
        taskid:props.taskid || null,
        commentInputText:''
      }
  }

  goToTaskDetailsPage = (e) =>{
    e.preventDefault()
    this.props.onChange(this.props.taskid)
  }

  onTaskClick = (id) => {
    return (e) => {
      e.preventDefault()
      this.props.onChange(id)
    }
  }

  assignTaskToMe = (e) =>{
    e.preventDefault()
        if( this.props.taskid ){
              var payload= { type:"ASSIGN_TO_SOMEONE" }
              api.performTaskAction(this.props.taskid, payload ).then((data) =>{
                if(this.props.refreshTasksList){
                  this.props.refreshTasksList()
                }
            })
        }
  }

  unAssignTaskFromMe = (e) =>{
    e.preventDefault()

    if( this.props.taskid ){
              var payload= { type:"UNASSIGN_A_TASK" }
              api.performTaskAction(this.props.taskid, payload ).then((data) =>{
                if(this.props.refreshTasksList){
                  this.props.refreshTasksList()
                }
            })
    }

  }

  addComment = () => {
    if( this.props.taskid &&  this.state.commentInputText && this.state.commentInputText.trim().length>0){
        //this.setStateKeyVal('loading',true)
        var payload = {comment: this.state.commentInputText }
        api.addComment(this.props.taskid, payload ).then((data) =>{
          if(this.props.refreshTasksList){
            this.props.refreshTasksList()
          }
      })
    }
  }

  onCommentKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Do code here
      //ev.preventDefault();
      this.addComment()
    }
  }

  onCommentTextChange = (e) => {
  //  let val = e.target.value
    this.setState((prevState, props) => ({
      commentInputText: e
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

    return (
      <div className="task uikit-grid main-paper">

        <div className="row">
          <div className="col-md-10">
            <div className="task-title"><a href="#" onClick={this.goToTaskDetailsPage}>{this.props.type}</a></div>
          </div>
          <div className="col-md-2">
            <div className={this.chooseDisplayLabel(this.props.statusLabel)}>{this.props.statusLabel}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {this.props.description}
          </div>
          <div className="col-md-6">
            <div className="task-date">{this.props.createdDate}</div>
            <div className="task-date">{this.props.lastUpdatedDate}</div>
            {this.props.assigned &&
              <div className="task-date">
                Assigned: {this.props.assigned}
              </div>
            }
          </div>
        </div>


        <div className="row task-btns">
          {window.IS_STAFF &&
            <div className="col-md-6">
              {this.props.hasComments &&
                    <a href="#" className="message-link" onClick={this.goToTaskDetailsPage}>{this.props.commentsButtonLabel}</a>
              }

              {this.props.hasExternalMessages &&
                  <span>&nbsp;  <a href="#" className="mail-link" onClick={this.goToTaskDetailsPage}>{this.props.externalMessagesButtonLabel}</a> </span>
              }



              {!this.props.hasComments && !this.props.taskCommpleted &&
                <div>
                  <Input
                    label="Add a staff note"
                    value={this.state.commentInputText}
                    onChange={this.onCommentTextChange}
                    onKeyPress={this.onCommentKeyPress}
                    rows={2}
                    multiLine={true}
                    maxlength="1900"
                  />

                </div>
              }
            </div>
          }


          {window.IS_STAFF && !this.props.taskCommpleted &&
            <div className="col-md-6 assign-btns">
            {this.props.hasComments &&
              <div>
                {this.props.assigned==null &&
                  <a href="#" className="assign-link" onClick={this.assignTaskToMe}>Assign to me</a>

                }

                {this.props.assigned!=null &&
                  <a href="#"  className="unassign-link" onClick={this.unAssignTaskFromMe}>Unassign</a>
                }
              </div>
            }
            </div>
          }


        </div>

        {window.IS_STAFF && !this.props.taskCommpleted &&
          <div className="row">
            <div className="col-md-6">
              {!this.props.hasComments &&
                <div>
                  <button className="uikit-btn uikit-btn--tertiary comment-btn" onClick={this.addComment}>
                      Add
                  </button>
                </div>
              }
            </div>
            <div className="col-md-6 assign-btns">

            {!this.props.hasComments &&
              <div>
                {this.props.assigned==null &&
                  <a href="#" className="assign-link" onClick={this.assignTaskToMe}>Assign to me</a>

                }

                {this.props.assigned!=null &&
                  <a href="#"  className="unassign-link" onClick={this.unAssignTaskFromMe}>Unassign</a>
                }
              </div>
            }
            </div>
          </div>
        }

      </div>
    )
  }
}
export default TaskSummaryCard;
