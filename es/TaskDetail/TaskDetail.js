function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { hashHistory } from 'react-router';

import Input from '@react-ag-components/input';
import BackButton from '@react-ag-components/back-button';
import * as api from './../api';
import './task-detail.css';
// import { Grid, Row, Col } from 'react-flexbox-grid'
import LoadableSection from '@react-ag-components/core/lib/LoadableSection';
import Messages from '@react-ag-components/messages';

import TaskCorrespondences from './../TaskCorrespondences/TaskCorrespondences';
import TaskComments from './../TaskComments/TaskComments';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from "react-router";
import moment from 'moment';
import Modal from 'react-aria-modal';
import Dialog from 'material-ui/Dialog';

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

    return React.createElement(
      'div',
      { className: 'task-detail' },
      !this.state.messagesSectionOpened && React.createElement(
        'div',
        null,
        this.state.validationMessages && this.state.validationMessages.map(function (message) {
          return message.unformattedMessage && React.createElement(Messages, { warning: message.unformattedMessage });
        }),
        React.createElement(Messages, { success: this.state.success, error: this.state.error, warning: this.state.warning }),
        React.createElement(BackButton, null)
      ),
      React.createElement(
        LoadableSection,
        null,
        !this.state.messagesSectionOpened && React.createElement(
          'div',
          { className: 'task uikit-grid' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-8' },
              React.createElement(
                'h2',
                { className: 'uikit-display-2' },
                this.state.task.title
              )
            ),
            React.createElement(
              'div',
              { className: 'col-md-4' },
              React.createElement(
                'div',
                { className: this.chooseDisplayLabel(this.state.task.statusLabel) },
                this.state.task.statusLabel
              ),
              React.createElement(
                'div',
                { className: 'task-date' },
                React.createElement(
                  'strong',
                  null,
                  'Priority'
                ),
                ': ',
                this.state.task.priority
              ),
              React.createElement(
                'div',
                { className: 'task-date' },
                React.createElement(
                  'strong',
                  null,
                  'Created on'
                ),
                ': ',
                this.getCreatedDateDisplayString(this.state.task.createdDate)
              ),
              React.createElement(
                'div',
                { className: 'task-date' },
                React.createElement(
                  'strong',
                  null,
                  'Last updated on'
                ),
                ': ',
                this.getCreatedDateDisplayString(this.state.task.updatedDate)
              )
            )
          ),
          window.IS_STAFF && this.state.task.state == "COMPLETED" && this.state.showMore && React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-12' },
              React.createElement(
                'div',
                { className: 'task-date' },
                React.createElement(
                  'strong',
                  null,
                  'Last updated by'
                ),
                ': ',
                this.state.task.updatedBy
              ),
              React.createElement(
                'div',
                { className: 'task-date' },
                React.createElement(
                  'strong',
                  null,
                  'Task action outcome '
                ),
                ': ',
                this.state.task.outcomeLabel
              ),
              React.createElement(
                'div',
                { className: 'task-date' },
                React.createElement(
                  'strong',
                  null,
                  'Task action  reason '
                ),
                ' : ',
                this.state.task.taskCustomAttributes.taskActionReason == null ? ' Nill ' : '',
                '  '
              ),
              React.createElement(
                'div',
                { className: 'task-date' },
                ' ',
                this.state.task.taskCustomAttributes.taskActionReason,
                ' '
              )
            )
          ),
          window.IS_STAFF && this.state.task.state == "COMPLETED" && React.createElement(
            'div',
            { className: 'task-date' },
            ' ',
            React.createElement(
              'a',
              { href: '#', onClick: this.toggleShowMore, title: !this.state.showMore ? " Show more " : " hide " },
              ' ',
              !this.state.showMore ? " (+) " : " (-) "
            )
          )
        ),
        !this.state.messagesSectionOpened && React.createElement(
          'div',
          { className: 'task uikit-grid' },
          React.createElement(
            'div',
            { className: 'row task-detail-body' },
            React.createElement(
              'div',
              { className: 'col-md-12', style: { 'backgroundColor': '#fafafa', 'padding-left': '20px', 'padding-right': '20px' } },
              React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.task.payloadHtml } })
            )
          ),
          React.createElement(
            'div',
            { className: 'btn-group outcome' },
            this.state.task.taskPossibleOutcomes && this.state.task.state != 'COMPLETED' && this.state.task.taskPossibleOutcomes.sort(function (a, b) {
              if (b.name === 'APPROVE' || b.name.toLowerCase().indexOf('reprint') > -1) return 1;
              return -1;
            }).map(function (outcome) {
              return React.createElement(
                'div',
                { key: count++, style: { float: 'left' } },
                _this2.state.task.taskPossibleOutcomes.length === 1 && React.createElement(
                  'button',
                  { className: 'uikit-btn main-btn', onClick: function onClick() {
                      return _this2.performApproveOrRejectTaskAction(outcome);
                    } },
                  outcome.name
                ),
                _this2.state.task.taskPossibleOutcomes.length > 1 && React.createElement(
                  'div',
                  null,
                  (outcome.name === 'APPROVE' || outcome.name.toLowerCase().indexOf('reprint') > -1) && React.createElement(
                    'button',
                    { className: 'uikit-btn main-btn', onClick: function onClick() {
                        return _this2.performApproveOrRejectTaskAction(outcome);
                      } },
                    outcome.name
                  ),
                  outcome.name !== 'APPROVE' && outcome.name.toLowerCase().indexOf('reprint') === -1 && React.createElement(
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
      window.IS_STAFF && this.state.task && this.state.task.serviceRequestId && this.state.task.serviceRequestId.length > 0 && this.state.attachments && this.state.attachments.length > 0 && React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'h2',
          null,
          'Attachments'
        ),
        this.state.attachments.map(function (attachment) {
          return React.createElement(
            'li',
            { key: attachment.documentAuthERN },
            React.createElement(
              'a',
              { className: 'attachment-link',
                href: "/document-service-rs/resources/internal/v2/document/contents/authorised-id/" + attachment.documentAuthERN,
                download: attachment.name },
              attachment.name && React.createElement(
                'strong',
                null,
                React.createElement(
                  'span',
                  null,
                  attachment.name
                )
              ),
              attachment.mimeType && React.createElement(
                'span',
                null,
                ' ',
                " ",
                ' - ',
                attachment.mimeType,
                ' '
              ),
              attachment.contentLength && React.createElement(
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
      window.IS_STAFF && this.state.task && this.state.task.serviceRequestId && this.state.task.serviceRequestId.length > 0 && React.createElement(TaskCorrespondences, { task: this.state.task, taskid: this.taskid, serviceRequestId: this.state.task.serviceRequestId, callbackOpenParentTask: this.callbackOpenParentTask, callbackCloseParentTask: this.callbackCloseParentTask, callbackShowMessage: this.callbackShowMessage }),
      window.IS_STAFF && this.state.task && !this.state.messagesSectionOpened && React.createElement(TaskComments, { task: this.state.task, taskid: this.taskid, serviceRequestId: this.state.task.serviceRequestId, callbackShowMessage: this.callbackShowMessage }),
      React.createElement(
        Dialog,
        {
          title: 'Please provide a reason for your decision before this action can be executed',
          modal: true,
          open: this.state.showModal,
          onRequestClose: this.cancelDisable
        },
        this.state.taskActionReasonNotSupplied && React.createElement(
          'p',
          { style: { color: 'red' } },
          ' Please provide the reason for your decision '
        ),
        React.createElement(Input, {
          label: 'Reason',
          value: this.state.taskActionReason,
          onChange: this.onChange('taskActionReason'),
          rows: 2,
          multiLine: true,
          maxlength: '1900',
          id: 'taskActionReason'
        }),
        React.createElement(
          'div',
          { className: 'btn-group' },
          React.createElement(
            'button',
            { className: 'uikit-btn ', onClick: this.handleTaskAction },
            'SUBMIT'
          ),
          React.createElement(
            'button',
            { className: 'uikit-btn uikit-btn--tertiary main-btn', onClick: this.cancelDisable },
            'CANCEL'
          )
        )
      )
    );
  };

  return TaskDetail;
}(React.Component);

export default TaskDetail;