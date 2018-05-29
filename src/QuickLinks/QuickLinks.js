import React from 'react'
import * as api from './../api'
import './quick-links.css'
import { hashHistory } from "react-router";
import Chip from 'material-ui/Chip';
import {cyan50} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

const styles = {
  chip: {
    margin: 4,
    color:'#888'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const quickLinksOptions_Pending = [
  { value: "TASKS_CREATED_TODAY",  label: "received today" },
  { value: "TASKS_CREATED_THIS_WEEK",   label: "received this week" },
  { value: "TASKS_CREATED_LAST_WEEK", label: "received last week" },
  { value: "TASKS_CREATED_THIS_MONTH",  label: "received this month"  },
  { value: "TASKS_CREATED_LAST_MONTH",    label: "received last month" }
];
const quickLinksOptions_Completed = [
  { value: "TASKS_COMPLETED_TODAY",  label: "completed today" },
  { value: "TASKS_COMPLETED_THIS_WEEK",   label: "completed this week" },
  { value: "TASKS_COMPLETED_LAST_WEEK", label: "completed last week" },
  { value: "TASKS_COMPLETED_THIS_MONTH",  label: "completed this month"  },
  { value: "TASKS_COMPLETED_LAST_MONTH",    label: "completed last month" }
];

class QuickLinks extends React.Component {

  constructor(props) {
      super(props);
      this.setState((prevState, props) => ({
      showQuicklinks : true
      }))
  }

  componentDidMount () {
  }

  handleRequestDelete=(value) =>{
    return (e) => {
      e.preventDefault();
      alert('You clicked the delete button. '+value);
    }
  }

  handleClick=(value)=> {
    return(e)=>{
      e.preventDefault();
      alert('You clicked the '+value);
      this.openQuicklink(value);
    }
  }


  openQuicklink = (quickLinkType) =>{

    api.getTasksByQuickLink(quickLinkType ).then((data) =>{
      this.setStateKeyVal('tasks', data)

      this.prepareTasksRelatedMessage(data);

      let url = "tasks/quickLink/type/"+quickLinkType;
      hashHistory.push(url);

    })
  }


  prepareTasksRelatedMessage = (tasks) => {
    let message = null;

    if(tasks !=null && tasks.length==25 ){
      message = "   Showing the first 25 results ";
    }else if(tasks !=null){
      message = "  Showing "+tasks.length+" results ";
    }else {
        message = "  Showing 0 results ";
    }

    this.setState({tasksSearchResultMessage  : message});
  }


  render() {

    return (
            <div className = "uikit-grid main-paper" style={{padding:9}}>

                  <div className="row">
                    <div className="col-md-2">
                      <div style={{ 'color': '#777' , 'display': 'inline' }}>
                          <strong>Quick links</strong>
                      </div>
                    </div>
                    <div className="col-md-10" style={styles.wrapper}>
                      {quickLinksOptions_Pending.map((quickLink) =>
                         <Chip
                           backgroundColor={cyan50}
                           onClick={this.handleClick(quickLink.value)}
                           style={styles.chip}>
                            <a href="#" onClick={this.handleClick(quickLink.value)}> {quickLink.label}</a>
                         </Chip>
                       )}
                       {quickLinksOptions_Completed.map((quickLink) =>
                          <Chip
                            onClick={this.handleClick(quickLink.value)}
                            style={styles.chip}>
                             <a href="#" onClick={this.handleClick(quickLink.value)}> {quickLink.label}</a>
                          </Chip>
                        )}
                    </div>
                   </div>

            </div>
    );
  }
}
export default  QuickLinks
