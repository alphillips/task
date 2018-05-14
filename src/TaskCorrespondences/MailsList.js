import React from 'react'
import ReactDOM from 'react'
import { hashHistory } from 'react-router'

import Input from '@react-ag-components/input'
import BackButton from '@react-ag-components/back-button'
import * as api from './../api'
import './task-correspondences.css'

import LoadableSection from '@react-ag-components/core/lib/LoadableSection'
import Messages from '@react-ag-components/messages'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from "react-router";


import PathwayList from "@react-ag-components/pathway-list";

import moment from "moment";

// import Mail from "./../Mail";
import Mail from "@react-ag-components/inbox/lib/Mail";

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

class MailsList  extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        loading:false ,
        messageThreads : this.props.messageThreads
      }
      this.serviceRequestId = props.serviceRequestId || null
  }


  onChange = (field) => {
    return (value) => {
      this.setState((prevState, props) => ({
        [field]: value
      }))
    }
  }


  getCreatedDateDisplayString = (millisecs) => {
    return   this.formatDateToString(millisecs)
  }


  epochSecondToDate = epochSecond => {
    var eps = epochSecond * 1000;
    var m = moment(eps);
    var s = m.format("D/M/YYYY hh:mm:ss");
    return s;
  };


  setupMail = (id, type, subject) => {

    this.setState((prevState, props) => ({
      messageId: id,
      type: type,
      showMail: true,
      subject : subject,
      totalMessagesCount : this.state.messageThreads.length
    }));

    this.props.callbackCloseParentTask();
  };


  callbackCloseSelf = () => {
    this.setState((prevState, props) => ({
      showMail: false
    }));

    this.props.callbackOpenParentTask();
  };


  callbackSetMessage = (type,msg) => {
    this.setState((prevState, props) => ({
      [type]:msg
    }));

    this.props.setMessage(msg)
  }


  readAllCorrespondenceThreads = () => {

        this.setState({loading :true})

        if(this.props.serviceRequestId){
              api.getAllCorrespondences(this.props.serviceRequestId).then((data) => {
                  this.setState({loading :false, messageThreads : data==null?[]:data})
            })
        }
    }

   createNewMessageThread = () => {

         if( this.props.serviceRequestId &&   this.state.messageSubject && this.state.messageText &&  this.state.messageSubject.trim().length>0 &&  this.state.messageText.trim().length>0){

             var payload = {
                 serviceRequestId : this.props.serviceRequestId ,
                 subject : this.state.messageSubject,
                 body : this.state.messageText
             }

             api.createNewCorrespondence(payload ).then((data) =>{

                 this.props.callbackShowMessage('success', "New external message  '"+ this.state.messageSubject +"' created");
                 this.props.callbackShowMessage('error', '');

                 this.setState({ messageSubject: "", messageText: "" });
                 this.readAllCorrespondenceThreads();
                 var payload= { type:"ADD_NEW_EXTERNAL_MESSAGE"  }
                 api.performTaskAction(this.props.taskid, payload );
                 window.scrollTo(0, 0);
                 this.refs.messageText.state.value = "";
                 this.refs.messageSubject.state.value = "";
           })
       } else {
           this.props.callbackShowMessage('error', "Subject and Message are required to create a new external message ");
           this.props.callbackShowMessage('success', '');
           window.scrollTo(0, 0);
       }

    }

    onClose = () => {
      this.props.callbackCloseSelf()
      this.props.callbackSetMessage("success", "")
    }


  render() {

    var mailNode = null;

    if (this.state.showMail && this.props.callbackCloseParentTask && this.props.callbackOpenParentTask ){
      mailNode = (
        <Mail
        messageId={this.state.messageId}
        type={this.state.type}
        subject={this.state.subject}
        totalMessagesCount = {this.state.totalMessagesCount}
        callbackCloseSelf={this.callbackCloseSelf}
        callbackShowMessage={this.props.callbackShowMessage} />
      )
    }


    return (

      <div className="task-detail"  >

         {!this.state.showMail &&
          <div style={{'paddingTop' : '1em'}}>

           <span style={{'fontSize' : '1.2em', 'fontWeight' : 'bold'}}  className="notesicon">External Messages  <span className="mail-link"/> <span>({this.state.messageThreads && this.state.messageThreads.length})</span>  </span>

          {   this.state.messageThreads !=null &&  this.state.messageThreads.length > 0 && (

              <div className="  nexdoc-inbox" style={{'paddingTop' : '1.2em'}}>
                <div className="inbox">
                  <PathwayList>
                    { this.state.messageThreads.map(mail => (
                        <li
                          className={
                            "inbox-listing " + (!mail.read ? "unread" : "")
                          }
                          key={mail.corroId + mail.notificationId}
                        >
                          <div className="border-unread" />
                          <Link
                            onClick={this.setupMail.bind(
                              null,
                              mail.notificationId,
                              mail.type,
                              mail.description
                            )}
                          >
                            <span className="inbox-date">
                              {this.epochSecondToDate(
                                mail.createdTimeStamp.epochSecond
                              )}
                            </span>
                            {this.state.attachment && (
                              <span className="inbox-attachment" />
                            )}
                            <span className="inbox-from">
                              {mail.fromParty}
                            </span>
                            <span className="inbox-subject">
                              {mail.description}
                            </span>
                            <span className="inbox-body">
                              {
                                 //mail.body.replace(/<\/?[^>]+(>|$)/g, "")
                              }
                            </span>
                          </Link>
                        </li>
                      ))}
                  </PathwayList>
                </div>
                </div>
              )}

             {     !(this.props.task.state ==null ||  this.props.task.state =="COMPLETED") &&

                <div className="uikit-grid">
                   <div className="row">
                     <div className="col-md-6">
                         <Input
                           label="Subject"
                           value={this.state.messageSubject}
                           onChange={this.onChange('messageSubject')}
                           rows={1}
                           multiLine={true}
                           maxlength="300"
                           id="messageSubject"
                           ref="messageSubject"
                         />
                         <Input ref="messageText"
                           label="Message"
                           value={this.state.messageText}
                           onChange={this.onChange('messageText')}
                           rows={2}
                           multiLine={true}
                           maxlength="10000"
                           id="messageText"
                         />
                         <button className="uikit-btn uikit-btn--tertiary comment-btn comment-detail-btn" onClick={this.createNewMessageThread}>
                             Create
                         </button>
                    </div>
                    <div className="col-md-6"></div>
                  </div>
              </div>
           }

           </div>
         }


          { this.state.showMail &&
            (mailNode)
          }


         </div>


    )
  }
}
export default MailsList
