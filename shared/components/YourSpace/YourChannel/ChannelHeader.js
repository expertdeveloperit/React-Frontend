import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';

class ChannelHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  grabCookies() {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');

    return token;
  }

  fetch(channelData, token) {
    fetch('http://18.195.238.14:3000/api/newchannel', {
      method: 'post',
      headers: {
        Accept: 'application/json,text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(channelData),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
        } else {
        }
      })
      .catch((err) => {});
  }

  createChannel(e) {
    let channel_title = JSON.parse(localStorage.getItem('channel_title')),
      channel_description = JSON.parse(localStorage.getItem('channel_description')),
      channel_cover_crop_image = JSON.parse(localStorage.getItem('channel_cover_crop_image')),
      channelData = {
        channel_title,
        channel_description,
        channel_cover_crop_image,
      },
      token = this.grabCookies();

    this.fetch(channelData, token);
  }

  render() {
    return (
      <div className="profile_top_bar">
        <ul className="top_list">
          <li>
            <span className="img_parent img_Bank" />My Channels
          </li>
          <li>
            <span className="img_parent img_Credit" />New Channel
          </li>
          <li>
            <span className="img_parent img_Account" />Channel Statistics
          </li>
          <li onClick={this.createChannel.bind(this)}>
            <span className="img_parent img_Account" />Channel Save
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ChannelHeader = { state };
  return { ChannelHeader };
}

function mapDispatchToProps(dispatch, props) {
  return {
    createChannel: (data, token) => {
      dispatch(newChannel(data, token));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelHeader);
