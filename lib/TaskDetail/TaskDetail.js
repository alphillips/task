'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _input = require('@react-ag-components/input');

var _input2 = _interopRequireDefault(_input);

var _backButton = require('@react-ag-components/back-button');

var _backButton2 = _interopRequireDefault(_backButton);

var _api = require('./../api');

var api = _interopRequireWildcard(_api);

require('./task-detail.css');

var _LoadableSection = require('@react-ag-components/core/lib/LoadableSection');

var _LoadableSection2 = _interopRequireDefault(_LoadableSection);

var _messages = require('@react-ag-components/messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { Grid, Row, Col } from 'react-flexbox-grid'


var TaskDetail = function (_React$Component) {
  _inherits(TaskDetail, _React$Component);

  function TaskDetail(props) {
    _classCallCheck(this, TaskDetail);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onChange = function (field) {
      return function (value) {
        _this.setState(function (prevState, props) {
          var _ref;

          return _ref = {}, _ref[field] = value, _ref;
        });
      };
    };

    _this.readTaskDetailsById = function () {

      _this.setStateKeyVal('loading', true);

      if (_this.props.taskid) {
        api.fetchTaskDetailsById(_this.props.taskid).then(function (data) {
          _this.setStateKeyVal('task', data);
          _this.setStateKeyVal('comments', data.comments == null ? [] : data.comments);
          _this.setStateKeyVal('loading', false);
        });
      }
    };

    _this.performApproveOrRejectTaskAction = function (outcome) {

      console.log(outcome);

      if (_this.props.taskid && outcome) {
        _this.setStateKeyVal('loading', true);
        _this.setStateKeyVal('task', []);
        var payload = { value: outcome.name, type: "APPROVE_OR_REJECT" };
        api.performTaskAction(_this.props.taskid, payload).then(function (data) {
          // this.readTaskDetailsById();
          // this.setStateKeyVal('loading', false)
          var message = 'Task ' + (outcome.name === 'APPROVE' ? 'approved' : 'rejected');

          // APPROVE
          // hashHistory.push('/tasks')
          _this.props.onChange(null);
          _this.props.setMessage(message);
        });
      }
    };

    _this.readComments = function () {
      if (_this.props.taskid) {
        //this.setStateKeyVal('loading', true)
        api.fetchComments(_this.props.taskid).then(function (data) {
          _this.setStateKeyVal('comments', data);
          //    this.setStateKeyVal('loading', false)
        });
      }
    };

    _this.addComment = function () {

      if (_this.props.taskid && _this.state.commentInputText) {
        //this.setStateKeyVal('loading',true)
        var payload = { comment: _this.state.commentInputText };
        api.addComment(_this.props.taskid, payload).then(function (data) {
          _this.setStateKeyVal('commentInputText', []);
          _this.readComments();
          //   this.setStateKeyVal('loading',false)
        });
      }
    };

    _this.getCreatedDateDisplayString = function (millisecs) {
      return _this.formatDateToString(millisecs);
    };

    _this.formatDateToString = function (millisecs) {
      var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      var d = new Date(millisecs);
      var curr_date = d.getDate();
      var curr_month = d.getMonth();
      var curr_year = d.getFullYear();
      var dateString = curr_date + " " + m_names[curr_month] + " " + curr_year;
      return dateString;
    };

    _this.setStateKeyVal = function (key, val) {
      _this.setState(function (prevState, props) {
        var _ref2;

        return _ref2 = {}, _ref2[key] = val, _ref2;
      });
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
      task: '',
      selectedAction: '',
      comments: [],
      newcomment: [],
      loading: false
      //  this.taskid = props.params.taskid || null
    };_this.taskid = props.taskid || null;
    return _this;
  }

  TaskDetail.prototype.componentDidMount = function componentDidMount() {

    this.readTaskDetailsById();
    {//this.readComments()
    }
  };

  TaskDetail.prototype.render = function render() {
    var _this2 = this;

    var count = 0;
    var commentCount = 0;

    return _react2.default.createElement(
      'div',
      { className: 'task-detail' },
      _react2.default.createElement(_backButton2.default, null),
      _react2.default.createElement(_messages2.default, null),
      _react2.default.createElement(
        _LoadableSection2.default,
        null,
        this.state.loading == false && _react2.default.createElement(
          'div',
          { className: 'task uikit-grid' },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-9' },
              _react2.default.createElement(
                'h2',
                { className: 'uikit-display-2' },
                this.state.task.title
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-md-3' },
              _react2.default.createElement(
                'div',
                { className: 'task-status' },
                this.state.task.statusLabel
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                'Created on: ',
                this.getCreatedDateDisplayString(this.state.task.createdDate)
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                'Updated on: ',
                this.getCreatedDateDisplayString(this.state.task.updatedDate)
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                'Updated by: ',
                this.state.task.updatedBy
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                'Priority: ',
                this.state.task.priority
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'row task-detail-body' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-12' },
              _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.task.payloadHtml } })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-6' },
              _react2.default.createElement(_input2.default, {
                label: 'Add a comment',
                value: this.state.commentInputText,
                onChange: this.onCommentTextChange,
                onKeyPress: this.onCommentKeyPress,
                rows: 2,
                multiLine: true
              }),
              _react2.default.createElement(
                'button',
                { className: 'uikit-btn uikit-btn--tertiary comment-btn comment-detail-btn', onClick: this.addComment },
                'Add'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-md-6 btn-group' },
              this.state.task.taskPossibleOutcomes && this.state.task.state != 'COMPLETED' && this.state.task.taskPossibleOutcomes.sort(function (a, b) {
                if (b.name === 'APPROVE') return 1;
                return -1;
              }).map(function (outcome) {
                return _react2.default.createElement(
                  'div',
                  { key: count++ },
                  outcome.name === 'APPROVE' && _react2.default.createElement(
                    'button',
                    { className: 'uikit-btn main-btn', onClick: function onClick() {
                        return _this2.performApproveOrRejectTaskAction(outcome);
                      } },
                    outcome.name
                  ),
                  outcome.name !== 'APPROVE' && _react2.default.createElement(
                    'button',
                    { className: 'uikit-btn uikit-btn--tertiary', onClick: function onClick() {
                        return _this2.performApproveOrRejectTaskAction(outcome);
                      } },
                    outcome.name
                  )
                );
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'task-detail-comments' },
            this.state.comments.length > 0 && _react2.default.createElement(
              'h2',
              null,
              'Comments'
            ),
            _react2.default.createElement(
              'ul',
              null,
              this.state.comments.sort(function (a, b) {
                return new Date(a.createDate) - new Date(b.createDate);
              }).map(function (comment) {
                return _react2.default.createElement(
                  'li',
                  { key: commentCount++ },
                  _react2.default.createElement(
                    'div',
                    { className: 'user' },
                    comment.createdBy
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'task-date' },
                    _this2.getCreatedDateDisplayString(comment.createDate)
                  ),
                  _react2.default.createElement(
                    'div',
                    null,
                    comment.comment
                  )
                );
              })
            )
          )
        )
      )
    );
  };

  return TaskDetail;
}(_react2.default.Component);

exports.default = TaskDetail;
module.exports = exports['default'];