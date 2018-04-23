import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
// import variables from '../../../../variables';
// import { Redirect } from 'react-router-dom';

class ChannelTitle extends Component {
  constructor() {
    super();
    this.state = {
      showEditChannel: false,
      channel: '',
      localData: '',
    };
  }

  componentDidMount() {
    const fetchData = JSON.parse(localStorage.getItem('channel_title'));
    if (fetchData !== '') {
      this.setState({
        localData: fetchData,
        channel: fetchData,
      });
    }
  }

  // handler to open edit channel form
  handleOpenchannel() {
    this.setState({ showEditChannel: !this.state.showEditChannel });
  }

  // handler to handle input to update state value
  handlechannelInput(e) {
    this.setState({ channel: e.target.value });
  }

  // handler to cancel edit main title
  handleCancel() {
    this.setState({
      showEditChannel: !this.state.showEditChannel,
      channel: this.state.localData,
    });
  }

  grapCookieValue() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    return token_val;
  }

  // handler to submit edit form
  submitchannelForm(e) {
    e.preventDefault();
    const channel = this.state.channel;
    if (channel == '') {
      alert('Channel must have a Title!!');
      return false;
    }
    this.setState({
      channel,
      localData: channel,
      showEditChannel: !this.state.showEditChannel,
    });
    const token_val = this.grapCookieValue();
    // calling action here
    localStorage.setItem('channel_title', JSON.stringify(channel));
  }

  // display html acc to state value
  openchannelForm() {
    if (this.state.showEditChannel) {
      return (
        <form onSubmit={this.submitchannelForm.bind(this)}>
          <div className="form-group">
            <textarea
              autoFocus
              value={this.state.channel ? this.state.channel : ''}
              onChange={this.handlechannelInput.bind(this)}
              type="text"
              className="form-control mainInp"
              name="channel"
              placeholder="Channel Title..."
            />
          </div>
          <div className="text-right">
            <button className="btn cancelBtn" onClick={this.handleCancel.bind(this)}>
              Cancel
            </button>
            <input
              type="submit"
              name="AboutUs_submit"
              value="Save"
              className="submit_button append-margin"
              onClick={this.submitchannelForm.bind(this)}
            />
          </div>
        </form>
      );
    }
    return (
      <p>
        {this.state.localData}
      </p>
    );
  }
  render() {
    const openchannelForm = this.openchannelForm();
    return (
      <div className="parentSection">
        <div className="childSection1 sub-header">
          <h6>
            Channel Title <span> * </span>
          </h6>
          <ul className="text-muted pull-right">
            <li>
              <img
                src="../assets/images/user-profile/article-icon-1.png"
                onClick={this.handleOpenchannel.bind(this)}
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              />
            </li>
          </ul>
        </div>
        <div className="childsection2">
          {openchannelForm}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const ChannelTitle = state;
  return { ChannelTitle };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(ChannelTitle);
