import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import Dropdown from 'react-dropdown';
import { fetchChannelData } from '../../../actions/YourSpace_actions/channel_action';

class Channel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const token = this.grapCookieValue();
    this.props.fetchChannel(token);
  }

  grapCookieValue() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    return token_val;
  }

  detectChange(value) {
    if (this.props.channel.fetchChannelData.result) {
      if (this.props.channel.fetchChannelData.result.length > 0) {
        const selectedData = this.props.channel.fetchChannelData.result.filter(
          data => value.value == data.channel_title,
        );
        localStorage.setItem('channel_data', JSON.stringify(selectedData));
      }
    }
  }

  render() {
    let array = [
      {
        value: 'No Channel Found Create New Channel?',
        label: 'No Channel Found Create New Channel?',
      },
    ];
    if (this.props.channel.fetchChannelData.result) {
      if (this.props.channel.fetchChannelData.result.length > 0) {
        const my = this;
        const map = this.props.channel.fetchChannelData.result.map((data) => {
          let channelTitle = data.channel_title,
            channelId = data._id;
          const newarray = {
            value: channelTitle,
            label: channelTitle,
          };
          array = array.concat(newarray);
        });
      }
    }
    return (
      <div className="parentSection">
        <div className="childSection1 sub-header">
          <h6>
            Select Channel <span> * </span>
          </h6>
        </div>
        <div className="childsection2">
          <Dropdown
            className="channel dropdown"
            options={array}
            placeholder="Channel Select"
            onChange={this.detectChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const channel = state;
  return { channel };
}

function mapDispatchToProps(dispatch, props) {
  return {
    fetchChannel: (token) => {
      dispatch(fetchChannelData(token));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Channel);
