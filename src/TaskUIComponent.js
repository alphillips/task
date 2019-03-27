import React from "react";

import TaskList from "./TaskList/TaskList";
import TaskDetail from "./TaskDetail/TaskDetail";

class TaskUIComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState((prevState, props) => ({
      id: nextProps.id || null,
    }));
  }

  goBack = () => {
    this.props.onChange(null);
  };

  onTaskClick = id => {
    if (id) {
      this.setMessage(null);
    }
    this.props.onChange(id);
  };

  setMessage = message => {
    this.setState({ success: message });
  };

  render() {
    return (
      <div>
        {!this.state.id && (
          <div>
            <TaskList
              onChange={this.onTaskClick}
              showSearch={this.props.showSearch}
              assignedToUser={this.props.assignedToUser}
              taskCount={this.props.taskCount}
              heading={this.props.heading}
              searchTypeCode={this.props.searchTypeCode}
              searchKeyword={this.props.searchKeyword}
              quickLinkType={this.props.quickLinkType}
            />
          </div>
        )}

        {this.state.id && (
          <div>
            <TaskDetail taskid={this.state.id} setMessage={this.setMessage} onChange={this.onTaskClick} />
          </div>
        )}
      </div>
    );
  }
}

export default TaskUIComponent;
