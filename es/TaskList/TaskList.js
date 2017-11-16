function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
// import { Link,hashHistory } from 'react-router'
import TaskSummaryCard from './../TaskSummaryCard';
import Input from '@react-ag-components/input';
import * as api from './../api';
import './task-list.css';
// import { Grid, Row, Col } from 'react-flexbox-grid'
// import Spinner from 'react-spinner-material'
// import Messages from '@react-ag-components/messages'
import Messages from '@react-ag-components/messages';
import LoadableSection from '@react-ag-components/core/lib/LoadableSection';

var TaskList = function (_React$Component) {
  _inherits(TaskList, _React$Component);

  function TaskList(props) {
    _classCallCheck(this, TaskList);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.formatDateToString = function (millisecs) {
      var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      var d = new Date(millisecs);
      var curr_date = d.getDate();
      var curr_month = d.getMonth();
      var curr_year = d.getFullYear();
      var dateString = curr_date + " " + m_names[curr_month] + " " + curr_year;
      return dateString;
    };

    _this.getCreatedDateDisplayString = function (millisecs) {
      return " Created : " + _this.formatDateToString(millisecs);
    };

    _this.getLastUpdatedDateDisplayString = function (millisecs) {
      return " Last updated : " + _this.formatDateToString(millisecs);
    };

    _this.getAssignedUserDisplayString = function (assignedUserName) {
      return " Assigned to : " + assignedUserName;
    };

    _this.onChange = function (field) {
      return function (value) {
        _this.setState(function (prevState, props) {
          var _ref;

          return _ref = {}, _ref[field] = value, _ref;
        });
      };
    };

    _this.onSearchFieldChange = function (field) {
      return function (value) {
        _this.setState(function (prevState, props) {
          var _ref2;

          return _ref2 = {}, _ref2[field] = value, _ref2;
        });

        if (value.length > 3) {
          //do search by searchKeyword && refresh the list of tasks
          //  this.searchTasksByKeywordsInTitle(value)
        } else if (value.length == 0) {
          _this.readTasksList();
        }
      };
    };

    _this.searchTasksByKeywordsInTitle = function () {
      _this.setStateKeyVal('tasks', []);

      if (!_this.state.searchKeyword) {
        _this.readTasksList();
      } else {
        _this.search();
      }
    };

    _this.search = function () {

      _this.setStateKeyVal('loading', true);

      api.performSearchByTitleKeyword(_this.state.searchKeyword).then(function (data) {
        _this.setStateKeyVal('tasks', data);
        _this.setStateKeyVal('loading', false);
      });
    };

    _this.readTasksList = function () {

      _this.setStateKeyVal('loading', true);

      api.fetchUserTasksList().then(function (data) {
        _this.setStateKeyVal('tasks', data);
        _this.setStateKeyVal('loading', false);
      });
    };

    _this.calculateCommentsButtonLabel = function (task) {

      if (task.commentsCount > 0) {
        return 'Comments (' + task.commentsCount + ')';
      } else if (task.commentsCount == 0 && task.state == "COMPLETED") {
        return "";
      } else if (task.commentsCount == 0 && task.state != "COMPLETED") {
        return "Comment";
      }
    };

    _this.hasComments = function (task) {
      return task.commentsCount > 0;
    };

    _this.setStateKeyVal = function (key, val) {
      _this.setState(function (prevState, props) {
        var _ref3;

        return _ref3 = {}, _ref3[key] = val, _ref3;
      });
    };

    _this.onChange = function (id) {
      _this.props.onChange(id);
    };

    _this.state = {
      searchKeyword: '',
      tasks: [],
      loading: false,
      success: props.success,
      error: props.error
    };

    return _this;
  }

  TaskList.prototype.componentDidMount = function componentDidMount() {
    this.readTasksList();
  };

  TaskList.prototype.render = function render() {
    var _this2 = this;

    var taskCount = 0;

    return React.createElement(
      'div',
      { className: 'task-list-page' },
      React.createElement(Messages, { success: this.state.success, error: this.state.error }),
      React.createElement(
        'h1',
        null,
        'Tasks'
      ),
      React.createElement(
        LoadableSection,
        null,
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'task uikit-grid' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col-md-10' },
                React.createElement(Input, {
                  label: "Search tasks",
                  id: 'search',
                  value: this.state.searchKeyword,
                  onChange: this.onSearchFieldChange('searchKeyword'),
                  placeholder: 'Search tasks...'
                })
              ),
              React.createElement(
                'div',
                { className: 'col-md-2' },
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'button',
                    { className: 'uikit-btn main-btn', id: 'task-list-search-btn', onClick: this.searchTasksByKeywordsInTitle },
                    'Search'
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          'ul',
          { className: 'task-list' },
          this.state.tasks && this.state.tasks.map(function (task) {
            return React.createElement(
              'li',
              { key: taskCount++ },
              React.createElement(TaskSummaryCard, {
                type: task.title,
                createdDate: _this2.getCreatedDateDisplayString(task.createdDate),
                lastUpdatedDate: _this2.getLastUpdatedDateDisplayString(task.lastUpdatedDate),
                updatedBy: task.updatedBy,
                priority: task.priority,
                assigned: task.taskAssignees && task.taskAssignees[0].assignedToUser,
                taskid: task.taskId,
                commentsButtonLabel: _this2.calculateCommentsButtonLabel(task),
                hasComments: _this2.hasComments(task),
                refreshTasksList: _this2.readTasksList,
                statusLabel: task.statusLabel,
                description: task.description,
                onChange: _this2.onChange
              })
            );
          })
        )
      )
    );
  };

  return TaskList;
}(React.Component);

export default TaskList;