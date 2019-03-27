function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";

import TaskSummaryCard from "./../TaskSummaryCard";
import Input from "@react-ag-components/input";
import * as api from "./../api";
import "./task-list.css";

import Messages from "@react-ag-components/messages";
import LoadableSection from "@react-ag-components/core/lib/LoadableSection";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import { hashHistory } from "react-router";
import DateInput from "@react-ag-components/date-input";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import QuickLinks from "./../QuickLinks/QuickLinks";
import { CSVLink } from "react-csv";

var searchOptions = [{ value: "ASSIGNEDTOME", label: "Assigned to me" }, { value: "COMPLETED", label: "Completed", type: "text" }, { value: "DATE_COMPLETED_AFTER", label: "Completed On or After", type: "date" }, { value: "DATE_COMPLETED_BEFORE", label: "Completed On or Before", type: "date" }, { value: "ASSIGNED", label: "Pending", type: "text" }, { value: "DATE_ASSIGNED_AFTER", label: "Pending - Received On or After", type: "date" }, { value: "DATE_ASSIGNED_BEFORE", label: "Pending - Received On or Before", type: "date" }];

var TaskList = function (_React$Component) {
  _inherits(TaskList, _React$Component);

  function TaskList(props) {
    _classCallCheck(this, TaskList);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.refreshTasksList = function (searchKeyword, searchTypeCode, quickLinkType) {
      if (quickLinkType && quickLinkType.length > 0) {
        _this.setState({ showQuickLinks: true, launchQuickLinkType: quickLinkType });
        _this.quicklinksRef.openQuicklink(quickLinkType);
      } else if (searchTypeCode && (searchTypeCode == "COMPLETED" || searchTypeCode == "ASSIGNED") && searchKeyword) {
        _this.searchTasksByKeywordsInTitle();
      } else if (searchTypeCode && (searchTypeCode == "COMPLETED" || searchTypeCode == "ASSIGNED" || searchTypeCode == "ASSIGNEDTOME") && !searchKeyword) {
        _this.readTasksList();
      } else {
        _this.searchByDate();
      }
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
      };
    };

    _this.searchTasksByKeywordsInTitle = function () {
      _this.setStateKeyVal("tasks", []);

      if (_this.state.searchTypeCode == "DATE_COMPLETED_AFTER" || _this.state.searchTypeCode == "DATE_COMPLETED_BEFORE" || _this.state.searchTypeCode == "DATE_ASSIGNED_AFTER" || _this.state.searchTypeCode == "DATE_ASSIGNED_BEFORE") {
        _this.searchByDate();
      } else if (_this.state.searchTypeCode == "ASSIGNEDTOME" || !_this.state.searchKeyword) {
        _this.readTasksList();
        var url = "tasks/state/" + _this.state.searchTypeCode;
        hashHistory.push(url);
      } else {
        _this.search();
        var _url = "tasks/state/" + _this.state.searchTypeCode + "/keyword/" + _this.state.searchKeyword;
        hashHistory.push(_url);
      }
    };

    _this.search = function () {
      api.performSearchByTitleKeyword(_this.state.searchKeyword, _this.state.searchTypeCode).then(function (data) {
        _this.setStateKeyVal("tasks", data);
        _this.prepareTasksRelatedMessage(data);
      });
    };

    _this.searchByDate = function () {
      if (!_this.searchDate || Date.parse(_this.searchDate) == NaN) {
        console.log("Invalid date supplied");
        console.log(_this.searchDate);
        _this.setStateKeyVal("error", "Date required to search");
        _this.prepareTasksRelatedMessage(null);
        return;
      } else {
        _this.setStateKeyVal("error", "");
      }

      var state = void 0;
      var searchType = void 0;

      if (_this.state.searchTypeCode && _this.state.searchTypeCode.includes("ASSIGNED")) {
        state = "ASSIGNED";
      } else {
        state = "COMPLETED";
      }

      if (_this.state.searchTypeCode && _this.state.searchTypeCode.includes("DATE_ASSIGNED_AFTER")) {
        searchType = "SEARCH_FOR_TASKS_ASSIGNED_AFTER_SUPPLIED_DATE";
      } else if (_this.state.searchTypeCode && _this.state.searchTypeCode.includes("DATE_ASSIGNED_BEFORE")) {
        searchType = "SEARCH_FOR_TASKS_ASSIGNED_BEFORE_SUPPLIED_DATE";
      } else if (_this.state.searchTypeCode && _this.state.searchTypeCode.includes("DATE_COMPLETED_AFTER")) {
        searchType = "SEARCH_FOR_TASKS_COMPLETED_AFTER_SUPPLIED_DATE";
      } else if (_this.state.searchTypeCode && _this.state.searchTypeCode.includes("DATE_COMPLETED_BEFORE")) {
        searchType = "SEARCH_FOR_TASKS_COMPLETED_BEFORE_SUPPLIED_DATE";
      }

      api.getTasksBySearch(state, searchType, _this.searchDate).then(function (data) {
        _this.setStateKeyVal("tasks", data);

        _this.prepareTasksRelatedMessage(data);

        var url = "tasks/state/" + _this.state.searchTypeCode + "/keyword/" + _this.searchDate;
        hashHistory.push(url);
      });
    };

    _this.readTasksList = function () {
      api.fetchUserTasksList(_this.state.searchTypeCode).then(function (data) {
        if (_this.props.assignedToUser) {
          data = data.filter(function (d) {
            if (d.taskAssignees) {
              if (d.taskAssignees[0] && d.taskAssignees[0].assignedToUser.toLowerCase() === _this.props.assignedToUser.toLowerCase()) {
                return true;
              }
            }
            return false;
          });
        }

        if (_this.props.taskCount) {
          _this.props.taskCount(data.length);
        }

        _this.setState({
          tasks: data
        });

        _this.prepareTasksRelatedMessage(data);
      });
    };

    _this.prepareTasksRelatedMessage = function (tasks, quicklinkTypeLabel) {
      var message = null;
      var quickLinkMessageTxt = "";
      var downloadDataLink = "";

      if (quicklinkTypeLabel && quicklinkTypeLabel.length > 0) {
        quickLinkMessageTxt = " ( Quick links / " + quicklinkTypeLabel + " ) ";
      }

      if (tasks != null && tasks.length == 25) {
        message = " Showing the first 25 results " + quickLinkMessageTxt + " " + downloadDataLink;
      } else if (tasks != null) {
        message = " Showing " + tasks.length + " results " + quickLinkMessageTxt + " " + downloadDataLink;
      } else {
        message = "  Showing 0 results " + quickLinkMessageTxt;
      }

      _this.setState({ tasksSearchResultMessage: message });
    };

    _this.calculateCommentsButtonLabel = function (task) {
      if (task.taskCustomAttributes.taskCommentsCount > 0) {
        return "Staff notes (" + task.taskCustomAttributes.taskCommentsCount + ")";
      } else if (task.taskCustomAttributes.taskCommentsCount == 0 && task.state == "COMPLETED") {
        return "";
      } else if (task.taskCustomAttributes.taskCommentsCount == 0 && task.state != "COMPLETED") {
        return "Staff note";
      }
    };

    _this.calculateExternalMessagesButtonLabel = function (task) {
      if (task.taskCustomAttributes.taskExternalMessagesCount > 0) {
        return "External messages (" + task.taskCustomAttributes.taskExternalMessagesCount + ")";
      } else if (task.taskCustomAttributes.taskExternalMessagesCount == 0 && task.state == "COMPLETED") {
        return "";
      } else if (task.taskCustomAttributes.taskExternalMessagesCount == 0 && task.state != "COMPLETED") {
        return "External message";
      }
    };

    _this.hasComments = function (task) {
      return task.taskCustomAttributes.taskCommentsCount > 0;
    };

    _this.hasExternalMessages = function (task) {
      return task.taskCustomAttributes.taskExternalMessagesCount > 0;
    };

    _this.taskCommpleted = function (task) {
      return task.state == "COMPLETED";
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

    _this.setSearchTypeCode = function (event, index) {
      _this.setState(function (prevState, props) {
        return {
          searchTypeCode: searchOptions[index].value,
          searchTypeLabel: searchOptions[index].label,
          searchTypeIndex: index,
          tasks: null,
          validationMessages: null,
          selectFieldClassName: "medium-width"
        };
      });

      _this.prepareTasksRelatedMessage();

      _this.setStateKeyVal("error", "");
    };

    _this.onEnter = function () {
      _this.searchTasksByKeywordsInTitle();
    };

    _this.doAdvancedSearch = function () {
      var createdDate = new Date(2018, 2, 3);
      var payload = {
        taskState: "ASSIGNED",
        createdDate: createdDate,
        searchType: "SEARCH_FOR_TASKS_CREATED_BEFORE_SUPPLIED_DATE"
      };
      api.getTasksBySearch(payload).then(function (data) {});
    };

    _this.isMatchingSearchOptionFound = function (searchType, fieldType) {
      for (var i = 0; i < searchOptions.length; i++) {
        if (searchOptions[i].value == searchType && searchOptions[i].type == fieldType) {
          return true;
        }
      }

      return false;
    };

    _this.handleDateSelection = function (date) {
      _this.setState(function (prevState, props) {
        return {
          searchDate: date
        };
      });
      _this.searchDate = date;
    };

    _this.showAssignModal = function (assigneeGroups, taskTitle, taskId) {
      return function (e) {
        e.preventDefault();
        api.fetchEmployeesByGroupName(assigneeGroups).then(function (data) {
          _this.setState({ assignModalOpen: true });
          _this.setState({ assignees: data });
          _this.setState({ assignTaskTitle: taskTitle, assignTaskId: taskId });
        });
      };
    };

    _this.hideAssignModal = function (e) {
      //  return (e) => {
      if (e) {
        e.preventDefault();
      }

      _this.setState({ assignModalOpen: false });
      //  }
    };

    _this.handleAssigneeChange = function (event, index, value) {
      _this.setState({ selectedAssignee: value });
    };

    _this.assignTaskToSomeone = function (e) {
      e.preventDefault();
      if (!_this.state.assignTaskId) {
        //throw error
      } else if (!_this.state.selectedAssignee) {
        //throw error
      } else {
        //all good
        var payload = { type: "ASSIGN_TO_SOMEONE", assigneeName: _this.state.selectedAssignee };
        api.performTaskAction(_this.state.assignTaskId, payload).then(function (data) {
          _this.refreshTasksList(_this.state.searchKeyword, _this.state.searchTypeCode, _this.state.quickLinkType);
          _this.hideAssignModal();
        });
      }
    };

    _this.toggleQuickLink = function () {
      return function (e) {
        e.preventDefault();
        var quickLinkShowState = !_this.state.showQuickLinks;
        _this.setState({ showQuickLinks: quickLinkShowState });
      };
    };

    _this.setTaskDataOnParent = function (data) {
      //return(e)=>{
      _this.setStateKeyVal("tasks", data);
      //}
    };

    _this.state = {
      searchTypeCode: props.searchTypeCode || "ASSIGNED",
      searchKeyword: props.searchKeyword && props.searchTypeCode && !props.searchTypeCode.includes("DATE") ? props.searchKeyword : null,
      searchDate: props.searchKeyword && props.searchTypeCode && props.searchTypeCode.includes("DATE") ? props.searchKeyword : null,
      quickLinkType: props.quickLinkType || null,
      tasks: [],
      success: props.success,
      error: props.error
    };
    return _this;
  }

  TaskList.prototype.componentDidMount = function componentDidMount() {
    if (this.props.searchKeyword && this.props.searchTypeCode && !this.props.searchTypeCode.includes("DATE")) {
      this.setState({ searchKeyword: this.props.searchKeyword });
    }

    if (this.props.searchKeyword && this.props.searchTypeCode && this.props.searchTypeCode.includes("DATE")) {
      this.setState({ searchDate: this.props.searchKeyword });
      this.searchDate = this.props.searchKeyword;
    }

    if (this.props.quickLinkType && this.props.quickLinkType.length > 0) {
      this.setState({ quickLinkType: this.props.quickLinkType });
    }

    this.refreshTasksList(this.state.searchKeyword, this.state.searchTypeCode, this.state.quickLinkType);
  };

  TaskList.prototype.render = function render() {
    var _this2 = this;

    var headers = [{ label: "Title", key: "title" }, { label: "Created Date", key: "createdDateFormatted_for_display_on_excel" }, { label: "Priority", key: "priority" }, { label: "Updated Date", key: "updatedDateFormatted_for_display_on_excel" }, { label: "Status", key: "statusLabel" }, { label: "Outcome", key: "outcomeLabel" }, { label: "Assignees", key: "taskAssignees_for_display_on_excel" }, { label: "Last Updated By", key: "updatedBy" }, { label: "Comments Count ", key: "taskCommentsCount_for_display_on_excel" }, { label: "External Messages Count ", key: "taskExternalMessagesCount_for_display_on_excel" }];

    var assignTaskModalActions = [React.createElement(FlatButton, { label: "Cancel", primary: false, onClick: this.hideAssignModal }), React.createElement(FlatButton, { label: "Submit", primary: true, onClick: this.assignTaskToSomeone })];

    var selectFieldStyle = {
      width: "100%",
      color: "#999"
    };

    var taskCount = 0;

    return React.createElement(
      "div",
      { className: "task-list-page uikit-grid" },
      React.createElement(Messages, { success: this.state.success, error: this.state.error }),
      this.state.showQuickLinks && React.createElement(QuickLinks, {
        ref: function ref(quicklinksRef) {
          return _this2.quicklinksRef = quicklinksRef;
        },
        setTaskDataOnParent: this.setTaskDataOnParent,
        prepareTasksRelatedMessage: this.prepareTasksRelatedMessage,
        toggleQuickLink: this.toggleQuickLink,
        launchQuickLinkType: this.state.launchQuickLinkType
      }),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-11" },
          " ",
          React.createElement(
            "h1",
            null,
            this.props.heading || "Tasks"
          ),
          " "
        ),
        !this.state.showQuickLinks && React.createElement(
          "div",
          { className: "col-md-1" },
          React.createElement(
            "a",
            { href: "#", onClick: this.toggleQuickLink() },
            "Quick Links"
          )
        )
      ),
      React.createElement(
        LoadableSection,
        null,
        this.props.showSearch !== false && React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col-md-5" },
                React.createElement(
                  SelectField,
                  {
                    floatingLabelText: "Show tasks",
                    onChange: this.setSearchTypeCode,
                    value: this.state.searchTypeCode,
                    style: selectFieldStyle,
                    floatingLabelStyle: selectFieldStyle,
                    className: "search custom-width",
                    onEnter: this.onEnter
                  },
                  searchOptions.map(function (searchOption) {
                    return React.createElement(MenuItem, { key: searchOption.value, value: searchOption.value, primaryText: searchOption.label });
                  })
                )
              ),
              React.createElement(
                "div",
                { className: "col-md-5" },
                this.state.searchTypeCode && this.isMatchingSearchOptionFound(this.state.searchTypeCode, "text") && React.createElement(Input, {
                  label: "keyword",
                  id: "search",
                  value: this.state.searchKeyword,
                  onChange: this.onSearchFieldChange("searchKeyword"),
                  placeholder: "keyword",
                  onEnter: this.onEnter
                }),
                this.state.searchTypeCode && this.isMatchingSearchOptionFound(this.state.searchTypeCode, "date") && React.createElement(DateInput, { label: "Date", id: "date", value: this.state.searchDate, placeholder: "Date", handle: this.handleDateSelection, type: "date" })
              ),
              React.createElement(
                "div",
                { className: "col-md-2" },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "button",
                    { className: "uikit-btn main-btn", id: "task-list-search-btn", onClick: this.searchTasksByKeywordsInTitle },
                    "Search"
                  )
                )
              )
            )
          )
        ),
        this.state.tasksSearchResultMessage != null && React.createElement(
          "div",
          { style: { paddingBottom: "30px", paddingTop: "20px" } },
          this.state.tasksSearchResultMessage,
          this.state.tasks && this.state.tasks.length > 0 && React.createElement(
            CSVLink,
            { filename: "tasks-results.csv", data: this.state.tasks, headers: headers },
            "(Download results)"
          )
        ),
        React.createElement(
          "ul",
          { className: "task-list" },
          this.state.tasks && this.state.tasks.map(function (task) {
            return React.createElement(
              "li",
              { key: taskCount++ },
              React.createElement(TaskSummaryCard, {
                task: task,
                type: task.title,
                createdDate: _this2.getCreatedDateDisplayString(task.createdDate),
                lastUpdatedDate: _this2.getLastUpdatedDateDisplayString(task.updatedDate),
                updatedBy: task.updatedBy,
                priority: task.priority,
                assigned: task.taskCustomAttributes.taskAssignees && task.taskCustomAttributes.taskAssignees[0],
                taskid: task.taskId,
                commentsButtonLabel: _this2.calculateCommentsButtonLabel(task),
                externalMessagesButtonLabel: _this2.calculateExternalMessagesButtonLabel(task),
                hasComments: _this2.hasComments(task),
                hasExternalMessages: _this2.hasExternalMessages(task),
                taskCommpleted: _this2.taskCommpleted(task),
                refreshTasksList: _this2.refreshTasksList,
                statusLabel: task.statusLabel,
                description: task.description,
                onChange: _this2.onChange,
                searchKeyword: _this2.props.searchKeyword,
                searchTypeCode: _this2.props.searchTypeCode,
                quickLinkType: _this2.props.quickLinkType,
                taskAssigneeGroups: task.taskAssigneeGroups,
                showAssignModal: _this2.showAssignModal(task.taskAssigneeGroups, task.title, task.taskId)
              })
            );
          })
        )
      ),
      React.createElement(
        Dialog,
        { title: "Assign task  (" + this.state.assignTaskTitle + ")", actions: assignTaskModalActions, modal: true, open: this.state.assignModalOpen },
        this.state.assignees && this.state.assignees.length > 0 && React.createElement(
          SelectField,
          {
            floatingLabelText: "Choose an assignee",
            hintText: "Select a name",
            value: this.state.selectedAssignee,
            autoWidth: true,
            onChange: this.handleAssigneeChange,
            style: { width: "100%" }
          },
          this.state.assignees.map(function (assignee) {
            return React.createElement(MenuItem, { key: assignee, value: assignee, primaryText: assignee });
          })
        )
      )
    );
  };

  return TaskList;
}(React.Component);

export default TaskList;