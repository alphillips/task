function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";

import * as api from "./../api";
import "./task.css";
import Input from "@react-ag-components/input";
import FlatButton from "material-ui/FlatButton";

var TaskSummaryCard = function (_React$Component) {
  _inherits(TaskSummaryCard, _React$Component);

  function TaskSummaryCard(props) {
    _classCallCheck(this, TaskSummaryCard);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.goToTaskDetailsPage = function (e) {
      e.preventDefault();
      _this.props.onChange(_this.props.taskid);
    };

    _this.onTaskClick = function (id) {
      return function (e) {
        e.preventDefault();
        _this.props.onChange(id);
      };
    };

    _this.showAssignModal = function () {
      return function (e) {
        if (_this.refs.root) {
          e.preventDefault();
          //var data =["GRAZ-ND-HELPDESK", "NEXDOC.INTEGRATION.TEST.INTERNAL.USER", "NOON ALEXANDRA", "NEXDOC REGISTRATIONS2", "VILLACA KLAUS", "NEXDOC HELPDESK2", "NEXDOC HELPDESK1", "TALLURI SUBRAMANYAM"];
          api.fetchEmployeesByGroupName(_this.props.taskAssigneeGroups).then(function (data) {
            _this.setState({ assignModalOpen: true });
            _this.setState({ assignees: data });
          });
        }
      };
    };

    _this.hideAssignModal = function () {
      return function (e) {
        e.preventDefault();
        _this.setState({ assignModalOpen: false });
      };
    };

    _this.unAssignTaskFromMe = function (e) {
      e.preventDefault();
      if (_this.props.taskid) {
        var payload = { type: "UNASSIGN_A_TASK" };
        api.performTaskAction(_this.props.taskid, payload).then(function (data) {
          if (_this.props.refreshTasksList) {
            _this.props.refreshTasksList(_this.props.searchKeyword, _this.props.searchTypeCode, _this.props.quickLinkType);
          }
        });
      }
    };

    _this.addComment = function () {
      if (_this.props.taskid && _this.state.commentInputText && _this.state.commentInputText.trim().length > 0) {
        //this.setStateKeyVal('loading',true)
        var payload = { comment: _this.state.commentInputText };
        api.addComment(_this.props.taskid, payload).then(function (data) {
          if (_this.props.refreshTasksList) {
            _this.props.refreshTasksList(_this.props.searchKeyword, _this.props.searchTypeCode, _this.props.quickLinkType);
          }
        });
      }
    };

    _this.onCommentKeyPress = function (e) {
      if (e.key === "Enter") {
        _this.addComment();
      }
    };

    _this.onCommentTextChange = function (e) {
      _this.setState(function (prevState, props) {
        return {
          commentInputText: e
        };
      });
    };

    _this.chooseDisplayLabel = function (taskStatusLabel) {
      if (taskStatusLabel == "APPROVED") {
        return "approved-status";
      } else if (taskStatusLabel == "REJECTED") {
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
      comments: props.comments || [],
      taskid: props.taskid || null,
      commentInputText: "",
      assignModalOpen: false,
      assignees: []
    };
    return _this;
  }
  /*
  assignTaskToMe = (e) =>{
      return(e) => {
          e.preventDefault();
          if( this.props.taskid ){
                var payload= { type:"ASSIGN_TO_ME" }
                api.performTaskAction(this.props.taskid, payload ).then((data) =>{
                  if(this.props.refreshTasksList){
                    this.props.refreshTasksList(this.props.searchKeyword , this.props.searchTypeCode, this.props.quickLinkType)
                  }
              })
          }
      }
  }
  */

  TaskSummaryCard.prototype.render = function render() {
    var actions = [React.createElement(FlatButton, { label: "Cancel", primary: true, onClick: this.hideAssignModal }), React.createElement(FlatButton, { label: "Submit", primary: true, disabled: true, onClick: this.hideAssignModal })];

    return React.createElement(
      "div",
      { className: "task uikit-grid main-paper", ref: "root" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-10" },
          React.createElement(
            "div",
            { className: "task-title" },
            React.createElement(
              "a",
              { href: "#", onClick: this.goToTaskDetailsPage },
              this.props.type
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-md-2" },
          React.createElement(
            "div",
            { className: this.chooseDisplayLabel(this.props.statusLabel) },
            this.props.statusLabel
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-6" },
          this.props.description
        ),
        React.createElement(
          "div",
          { className: "col-md-6" },
          React.createElement(
            "div",
            { className: "task-date" },
            this.props.createdDate
          ),
          React.createElement(
            "div",
            { className: "task-date" },
            this.props.lastUpdatedDate
          ),
          this.props.assigned && React.createElement(
            "div",
            { className: "task-date" },
            "Assigned: ",
            this.props.assigned
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row task-btns" },
        window.IS_STAFF && React.createElement(
          "div",
          { className: "col-md-6" },
          this.props.hasComments && React.createElement(
            "a",
            { href: "#", className: "message-link", onClick: this.goToTaskDetailsPage },
            this.props.commentsButtonLabel
          ),
          this.props.hasExternalMessages && React.createElement(
            "span",
            null,
            "\xA0",
            " ",
            React.createElement(
              "a",
              { href: "#", className: "mail-link", onClick: this.goToTaskDetailsPage },
              this.props.externalMessagesButtonLabel
            ),
            " "
          ),
          !this.props.hasComments && !this.props.taskCommpleted && React.createElement(
            "div",
            null,
            React.createElement(Input, {
              label: "Add a staff note",
              value: this.state.commentInputText,
              onChange: this.onCommentTextChange,
              onKeyPress: this.onCommentKeyPress,
              rows: 2,
              multiLine: true,
              maxlength: "1900"
            })
          )
        ),
        window.IS_STAFF && !this.props.taskCommpleted && React.createElement(
          "div",
          { className: "col-md-6 assign-btns" },
          this.props.hasComments && React.createElement(
            "div",
            null,
            this.props.assigned == null && React.createElement(
              "div",
              null,
              React.createElement(
                "a",
                { href: "#", className: "assign-link", onClick: this.props.showAssignModal },
                "Assign",
                " "
              )
            ),
            this.props.assigned != null && this.props.task.taskCustomAttributes.taskAssignees && this.props.task.taskCustomAttributes.taskAssignees[0] === this.props.task.currentUserId && React.createElement(
              "a",
              { href: "#", className: "unassign-link", onClick: this.unAssignTaskFromMe },
              "Unassign"
            )
          )
        )
      ),
      window.IS_STAFF && !this.props.taskCommpleted && React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-6" },
          !this.props.hasComments && React.createElement(
            "div",
            null,
            React.createElement(
              "button",
              { className: "uikit-btn uikit-btn--tertiary comment-btn", onClick: this.addComment },
              "Add"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-md-6 assign-btns" },
          !this.props.hasComments && React.createElement(
            "div",
            null,
            this.props.assigned == null && React.createElement(
              "a",
              { href: "#", className: "assign-link", onClick: this.props.showAssignModal },
              "Assign",
              " "
            ),
            this.props.assigned != null && this.props.task.taskCustomAttributes.taskAssignees && this.props.task.taskCustomAttributes.taskAssignees[0] === this.props.task.currentUserId && React.createElement(
              "a",
              { href: "#", className: "unassign-link", onClick: this.unAssignTaskFromMe },
              "Unassign"
            )
          )
        )
      )
    );
  };

  return TaskSummaryCard;
}(React.Component);

export default TaskSummaryCard;