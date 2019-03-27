function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import * as api from "./../api";
import "./quick-links.css";
import { hashHistory } from "react-router";
import Chip from "material-ui/Chip";
import { cyan50 } from "material-ui/styles/colors";

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
        hashHistory.push(url);
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

    return React.createElement(
      "div",
      { className: "uikit-grid main-paper", style: { padding: 9 } },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-2" },
          React.createElement(
            "div",
            { style: { color: "#777", display: "inline" } },
            React.createElement(
              "strong",
              null,
              "Quick links"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-md-10", style: styles.wrapper },
          quickLinksOptions_Pending.map(function (quickLink) {
            return React.createElement(
              Chip,
              { backgroundColor: cyan50, onClick: _this2.handleClick(quickLink.value), style: styles.chip },
              React.createElement(
                "a",
                { href: "#" },
                " ",
                quickLink.label
              )
            );
          }),
          quickLinksOptions_Completed.map(function (quickLink) {
            return React.createElement(
              Chip,
              { onClick: _this2.handleClick(quickLink.value), style: styles.chip },
              React.createElement(
                "a",
                { href: "#" },
                " ",
                quickLink.label
              )
            );
          })
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement("div", { className: "col-md-11" }),
        React.createElement(
          "div",
          { className: "col-md-1" },
          " ",
          React.createElement(
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
}(React.Component);

export default QuickLinks;