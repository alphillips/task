import React from 'react'
import { hashHistory } from 'react-router'

import Input from '@react-ag-components/input'
import BackButton from '@react-ag-components/back-button'
import * as api from './../api'
import './task-correspondences.css'

import LoadableSection from '@react-ag-components/core/lib/LoadableSection'
import Messages from '@react-ag-components/messages'

import { Link } from "react-router";



//import Mail from "./../Mail";
import Mail from "@react-ag-components/inbox/lib/Mail";
import MailsList from "./MailsList";



class TaskCorrespondences  extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        loadin : false,
        messageThreads : null,
        mailsListVisible : true
      }
      this.serviceRequestId = props.serviceRequestId || null
  }


  componentDidMount() {

      this.readAllCorrespondenceThreads ();
  }

  readAllCorrespondenceThreads = () => {

      this.setState({loading :true})

      if(this.props.serviceRequestId){
            api.getAllCorrespondences(this.props.serviceRequestId).then((data) => {
                this.setState({loading :false, messageThreads : data==null?[]:data})
          })
      }
  }


  toggleMailsListVisible = () => {
    if(this.state.mailsListVisible){
        this.setState({mailsListVisible: false})
        this.props.callbackOpenParentTask();
    }else {
        this.setState({mailsListVisible: true})
        this.props.callbackCloseParentTask();
    }
  }

  callbackCloseSelf = () => {
    this.setState((prevState, props) => ({
      mailsListVisible: false
    }));
    this.props.callbackOpenParentTask();
  };


  render() {



    var mailsListNode = null;
    if(this.state.mailsListVisible &&  this.props.serviceRequestId && this.state.messageThreads && this.props.task) {
        mailsListNode = (
          <MailsList task={this.props.task} messageThreads={this.state.messageThreads} serviceRequestId={this.props.serviceRequestId}
                     callbackCloseSelf={this.callbackCloseSelf} callbackOpenParentTask={this.props.callbackOpenParentTask}
                     callbackCloseParentTask={this.props.callbackCloseParentTask} callbackShowMessage={this.props.callbackShowMessage}
                     taskid={this.props.taskid}/>
        )
    }


    return (


              <div style={{border : 'solid 0px #e8e8ee'}} className=" uikit-grid">

                <div>

                   {(mailsListNode)}

                </div>

            </div>
    )
  }
}
export default TaskCorrespondences
