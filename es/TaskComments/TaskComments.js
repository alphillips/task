function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { hashHistory } from 'react-router';

import Input from '@react-ag-components/input';
import BackButton from '@react-ag-components/back-button';
import * as api from './../api';
import './task-comments.css';

import LoadableSection from '@react-ag-components/core/lib/LoadableSection';
import Messages from '@react-ag-components/messages';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from "react-router";
import moment from "moment";

var style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
};

var style2 = {
  margin: 12
};

var TaskComments = function (_React$Component) {
  _inherits(TaskComments, _React$Component);

  function TaskComments(props) {
    _classCallCheck(this, TaskComments);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onChange = function (field) {
      return function (value) {
        _this.setState(function (prevState, props) {
          var _ref;

          return _ref = {}, _ref[field] = value, _ref;
        });
      };
    };

    _this.readComments = function () {
      if (_this.props.taskid) {
        api.fetchComments(_this.props.taskid).then(function (data) {
          _this.setState({ comments: data });
        });
      }
    };

    _this.addComment = function () {

      if (_this.props.taskid && _this.state.commentInputText && _this.state.commentInputText.trim().length > 0) {
        var payload = { comment: _this.state.commentInputText };
        api.addComment(_this.props.taskid, payload).then(function (data) {
          _this.setState({ commentInputText: " " });
          _this.readComments();
          _this.props.callbackShowMessage("success", "Staff note added");
        });
      }
    };

    _this.getCreatedDateDisplayString = function (millisecs) {
      return _this.formatDateToString(millisecs);
    };

    _this.getCommentDisplayText = function (commentJSONStr) {

      var commentJSON = JSON.parse(commentJSONStr);

      if (commentJSON) {
        return commentJSON.comment;
      }

      return "";
    };

    _this.getCommentCreatedByDisplayText = function (commentJSONStr) {
      var commentJSON = JSON.parse(commentJSONStr);

      if (commentJSON) {
        return commentJSON.createdByUserDisplayName;
      }

      return "";
    };

    _this.toggleCommentsSectionActiveStatus = function () {
      if (_this.state.addCommentSectionVisible) {
        _this.setState({ addCommentSectionVisible: true });
      } else {
        _this.setState({ addCommentSectionVisible: true });
      }
    };

    _this.epochSecondToDate = function (epochSecond) {
      var eps = epochSecond * 1000;
      var m = moment(eps);
      var s = m.format("D/M/YYYY hh:mm:ss");
      return s;
    };

    _this.formatDateToString = function (millisecs) {
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

    _this.onCommentKeyPress = function (e) {
      //if (e.key === 'Enter') {
      // Do code here
      //ev.preventDefault();
      _this.addComment();
      //  }
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
      task: _this.props.task,
      selectedAction: '',
      addCommentSectionVisible: true,
      comments: [],
      newcomment: [],
      loading: false
    };

    _this.taskid = props.taskid || null;
    return _this;
  }

  TaskComments.prototype.componentDidMount = function componentDidMount() {
    this.setState({ comments: this.state.task == null || this.state.task.comments == null ? [] : this.state.task.comments,
      addCommentSectionVisible: this.state.task == null || this.state.task.state == null || this.state.task.state == "COMPLETED" ? false : true
    });
  };

  TaskComments.prototype.render = function render() {
    var _this2 = this;

    var count = 0;
    var commentCount = 0;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { style: { border: 'solid 0px #e8e8ee' }, className: ' uikit-grid' },
        React.createElement(
          'div',
          { style: { paddingTop: '1em' } },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(
                'span',
                { style: { 'fontSize': '1.2em', 'fontWeight': 'bold' } },
                'Staff Notes  ',
                React.createElement('span', { className: 'comment-link' }),
                ' (',
                this.state.comments && this.state.comments.length,
                ')'
              )
            ),
            React.createElement('div', { className: 'col-md-6' })
          ),
          React.createElement('br', null),
          this.state.comments && this.state.comments.length > 0 && React.createElement(
            'div',
            { className: 'task-detail-comments' },
            React.createElement(
              'ul',
              null,
              this.state.comments.sort(function (a, b) {
                return new Date(a.createDate) - new Date(b.createDate);
              }).map(function (comment) {
                return React.createElement(
                  'li',
                  { key: commentCount++ },
                  React.createElement(
                    'div',
                    { className: 'user' },
                    comment.createdBy
                  ),
                  React.createElement(
                    'div',
                    { className: 'task-date' },
                    _this2.formatDateToString(comment.createDate)
                  ),
                  React.createElement(
                    'div',
                    null,
                    comment.comment
                  )
                );
              })
            )
          ),
          this.state.addCommentSectionVisible && React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(Input, {
                label: 'Add a note',
                value: this.state.commentInputText,
                onChange: this.onCommentTextChange,
                onKeyPress: this.onCommentKeyPress,
                rows: 2,
                multiLine: true,
                maxlength: '1900'
              }),
              React.createElement(
                'button',
                { className: 'uikit-btn uikit-btn--tertiary comment-btn ', onClick: function onClick() {
                    return _this2.addComment();
                  } },
                'Add'
              )
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              ' '
            )
          )
        )
      )
    );
  };

  return TaskComments;
}(React.Component);

export default TaskComments;