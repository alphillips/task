import React from 'react'
import { hashHistory } from 'react-router'

import Input from '@react-ag-components/input'
import BackButton from '@react-ag-components/back-button'
import * as api from './../api'
import './task-detail.css'
// import { Grid, Row, Col } from 'react-flexbox-grid'
import LoadableSection from '@react-ag-components/core/lib/LoadableSection'
import Messages from '@react-ag-components/messages'

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
    //  this.taskid = props.params.taskid || null
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
      { //this.readComments()
      }
  }

  readTaskDetailsById = () => {

      this.setStateKeyVal('loading',true)

      if(this.props.taskid){
            api.fetchTaskDetailsById(this.props.taskid).then((data) => {
                this.setStateKeyVal('task', data)
                this.setStateKeyVal('comments', data.comments==null?[]:data.comments)
                this.setStateKeyVal('loading', false)
          })
      }
  }




  performApproveOrRejectTaskAction = (outcome) => {

      console.log(outcome)

       if( this.props.taskid &&   outcome){
           this.setStateKeyVal('loading', true)
           this.setStateKeyVal('task', [])
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




  readComments = () => {
      if(this.props.taskid) {
          //this.setStateKeyVal('loading', true)
          api.fetchComments(this.props.taskid).then((data) =>{
                this.setStateKeyVal('comments', data)
            //    this.setStateKeyVal('loading', false)
        })
      }
  }

  addComment = () => {

       if( this.props.taskid &&   this.state.commentInputText){
           //this.setStateKeyVal('loading',true)
           var payload = {comment: this.state.commentInputText }
           api.addComment(this.props.taskid, payload ).then((data) =>{
               this.setStateKeyVal('commentInputText',[])
               this.readComments()
            //   this.setStateKeyVal('loading',false)
         })
     }
  }

  getCreatedDateDisplayString = (millisecs) => {
    return   this.formatDateToString(millisecs)
  }

  getCommentDisplayText = (commentJSONStr) => {

    commentJSON = JSON.parse(commentJSONStr)

    if(commentJSON){
      return commentJSON.comment
    }

    return  ""
  }


  getCommentCreatedByDisplayText = (commentJSONStr) => {
    commentJSON = JSON.parse(commentJSONStr)

    if(commentJSON){
      return commentJSON.createdByUserDisplayName
    }

    return  ""
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



  setStateKeyVal = (key,val) => {
        this.setState((prevState, props) => ({
            [key]: val
        }))
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
      commentInputText:e
    }))
  }

  render() {

    let count = 0
    let commentCount = 0

    return (

      <div className="task-detail">

      <BackButton />

      <Messages />

      <LoadableSection>

     { this.state.loading==false &&
          <div className="task uikit-grid">
            <div className="row">
                <div className="col-md-9">
                  <h2 className="uikit-display-2">{this.state.task.title}</h2>
                </div>
                <div className="col-md-3">
                  <div className="task-status">{this.state.task.statusLabel}</div>
                  <div className="task-date">Created on: {this.getCreatedDateDisplayString(this.state.task.createdDate)}</div>
                  {
                    // <div className="task-date">Updated on: {this.getCreatedDateDisplayString(this.state.task.updatedDate)}</div>
                    // <div className="task-date">Updated by: {this.state.task.updatedBy}</div>
                  }
                  <div className="task-date">Priority: {this.state.task.priority}</div>
                </div>
            </div>

            <div className="row task-detail-body">
              <div className="col-md-12">
                <div dangerouslySetInnerHTML={{__html: this.state.task.payloadHtml}}></div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">

                {/*
                <textarea
                  className="comment-textarea comment-detail-textarea"
                  placeholder="Add a comment..."
                  value={this.state.commentInputText}
                  onChange={this.onCommentTextChange}
                  onKeyPress={this.onCommentKeyPress}>
                </textarea>
                */}

                <Input
                  label="Add a comment"
                  value={this.state.commentInputText}
                  onChange={this.onCommentTextChange}
                  onKeyPress={this.onCommentKeyPress}
                  rows={2}
                  multiLine={true}
                />

                <button className="uikit-btn uikit-btn--tertiary comment-btn comment-detail-btn" onClick={this.addComment}>
                    Add
                </button>
              </div>
              <div className="col-md-6 btn-group">
                {this.state.task.taskPossibleOutcomes &&
                 this.state.task.state != 'COMPLETED' &&
                 this.state.task.taskPossibleOutcomes.sort((a, b)=>{
                   if(b.name === 'APPROVE') return 1;
                   return -1;
                 }).map((outcome) => (
                    <div key={count++}>
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

            <div className="task-detail-comments">
              {this.state.comments.length > 0 &&
              <h2>Comments</h2>
              }
              <ul>
              {this.state.comments.sort((a,b) => {
                return new Date(a.createDate) - new Date(b.createDate);
              }).map((comment) => (
                <li key={commentCount++}>
                  <div className="user">{comment.createdBy}</div>
                  <div className="task-date">{this.getCreatedDateDisplayString(comment.createDate)}</div>
                  <div>
                      {comment.comment}
                  </div>
                </li>
                ))
              }
              </ul>
            </div>

          </div>
        }

        </LoadableSection>

     </div>

    )
  }
}
export default TaskDetail
