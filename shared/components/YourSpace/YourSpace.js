import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import variables from '../../../variables';
import ProfileSidebar from './userProfile/Sidebar/ProfileSidebar';
import UserProfile from './userProfile/UserProfile';
import MyCyhannel from './YourChannel/MyChannel';

class YourSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkUrl() {
    const url = this.props.location.pathname;
    if (url == '/yourspace' || url == '/yourspace/') {
      return <UserProfile />;
    } else if (url == '/yourspace/channel' || url == '/yourspace/channel/') {
      return <MyCyhannel />;
    }
  }

  render() {
    // const {match : {params}} = this.props;
    const checkUrl = this.checkUrl();
    return (
      <div className="container">
        <div className="row">
          <div className="userprofile-sidebar">
            <ProfileSidebar />
          </div>
          {checkUrl}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const contentdata = state;
  return { contentdata };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getContentCard: (like, trending, pageno) => {
      dispatch(getContentCard(like, trending, pageno));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(YourSpace);
