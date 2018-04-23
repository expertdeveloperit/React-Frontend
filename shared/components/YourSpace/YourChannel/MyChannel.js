import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChannelHeader from './ChannelHeader';
import ChannelTitle from './ChannelTitle';
import ChannelDescription from './ChannelDescription';
import ChannelGraphics from './ChannelGraphics';
import SocialConnects from '../userProfile/SocialConnects';
import FacebookLogin from 'react-facebook-login';

class MyChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="userprofile-main">
        <ChannelHeader />
        <ChannelTitle />
        <ChannelDescription />
        <ChannelGraphics />
        {/* social network connection starts */}
        <SocialConnects />
        {/* social network connection ends */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const MyChannel = { state };
  return { MyChannel };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyChannel);
