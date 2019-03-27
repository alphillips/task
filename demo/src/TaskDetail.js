import React from "react";

import TaskDetail from "../../src/TaskDetail/TaskDetail";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class Demo extends TaskDetail {
  constructor(props) {
    super(props);

    this.state = {
      city: "Paris",
      address1: "",
    };

    this.taskId = "7e165203-49d9-4f4c-96f6-fc9616d2b33c";

    this.city = "";
  }

  onChange = address => {
    console.log("got address");
    console.log(address);
  };

  onChangeAddress1 = address => {
    this.setState((prevState, props) => ({
      address1: address,
    }));
  };

  onChangeCity = city => {
    this.setState((prevState, props) => ({
      city: city,
    }));
  };

  handleNext = () => {
    hashHistory.push("/");
  };

  toggleQuickLink = () => {
    return e => {
      e.preventDefault();
      let quickLinkShowState = !this.state.showQuickLinks;
      this.setState({ showQuickLinks: quickLinkShowState });
    };
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <h1>task details Demo</h1>
          <TaskDetail taskid={this.taskId} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Demo;
