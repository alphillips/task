import React from 'react'
import { hashHistory } from 'react-router'

// import { Grid, Row, Col } from 'react-flexbox-grid'
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

  // goToCommentsPage = () =>{
  //    hashHistory.push('/tasks/' + this.props.taskid + '/comments' )
  // }

  goToTaskDetailsPage = (e) =>{
    e.preventDefault()
    // hashHistory.push('/task-page/' + this.props.taskid + '/' )
    this.props.onChange(this.props.taskid)
    // return (e) => {
    //   e.preventDefault()
    //   this.props.onChange(this.props.taskid )
    // }

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
    if( this.props.taskid &&  this.state.commentInputText != ''){
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


  render() {

    // const comments = this.props.comments
    // let commentsLabel = 'Comment'
    // if (comments && comments.length > 0){
    //   commentsLabel = comments.length + ' Comments ('+comments.length+')'
    // }

    return (
      <div className="task uikit-grid main-paper">

        <div className="row">
          <div className="col-md-10">
            <div className="task-title"><a href="#" onClick={this.goToTaskDetailsPage}>{this.props.type}</a></div>
          </div>
          <div className="col-md-2">
            <div className="task-status">{this.props.statusLabel}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            {this.props.description}
          </div>
          <div className="col-md-3">
            <div className="task-date">{this.props.createdDate}</div>
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

              {!this.props.hasComments &&
                <div>
                  <Input
                    label="Add a comment"
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


          {window.IS_STAFF &&
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

        {window.IS_STAFF &&
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

        {/*
        <Row bottom="lg" className="task-bottom-row">
          <Col xs={4} sm={4} lg={3} >
              <button className="uikit-btn uikit-btn--tertiary" onClick={this.goToCommentsPage}>
                 <span className="comment-icon"></span>
                {this.props.commentsButtonLabel}
              </button>
          </Col>
          <Col xs={4} sm={4} lg={3} >
              <button className="uikit-btn uikit-btn--tertiary" onClick={this.goToTaskDetailsPage}>
                 View
              </button>
          </Col>
          <Col xs={4} sm={4} lg={3} >
              {this.props.assigned==null &&
                <button className="uikit-btn uikit-btn--tertiary" onClick={this.assignTaskToMe}>
                   Assign to me
                </button>
              }

              {this.props.assigned!=null &&
                <button className="uikit-btn uikit-btn--tertiary" onClick={this.unAssignTaskFromMe}>
                   Unassign
                </button>
              }

          </Col>
          <Col xs={0} sm={0} lg={3} >
            { this.props.assigned!=null &&
               <div className="assigned">Assigned to: {this.props.assigned}</div>
             }
          </Col>
        </Row>
        */}

      </div>
    )
  }
}
export default TaskSummaryCard;
