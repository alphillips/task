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
  { value: "TASKS_CREATED_TODAY",  label: "pending - received today" },
  { value: "TASKS_CREATED_THIS_WEEK",   label: "pending - received this week" },
  { value: "TASKS_CREATED_LAST_WEEK", label: "pending - received last week" },
  { value: "TASKS_CREATED_THIS_MONTH",  label: "pending - received this month"  },
  { value: "TASKS_CREATED_LAST_MONTH",    label: "pending - received last month" }
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
      }));
  }

  componentDidMount () {
      if (this.props.launchQuickLinkType && this.props.launchQuickLinkType.length>0) {
          this.openQuicklink( this.props.launchQuickLinkType);
      }
  }

  componentWillReceiveProps(nextProps){
    // if (nextProps.launchQuickLinkType && nextProps.launchQuickLinkType.length>0) {
    //     this.openQuicklink( nextProps.launchQuickLinkType);
    // }
    // console.log("componentWillReceiveProps : ");
    // console.log(nextProps);
  }


  quicklinkPrint() {
    console.log("PRINT");
  }

  handleClick=(value)=> {
    return(e)=>{
      e.preventDefault();
      this.openQuicklink(value);
    }
  }

  extractQuickLinkLabelByType = (quickLinkType) =>{

      let quickLinkLabelObject = quickLinksOptions_Pending.filter(function( obj ) {
            return obj.value == quickLinkType;
      });

      if(quickLinkLabelObject == null || quickLinkLabelObject== undefined || quickLinkLabelObject.length==0 ){
            quickLinkLabelObject = quickLinksOptions_Completed.filter(function( obj ) {
                          return obj.value == quickLinkType;
            });
      }

      if(quickLinkLabelObject == null || quickLinkLabelObject == [] || quickLinkLabelObject.length==0){
            return quickLinkType;
      }

      return quickLinkLabelObject[0].label;
  }

  openQuicklink = (quickLinkType) =>{

      let quickLinkLabel = this.extractQuickLinkLabelByType(quickLinkType);

      api.getTasksByQuickLink(quickLinkType ).then((data) =>{
            this.props.prepareTasksRelatedMessage(data, quickLinkLabel);
            this.props.setTaskDataOnParent(data);
            let url = "tasks/quickLink/"+quickLinkType;
            hashHistory.push(url);
      })
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
                            <a href="#" > {quickLink.label}</a>
                         </Chip>
                       )}
                       {quickLinksOptions_Completed.map((quickLink) =>
                          <Chip
                            onClick={this.handleClick(quickLink.value)}
                            style={styles.chip}>
                             <a href="#"> {quickLink.label}</a>
                          </Chip>
                        )}
                    </div>

                   </div>

                  <div className="row">
                    <div className="col-md-11"></div>
                    <div className="col-md-1">   <a href="#" onClick={this.props.toggleQuickLink()}>close</a> </div>
                  </div>

            </div>
    );
  }
}
export default  QuickLinks
