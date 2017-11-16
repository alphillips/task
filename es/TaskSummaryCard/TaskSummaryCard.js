function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { hashHistory } from 'react-router';

// import { Grid, Row, Col } from 'react-flexbox-grid'
import * as api from './../api';
import './task.css';
import Spinner from 'react-spinner-material';
import Input from '@react-ag-components/input';

var TaskSummaryCard = function (_React$Component) {
  _inherits(TaskSummaryCard, _React$Component);

  function TaskSummaryCard(props) {
    _classCallCheck(this, TaskSummaryCard);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.goToTaskDetailsPage = function (e) {
      e.preventDefault();
      // hashHistory.push('/task-page/' + this.props.taskid + '/' )
      _this.props.onChange(_this.props.taskid);
      // return (e) => {
      //   e.preventDefault()
      //   this.props.onChange(this.props.taskid )
      // }
    };

    _this.onTaskClick = function (id) {
      return function (e) {
        e.preventDefault();
        _this.props.onChange(id);
      };
    };

    _this.assignTaskToMe = function (e) {
      e.preventDefault();
      if (_this.props.taskid) {
        var payload = { type: "ASSIGN_TO_SOMEONE" };
        api.performTaskAction(_this.props.taskid, payload).then(function (data) {
          if (_this.props.refreshTasksList) {
            _this.props.refreshTasksList();
          }
        });
      }
    };

    _this.unAssignTaskFromMe = function (e) {
      e.preventDefault();

      if (_this.props.taskid) {

        var payload = { type: "UNASSIGN_A_TASK" };
        api.performTaskAction(_this.props.taskid, payload).then(function (data) {
          if (_this.props.refreshTasksList) {
            _this.props.refreshTasksList();
          }
        });
      }
    };

    _this.addComment = function () {
      if (_this.props.taskid && _this.state.commentInputText != '') {
        //this.setStateKeyVal('loading',true)
        var payload = { comment: _this.state.commentInputText };
        api.addComment(_this.props.taskid, payload).then(function (data) {
          if (_this.props.refreshTasksList) {
            _this.props.refreshTasksList();
          }
        });
      }
    };

    _this.onCommentKeyPress = function (e) {
      if (e.key === 'Enter') {
        // Do code here
        //ev.preventDefault();
        _this.addComment();
      }
    };

    _this.onCommentTextChange = function (e) {
      //  let val = e.target.value
      _this.setState(function (prevState, props) {
        return {
          commentInputText: e
        };
      });
    };

    _this.state = {
      comments: props.comments || [],
      taskid: props.taskid || null,
      commentInputText: ''
    };
    return _this;
  }

  // goToCommentsPage = () =>{
  //    hashHistory.push('/tasks/' + this.props.taskid + '/comments' )
  // }

  TaskSummaryCard.prototype.render = function render() {

    // const comments = this.props.comments
    // let commentsLabel = 'Comment'
    // if (comments && comments.length > 0){
    //   commentsLabel = comments.length + ' Comments ('+comments.length+')'
    // }

    return React.createElement(
      'div',
      { className: 'task uikit-grid main-paper' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-md-10' },
          React.createElement(
            'div',
            { className: 'task-title' },
            React.createElement(
              'a',
              { href: '#', onClick: this.goToTaskDetailsPage },
              this.props.type
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-md-2' },
          React.createElement(
            'div',
            { className: 'task-status' },
            this.props.statusLabel
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-md-9' },
          this.props.description
        ),
        React.createElement(
          'div',
          { className: 'col-md-3' },
          React.createElement(
            'div',
            { className: 'task-date' },
            this.props.createdDate
          ),
          this.props.assigned && React.createElement(
            'div',
            { className: 'task-date' },
            'Assigned: ',
            this.props.assigned
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row task-btns' },
        React.createElement(
          'div',
          { className: 'col-md-6' },
          this.props.hasComments && React.createElement(
            'a',
            { href: '#', className: 'message-link' },
            this.props.commentsButtonLabel
          ),
          !this.props.hasComments && React.createElement(
            'div',
            null,
            React.createElement(Input, {
              label: 'Add a comment',
              value: this.state.commentInputText,
              onChange: this.onCommentTextChange,
              onKeyPress: this.onCommentKeyPress,
              rows: 2,
              multiLine: true
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'col-md-6 assign-btns' },
          this.props.hasComments && React.createElement(
            'div',
            null,
            this.props.assigned == null && React.createElement(
              'a',
              { href: '#', className: 'assign-link', onClick: this.assignTaskToMe },
              'Assign to me'
            ),
            this.props.assigned != null && React.createElement(
              'a',
              { href: '#', className: 'unassign-link', onClick: this.unAssignTaskFromMe },
              'Unassign'
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-md-6' },
          !this.props.hasComments && React.createElement(
            'div',
            null,
            React.createElement(
              'button',
              { className: 'uikit-btn uikit-btn--tertiary comment-btn', onClick: this.addComment },
              'Add'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-md-6 assign-btns' },
          !this.props.hasComments && React.createElement(
            'div',
            null,
            this.props.assigned == null && React.createElement(
              'a',
              { href: '#', className: 'assign-link', onClick: this.assignTaskToMe },
              'Assign to me'
            ),
            this.props.assigned != null && React.createElement(
              'a',
              { href: '#', className: 'unassign-link', onClick: this.unAssignTaskFromMe },
              'Unassign'
            )
          )
        )
      )
    );
  };

  return TaskSummaryCard;
}(React.Component);

export default TaskSummaryCard;