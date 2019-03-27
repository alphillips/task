"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _input = require("@react-ag-components/input");

var _input2 = _interopRequireDefault(_input);

var _api = require("./../api");

var api = _interopRequireWildcard(_api);

require("./task-comments.css");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      var m = (0, _moment2.default)(eps);
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
      selectedAction: "",
      addCommentSectionVisible: true,
      comments: [],
      newcomment: [],
      loading: false
    };

    _this.taskid = props.taskid || null;
    return _this;
  }

  TaskComments.prototype.componentDidMount = function componentDidMount() {
    this.setState({
      comments: this.state.task == null || this.state.task.comments == null ? [] : this.state.task.comments,
      addCommentSectionVisible: this.state.task == null || this.state.task.state == null || this.state.task.state == "COMPLETED" ? false : true
    });
  };

  TaskComments.prototype.render = function render() {
    var _this2 = this;

    var count = 0;
    var commentCount = 0;

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "div",
        { style: { border: "solid 0px #e8e8ee" }, className: " uikit-grid" },
        _react2.default.createElement(
          "div",
          { style: { paddingTop: "1em" } },
          _react2.default.createElement(
            "div",
            { className: "row" },
            _react2.default.createElement(
              "div",
              { className: "col-md-6" },
              _react2.default.createElement(
                "span",
                { style: { fontSize: "1.2em", fontWeight: "bold" } },
                "Staff Notes ",
                _react2.default.createElement("span", { className: "comment-link" }),
                " (",
                this.state.comments && this.state.comments.length,
                ")"
              )
            ),
            _react2.default.createElement("div", { className: "col-md-6" })
          ),
          _react2.default.createElement("br", null),
          this.state.comments && this.state.comments.length > 0 && _react2.default.createElement(
            "div",
            { className: "task-detail-comments" },
            _react2.default.createElement(
              "ul",
              null,
              this.state.comments.sort(function (a, b) {
                return new Date(a.createDate) - new Date(b.createDate);
              }).map(function (comment) {
                return _react2.default.createElement(
                  "li",
                  { key: commentCount++ },
                  _react2.default.createElement(
                    "div",
                    { className: "user" },
                    comment.createdBy
                  ),
                  _react2.default.createElement(
                    "div",
                    { className: "task-date" },
                    _this2.formatDateToString(comment.createDate)
                  ),
                  _react2.default.createElement(
                    "div",
                    null,
                    comment.comment
                  )
                );
              })
            )
          ),
          this.state.addCommentSectionVisible && _react2.default.createElement(
            "div",
            { className: "row" },
            _react2.default.createElement(
              "div",
              { className: "col-md-6" },
              _react2.default.createElement(_input2.default, {
                label: "Add a note",
                value: this.state.commentInputText,
                onChange: this.onCommentTextChange,
                onKeyPress: this.onCommentKeyPress,
                rows: 2,
                multiLine: true,
                maxlength: "1900"
              }),
              _react2.default.createElement(
                "button",
                { className: "uikit-btn uikit-btn--tertiary comment-btn ", onClick: function onClick() {
                    return _this2.addComment();
                  } },
                "Add"
              )
            ),
            _react2.default.createElement(
              "div",
              { className: "col-md-6" },
              " "
            )
          )
        )
      )
    );
  };

  return TaskComments;
}(_react2.default.Component);

exports.default = TaskComments;
module.exports = exports["default"];