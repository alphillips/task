"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _api = require("./../api");

var api = _interopRequireWildcard(_api);

require("./task.css");

var _input = require("@react-ag-components/input");

var _input2 = _interopRequireDefault(_input);

var _FlatButton = require("material-ui/FlatButton");

var _FlatButton2 = _interopRequireDefault(_FlatButton);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    var actions = [_react2.default.createElement(_FlatButton2.default, { label: "Cancel", primary: true, onClick: this.hideAssignModal }), _react2.default.createElement(_FlatButton2.default, { label: "Submit", primary: true, disabled: true, onClick: this.hideAssignModal })];

    return _react2.default.createElement(
      "div",
      { className: "task uikit-grid main-paper", ref: "root" },
      _react2.default.createElement(
        "div",
        { className: "row" },
        _react2.default.createElement(
          "div",
          { className: "col-md-10" },
          _react2.default.createElement(
            "div",
            { className: "task-title" },
            _react2.default.createElement(
              "a",
              { href: "#", onClick: this.goToTaskDetailsPage },
              this.props.type
            )
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "col-md-2" },
          _react2.default.createElement(
            "div",
            { className: this.chooseDisplayLabel(this.props.statusLabel) },
            this.props.statusLabel
          )
        )
      ),
      _react2.default.createElement(
        "div",
        { className: "row" },
        _react2.default.createElement(
          "div",
          { className: "col-md-6" },
          this.props.description
        ),
        _react2.default.createElement(
          "div",
          { className: "col-md-6" },
          _react2.default.createElement(
            "div",
            { className: "task-date" },
            this.props.createdDate
          ),
          _react2.default.createElement(
            "div",
            { className: "task-date" },
            this.props.lastUpdatedDate
          ),
          this.props.assigned && _react2.default.createElement(
            "div",
            { className: "task-date" },
            "Assigned: ",
            this.props.assigned
          )
        )
      ),
      _react2.default.createElement(
        "div",
        { className: "row task-btns" },
        window.IS_STAFF && _react2.default.createElement(
          "div",
          { className: "col-md-6" },
          this.props.hasComments && _react2.default.createElement(
            "a",
            { href: "#", className: "message-link", onClick: this.goToTaskDetailsPage },
            this.props.commentsButtonLabel
          ),
          this.props.hasExternalMessages && _react2.default.createElement(
            "span",
            null,
            "\xA0",
            " ",
            _react2.default.createElement(
              "a",
              { href: "#", className: "mail-link", onClick: this.goToTaskDetailsPage },
              this.props.externalMessagesButtonLabel
            ),
            " "
          ),
          !this.props.hasComments && !this.props.taskCommpleted && _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(_input2.default, {
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
        window.IS_STAFF && !this.props.taskCommpleted && _react2.default.createElement(
          "div",
          { className: "col-md-6 assign-btns" },
          this.props.hasComments && _react2.default.createElement(
            "div",
            null,
            this.props.assigned == null && _react2.default.createElement(
              "div",
              null,
              _react2.default.createElement(
                "a",
                { href: "#", className: "assign-link", onClick: this.props.showAssignModal },
                "Assign",
                " "
              )
            ),
            this.props.assigned != null && this.props.task.taskCustomAttributes.taskAssignees && this.props.task.taskCustomAttributes.taskAssignees[0] === this.props.task.currentUserId && _react2.default.createElement(
              "a",
              { href: "#", className: "unassign-link", onClick: this.unAssignTaskFromMe },
              "Unassign"
            )
          )
        )
      ),
      window.IS_STAFF && !this.props.taskCommpleted && _react2.default.createElement(
        "div",
        { className: "row" },
        _react2.default.createElement(
          "div",
          { className: "col-md-6" },
          !this.props.hasComments && _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(
              "button",
              { className: "uikit-btn uikit-btn--tertiary comment-btn", onClick: this.addComment },
              "Add"
            )
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "col-md-6 assign-btns" },
          !this.props.hasComments && _react2.default.createElement(
            "div",
            null,
            this.props.assigned == null && _react2.default.createElement(
              "a",
              { href: "#", className: "assign-link", onClick: this.props.showAssignModal },
              "Assign",
              " "
            ),
            this.props.assigned != null && this.props.task.taskCustomAttributes.taskAssignees && this.props.task.taskCustomAttributes.taskAssignees[0] === this.props.task.currentUserId && _react2.default.createElement(
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
}(_react2.default.Component);

exports.default = TaskSummaryCard;
module.exports = exports["default"];