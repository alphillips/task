import React from "react";
import { render } from "react-dom";

import QuickLinks from "../../src/QuickLinks/QuickLinks";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class Demo extends QuickLinks {
  constructor(props) {
    super(props);

    this.state = {
      city: "Paris",
      address1: "",
    };

    this.address = {
      addressLine1: "7 Honmachi",
      addressLine2: "",
      addressLine3: "",
      city: "Shibuya-ku",
      state: "Tōkyō-to",
      postcode: "151-0071",
      country: "JP",
    };

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
          <h1>task Demo</h1>
          <QuickLinks
            ref={quicklinksRef => (this.quicklinksRef = quicklinksRef)}
            setTaskDataOnParent={this.setTaskDataOnParent}
            prepareTasksRelatedMessage={this.prepareTasksRelatedMessage}
            toggleQuickLink={this.toggleQuickLink}
            launchQuickLinkType={this.state.launchQuickLinkType}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Demo;
