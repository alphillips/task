"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _api = require("./../api");

var api = _interopRequireWildcard(_api);

require("./quick-links.css");

var _reactRouter = require("react-router");

var _Chip = require("material-ui/Chip");

var _Chip2 = _interopRequireDefault(_Chip);

var _colors = require("material-ui/styles/colors");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  chip: {
    margin: 4,
    color: "#888"
  },
  wrapper: {
    display: "flex",
    flexWrap: "wrap"
  }
};

var quickLinksOptions_Pending = [{ value: "TASKS_CREATED_TODAY", label: "pending - received today" }, { value: "TASKS_CREATED_THIS_WEEK", label: "pending - received this week" }, { value: "TASKS_CREATED_LAST_WEEK", label: "pending - received last week" }, { value: "TASKS_CREATED_THIS_MONTH", label: "pending - received this month" }, { value: "TASKS_CREATED_LAST_MONTH", label: "pending - received last month" }];
var quickLinksOptions_Completed = [{ value: "TASKS_COMPLETED_TODAY", label: "completed today" }, { value: "TASKS_COMPLETED_THIS_WEEK", label: "completed this week" }, { value: "TASKS_COMPLETED_LAST_WEEK", label: "completed last week" }, { value: "TASKS_COMPLETED_THIS_MONTH", label: "completed this month" }, { value: "TASKS_COMPLETED_LAST_MONTH", label: "completed last month" }];

var QuickLinks = function (_React$Component) {
  _inherits(QuickLinks, _React$Component);

  function QuickLinks(props) {
    _classCallCheck(this, QuickLinks);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleClick = function (value) {
      return function (e) {
        e.preventDefault();
        _this.openQuicklink(value);
      };
    };

    _this.extractQuickLinkLabelByType = function (quickLinkType) {
      var quickLinkLabelObject = quickLinksOptions_Pending.filter(function (obj) {
        return obj.value == quickLinkType;
      });

      if (quickLinkLabelObject == null || quickLinkLabelObject == undefined || quickLinkLabelObject.length == 0) {
        quickLinkLabelObject = quickLinksOptions_Completed.filter(function (obj) {
          return obj.value == quickLinkType;
        });
      }

      if (quickLinkLabelObject == null || quickLinkLabelObject == [] || quickLinkLabelObject.length == 0) {
        return quickLinkType;
      }

      return quickLinkLabelObject[0].label;
    };

    _this.openQuicklink = function (quickLinkType) {
      var quickLinkLabel = _this.extractQuickLinkLabelByType(quickLinkType);

      api.getTasksByQuickLink(quickLinkType).then(function (data) {
        _this.props.prepareTasksRelatedMessage(data, quickLinkLabel);
        _this.props.setTaskDataOnParent(data);
        var url = "tasks/quick-link/" + quickLinkType;
        _reactRouter.hashHistory.push(url);
      });
    };

    _this.setState(function (prevState, props) {
      return {
        showQuicklinks: true
      };
    });
    return _this;
  }

  QuickLinks.prototype.componentDidMount = function componentDidMount() {
    if (this.props.launchQuickLinkType && this.props.launchQuickLinkType.length > 0) {
      this.openQuicklink(this.props.launchQuickLinkType);
    }
  };

  QuickLinks.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    // if (nextProps.launchQuickLinkType && nextProps.launchQuickLinkType.length>0) {
    //     this.openQuicklink( nextProps.launchQuickLinkType);
    // }
    // console.log("componentWillReceiveProps : ");
    // console.log(nextProps);
  };

  QuickLinks.prototype.quicklinkPrint = function quicklinkPrint() {
    console.log("PRINT");
  };

  QuickLinks.prototype.render = function render() {
    var _this2 = this;

    return _react2.default.createElement(
      "div",
      { className: "uikit-grid main-paper", style: { padding: 9 } },
      _react2.default.createElement(
        "div",
        { className: "row" },
        _react2.default.createElement(
          "div",
          { className: "col-md-2" },
          _react2.default.createElement(
            "div",
            { style: { color: "#777", display: "inline" } },
            _react2.default.createElement(
              "strong",
              null,
              "Quick links"
            )
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "col-md-10", style: styles.wrapper },
          quickLinksOptions_Pending.map(function (quickLink) {
            return _react2.default.createElement(
              _Chip2.default,
              { backgroundColor: _colors.cyan50, onClick: _this2.handleClick(quickLink.value), style: styles.chip },
              _react2.default.createElement(
                "a",
                { href: "#" },
                " ",
                quickLink.label
              )
            );
          }),
          quickLinksOptions_Completed.map(function (quickLink) {
            return _react2.default.createElement(
              _Chip2.default,
              { onClick: _this2.handleClick(quickLink.value), style: styles.chip },
              _react2.default.createElement(
                "a",
                { href: "#" },
                " ",
                quickLink.label
              )
            );
          })
        )
      ),
      _react2.default.createElement(
        "div",
        { className: "row" },
        _react2.default.createElement("div", { className: "col-md-11" }),
        _react2.default.createElement(
          "div",
          { className: "col-md-1" },
          " ",
          _react2.default.createElement(
            "a",
            { href: "#", onClick: this.props.toggleQuickLink() },
            "close"
          ),
          " "
        )
      )
    );
  };

  return QuickLinks;
}(_react2.default.Component);

exports.default = QuickLinks;
module.exports = exports["default"];