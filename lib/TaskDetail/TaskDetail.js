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

var _TaskCorrespondences = require('./../TaskCorrespondences/TaskCorrespondences');

var _TaskCorrespondences2 = _interopRequireDefault(_TaskCorrespondences);

var _TaskComments = require('./../TaskComments/TaskComments');

var _TaskComments2 = _interopRequireDefault(_TaskComments);

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactAriaModal = require('react-aria-modal');

var _reactAriaModal2 = _interopRequireDefault(_reactAriaModal);

var _Dialog = require('material-ui/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { Grid, Row, Col } from 'react-flexbox-grid'


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
      _this.setState({ loading: true });
      if (_this.props.taskid) {
        api.fetchTaskDetailsById(_this.props.taskid).then(function (data) {
          _this.setState({
            task: data,
            comments: data.comments == null ? [] : data.comments,
            loading: false
          }, function () {
            _this.getAttachments();
          });
        });
      }
    };

    _this.getAttachments = function () {
      if (_this.state.task.serviceRequestId && _this.state.task.serviceRequestId.length > 0) {
        api.fetchAttachmentsByServiceId(_this.state.task.serviceRequestId).then(function (data) {
          _this.setState({
            attachments: data.documents,
            validationMessages: data.validationMessages
          });
        });
      }
    };

    _this.handleTaskActionButtonClick = function (outcome) {

      _this.setState(function (prevState, props) {
        return {
          showModal: true,
          taskActionReason: '',
          outcome: outcome,
          taskActionReasonNotSupplied: false
        };
      });
    };

    _this.handleTaskAction = function () {

      if (_this.state.taskActionReason && _this.state.taskActionReason.trim().length > 0 && _this.state.outcome) {
        _this.performApproveOrRejectTaskAction(_this.state.outcome);
        _this.setState({ showModal: false, outcome: null });
      } else {
        _this.setState({ taskActionReasonNotSupplied: true });
      }
    };

    _this.performApproveOrRejectTaskAction = function (outcome) {

      if (_this.props.taskid && outcome) {
        _this.setState({ loading: true });
        _this.setState({ task: [] });
        var payload = { value: outcome.name, type: "APPROVE_OR_REJECT", actionReason: _this.state.taskActionReason };
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

    _this.callbackCloseParentTask = function () {
      _this.setState(function (prevState, props) {
        return {
          messagesSectionOpened: true
        };
      });
    };

    _this.callbackOpenParentTask = function () {
      _this.setState(function (prevState, props) {
        return {
          messagesSectionOpened: false
        };
      });
    };

    _this.callbackShowMessage = function (type, msg) {
      _this.setState(function (prevState, props) {
        var _ref2;

        return _ref2 = {}, _ref2[type] = msg, _ref2;
      });
    };

    _this.cancelDisable = function () {
      _this.setState(function (prevState, props) {
        return {
          showModal: false
        };
      });
    };

    _this.chooseDisplayLabel = function (taskStatusLabel) {

      if (taskStatusLabel == 'APPROVED') {
        return "approved-status";
      } else if (taskStatusLabel == 'REJECTED') {
        return "rejected-status";
      } else {
        return "task-status";
      }
    };

    _this.toggleShowMore = function (e) {
      e.preventDefault();
      if (_this.state.showMore) {
        _this.setState(function (prevState, props) {
          return {
            showMore: false
          };
        });
      } else {
        _this.setState(function (prevState, props) {
          return {
            showMore: true
          };
        });
      }
    };

    _this.state = {
      task: '',
      selectedAction: '',
      comments: [],
      newcomment: [],
      loading: false,
      showMore: false,
      attachments: [],
      error: '',
      warning: '',
      success: ''
    };

    _this.taskid = props.taskid || null;
    return _this;
  }

  TaskDetail.prototype.componentDidMount = function componentDidMount() {
    this.readTaskDetailsById();
  };

  TaskDetail.prototype.render = function render() {
    var _this2 = this;

    var count = 0;
    var commentCount = 0;

    return _react2.default.createElement(
      'div',
      { className: 'task-detail' },
      !this.state.messagesSectionOpened && _react2.default.createElement(
        'div',
        null,
        this.state.validationMessages && this.state.validationMessages.map(function (message) {
          return message.unformattedMessage && _react2.default.createElement(_messages2.default, { warning: message.unformattedMessage });
        }),
        _react2.default.createElement(_messages2.default, { success: this.state.success, error: this.state.error, warning: this.state.warning }),
        _react2.default.createElement(_backButton2.default, null)
      ),
      _react2.default.createElement(
        _LoadableSection2.default,
        null,
        !this.state.messagesSectionOpened && _react2.default.createElement(
          'div',
          { className: 'task uikit-grid' },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-8' },
              _react2.default.createElement(
                'h2',
                { className: 'uikit-display-2' },
                this.state.task.title
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-md-4' },
              _react2.default.createElement(
                'div',
                { className: this.chooseDisplayLabel(this.state.task.statusLabel) },
                this.state.task.statusLabel
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                _react2.default.createElement(
                  'strong',
                  null,
                  'Priority'
                ),
                ': ',
                this.state.task.priority
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                _react2.default.createElement(
                  'strong',
                  null,
                  'Created on'
                ),
                ': ',
                this.getCreatedDateDisplayString(this.state.task.createdDate)
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                _react2.default.createElement(
                  'strong',
                  null,
                  'Last updated on'
                ),
                ': ',
                this.getCreatedDateDisplayString(this.state.task.updatedDate)
              )
            )
          ),
          window.IS_STAFF && this.state.task.state == "COMPLETED" && this.state.showMore && _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-12' },
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                _react2.default.createElement(
                  'strong',
                  null,
                  'Last updated by'
                ),
                ': ',
                this.state.task.updatedBy
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                _react2.default.createElement(
                  'strong',
                  null,
                  'Task action outcome '
                ),
                ': ',
                this.state.task.outcomeLabel
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                _react2.default.createElement(
                  'strong',
                  null,
                  'Task action  reason '
                ),
                ' : ',
                this.state.task.taskCustomAttributes.taskActionReason == null ? ' Nill ' : '',
                '  '
              ),
              _react2.default.createElement(
                'div',
                { className: 'task-date' },
                ' ',
                this.state.task.taskCustomAttributes.taskActionReason,
                ' '
              )
            )
          ),
          window.IS_STAFF && this.state.task.state == "COMPLETED" && _react2.default.createElement(
            'div',
            { className: 'task-date' },
            ' ',
            _react2.default.createElement(
              'a',
              { href: '#', onClick: this.toggleShowMore, title: !this.state.showMore ? " Show more " : " hide " },
              ' ',
              !this.state.showMore ? " (+) " : " (-) "
            )
          )
        ),
        !this.state.messagesSectionOpened && _react2.default.createElement(
          'div',
          { className: 'task uikit-grid' },
          _react2.default.createElement(
            'div',
            { className: 'row task-detail-body' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-12', style: { 'backgroundColor': '#fafafa', 'padding-left': '20px', 'padding-right': '20px' } },
              _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.task.payloadHtml } })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'btn-group outcome' },
            this.state.task.taskPossibleOutcomes && this.state.task.state != 'COMPLETED' && this.state.task.taskPossibleOutcomes.sort(function (a, b) {
              if (b.name === 'APPROVE' || b.name.toLowerCase().indexOf('reprint') > -1) return 1;
              return -1;
            }).map(function (outcome) {
              return _react2.default.createElement(
                'div',
                { key: count++, style: { float: 'left' } },
                _this2.state.task.taskPossibleOutcomes.length === 1 && _react2.default.createElement(
                  'button',
                  { className: 'uikit-btn main-btn', onClick: function onClick() {
                      return _this2.performApproveOrRejectTaskAction(outcome);
                    } },
                  outcome.name
                ),
                _this2.state.task.taskPossibleOutcomes.length > 1 && _react2.default.createElement(
                  'div',
                  null,
                  (outcome.name === 'APPROVE' || outcome.name.toLowerCase().indexOf('reprint') > -1) && _react2.default.createElement(
                    'button',
                    { className: 'uikit-btn main-btn', onClick: function onClick() {
                        return _this2.performApproveOrRejectTaskAction(outcome);
                      } },
                    outcome.name
                  ),
                  outcome.name !== 'APPROVE' && outcome.name.toLowerCase().indexOf('reprint') === -1 && _react2.default.createElement(
                    'button',
                    { className: 'uikit-btn uikit-btn--tertiary', onClick: function onClick() {
                        return _this2.handleTaskActionButtonClick(outcome);
                      } },
                    outcome.name
                  )
                )
              );
            })
          )
        )
      ),
      window.IS_STAFF && this.state.task && this.state.task.serviceRequestId && this.state.task.serviceRequestId.length > 0 && this.state.attachments && this.state.attachments.length > 0 && _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'h2',
          null,
          'Attachments'
        ),
        this.state.attachments.map(function (attachment) {
          return _react2.default.createElement(
            'li',
            { key: attachment.documentAuthERN },
            _react2.default.createElement(
              'a',
              { className: 'attachment-link',
                href: "/document-service-rs/resources/internal/v2/document/contents/authorised-id/" + attachment.documentAuthERN,
                download: attachment.name },
              attachment.name && _react2.default.createElement(
                'strong',
                null,
                _react2.default.createElement(
                  'span',
                  null,
                  attachment.name
                )
              ),
              attachment.mimeType && _react2.default.createElement(
                'span',
                null,
                ' ',
                " ",
                ' - ',
                attachment.mimeType,
                ' '
              ),
              attachment.contentLength && _react2.default.createElement(
                'span',
                null,
                ' ',
                " ",
                ' - ',
                attachment.contentLength,
                ' '
              )
            )
          );
        })
      ),
      window.IS_STAFF && this.state.task && this.state.task.serviceRequestId && this.state.task.serviceRequestId.length > 0 && _react2.default.createElement(_TaskCorrespondences2.default, { task: this.state.task, taskid: this.taskid, serviceRequestId: this.state.task.serviceRequestId, callbackOpenParentTask: this.callbackOpenParentTask, callbackCloseParentTask: this.callbackCloseParentTask, callbackShowMessage: this.callbackShowMessage }),
      window.IS_STAFF && this.state.task && !this.state.messagesSectionOpened && _react2.default.createElement(_TaskComments2.default, { task: this.state.task, taskid: this.taskid, serviceRequestId: this.state.task.serviceRequestId, callbackShowMessage: this.callbackShowMessage }),
      _react2.default.createElement(
        _Dialog2.default,
        {
          title: 'Please provide a reason for your decision before this action can be executed',
          modal: true,
          open: this.state.showModal,
          onRequestClose: this.cancelDisable
        },
        this.state.taskActionReasonNotSupplied && _react2.default.createElement(
          'p',
          { style: { color: 'red' } },
          ' Please provide the reason for your decision '
        ),
        _react2.default.createElement(_input2.default, {
          label: 'Reason',
          value: this.state.taskActionReason,
          onChange: this.onChange('taskActionReason'),
          rows: 2,
          multiLine: true,
          maxlength: '1900',
          id: 'taskActionReason'
        }),
        _react2.default.createElement(
          'div',
          { className: 'btn-group' },
          _react2.default.createElement(
            'button',
            { className: 'uikit-btn ', onClick: this.handleTaskAction },
            'SUBMIT'
          ),
          _react2.default.createElement(
            'button',
            { className: 'uikit-btn uikit-btn--tertiary main-btn', onClick: this.cancelDisable },
            'CANCEL'
          )
        )
      )
    );
  };

  return TaskDetail;
}(_react2.default.Component);

exports.default = TaskDetail;
module.exports = exports['default'];