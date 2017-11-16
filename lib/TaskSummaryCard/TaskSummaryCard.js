'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _api = require('./../api');

var api = _interopRequireWildcard(_api);

require('./task.css');

var _reactSpinnerMaterial = require('react-spinner-material');

var _reactSpinnerMaterial2 = _interopRequireDefault(_reactSpinnerMaterial);

var _input = require('@react-ag-components/input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { Grid, Row, Col } from 'react-flexbox-grid'


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

    return _react2.default.createElement(
      'div',
      { className: 'task uikit-grid main-paper' },
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'col-md-10' },
          _react2.default.createElement(
            'div',
            { className: 'task-title' },
            _react2.default.createElement(
              'a',
              { href: '#', onClick: this.goToTaskDetailsPage },
              this.props.type
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'col-md-2' },
          _react2.default.createElement(
            'div',
            { className: 'task-status' },
            this.props.statusLabel
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'col-md-9' },
          this.props.description
        ),
        _react2.default.createElement(
          'div',
          { className: 'col-md-3' },
          _react2.default.createElement(
            'div',
            { className: 'task-date' },
            this.props.createdDate
          ),
          this.props.assigned && _react2.default.createElement(
            'div',
            { className: 'task-date' },
            'Assigned: ',
            this.props.assigned
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'row task-btns' },
        _react2.default.createElement(
          'div',
          { className: 'col-md-6' },
          this.props.hasComments && _react2.default.createElement(
            'a',
            { href: '#', className: 'message-link' },
            this.props.commentsButtonLabel
          ),
          !this.props.hasComments && _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_input2.default, {
              label: 'Add a comment',
              value: this.state.commentInputText,
              onChange: this.onCommentTextChange,
              onKeyPress: this.onCommentKeyPress,
              rows: 2,
              multiLine: true
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'col-md-6 assign-btns' },
          this.props.hasComments && _react2.default.createElement(
            'div',
            null,
            this.props.assigned == null && _react2.default.createElement(
              'a',
              { href: '#', className: 'assign-link', onClick: this.assignTaskToMe },
              'Assign to me'
            ),
            this.props.assigned != null && _react2.default.createElement(
              'a',
              { href: '#', className: 'unassign-link', onClick: this.unAssignTaskFromMe },
              'Unassign'
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'col-md-6' },
          !this.props.hasComments && _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'button',
              { className: 'uikit-btn uikit-btn--tertiary comment-btn', onClick: this.addComment },
              'Add'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'col-md-6 assign-btns' },
          !this.props.hasComments && _react2.default.createElement(
            'div',
            null,
            this.props.assigned == null && _react2.default.createElement(
              'a',
              { href: '#', className: 'assign-link', onClick: this.assignTaskToMe },
              'Assign to me'
            ),
            this.props.assigned != null && _react2.default.createElement(
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
}(_react2.default.Component);

exports.default = TaskSummaryCard;
module.exports = exports['default'];