import React from "react";

import Input from "@react-ag-components/input";
import * as api from "./../api";
import "./task-comments.css";

import moment from "moment";

class TaskComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: this.props.task,
      selectedAction: "",
      addCommentSectionVisible: true,
      comments: [],
      newcomment: [],
      loading: false,
    };

    this.taskid = props.taskid || null;
  }

  onChange = field => {
    return value => {
      this.setState((prevState, props) => ({
        [field]: value,
      }));
    };
  };

  componentDidMount() {
    this.setState({
      comments: this.state.task == null || this.state.task.comments == null ? [] : this.state.task.comments,
      addCommentSectionVisible: this.state.task == null || this.state.task.state == null || this.state.task.state == "COMPLETED" ? false : true,
    });
  }

  readComments = () => {
    if (this.props.taskid) {
      api.fetchComments(this.props.taskid).then(data => {
        this.setState({ comments: data });
      });
    }
  };

  addComment = () => {
    if (this.props.taskid && this.state.commentInputText && this.state.commentInputText.trim().length > 0) {
      var payload = { comment: this.state.commentInputText };
      api.addComment(this.props.taskid, payload).then(data => {
        this.setState({ commentInputText: " " });
        this.readComments();
        this.props.callbackShowMessage("success", "Staff note added");
      });
    }
  };

  getCreatedDateDisplayString = millisecs => {
    return this.formatDateToString(millisecs);
  };

  getCommentDisplayText = commentJSONStr => {
    let commentJSON = JSON.parse(commentJSONStr);

    if (commentJSON) {
      return commentJSON.comment;
    }

    return "";
  };

  getCommentCreatedByDisplayText = commentJSONStr => {
    let commentJSON = JSON.parse(commentJSONStr);

    if (commentJSON) {
      return commentJSON.createdByUserDisplayName;
    }

    return "";
  };

  toggleCommentsSectionActiveStatus = () => {
    if (this.state.addCommentSectionVisible) {
      this.setState({ addCommentSectionVisible: true });
    } else {
      this.setState({ addCommentSectionVisible: true });
    }
  };

  epochSecondToDate = epochSecond => {
    var eps = epochSecond * 1000;
    var m = moment(eps);
    var s = m.format("D/M/YYYY hh:mm:ss");
    return s;
  };

  formatDateToString = millisecs => {
    var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var d = new Date(millisecs);
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var curr_hour = d.getHours();
    var curr_minute = d.getMinutes();

    var dateString = curr_date + " " + m_names[curr_month] + " " + curr_year + "  " + curr_hour + ":" + curr_minute;
    return dateString;
  };

  onCommentKeyPress = e => {
    //if (e.key === 'Enter') {
    // Do code here
    //ev.preventDefault();
    this.addComment();
    //  }
  };

  onCommentTextChange = e => {
    //  let val = e.target.value
    this.setState((prevState, props) => ({
      commentInputText: e,
    }));
  };

  render() {
    let count = 0;
    let commentCount = 0;

    return (
      <div>
        <div style={{ border: "solid 0px #e8e8ee" }} className=" uikit-grid">
          <div style={{ paddingTop: "1em" }}>
            <div className="row">
              <div className="col-md-6">
                <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  Staff Notes <span className="comment-link" /> ({this.state.comments && this.state.comments.length})
                </span>
              </div>
              <div className="col-md-6" />
            </div>

            <br />

            {this.state.comments && this.state.comments.length > 0 && (
              <div className="task-detail-comments">
                <ul>
                  {this.state.comments
                    .sort((a, b) => {
                      return new Date(a.createDate) - new Date(b.createDate);
                    })
                    .map(comment => (
                      <li key={commentCount++}>
                        <div className="user">{comment.createdBy}</div>
                        <div className="task-date">{this.formatDateToString(comment.createDate)}</div>
                        <div>{comment.comment}</div>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {this.state.addCommentSectionVisible && (
              <div className="row">
                <div className="col-md-6">
                  <Input
                    label="Add a note"
                    value={this.state.commentInputText}
                    onChange={this.onCommentTextChange}
                    onKeyPress={this.onCommentKeyPress}
                    rows={2}
                    multiLine={true}
                    maxlength="1900"
                  />

                  <button className="uikit-btn uikit-btn--tertiary comment-btn " onClick={() => this.addComment()}>
                    Add
                  </button>
                </div>
                <div className="col-md-6"> </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default TaskComments;
