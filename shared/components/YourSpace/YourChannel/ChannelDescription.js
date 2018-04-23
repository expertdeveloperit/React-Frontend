import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';

class ChannelDescription extends Component {
  constructor() {
    super();
    this.state = {
      showEditChannelDescription: false,
      ChannelDescription: '',
      localData: '',
    };
  }

  componentDidMount() {
    const fetchData = JSON.parse(localStorage.getItem('channel_description'));
    if (fetchData !== '') {
      this.setState({
        localData: fetchData,
        ChannelDescription: fetchData,
      });
    }
  }

  // handler to open edit maintitle form
  handleOpenChannelDescription() {
    this.setState({ showEditChannelDescription: !this.state.showEditChannelDescription });
  }

  // handler to handle input to update state value
  handleChannelDescription(e) {
    this.setState({ ChannelDescription: e.target.value });
  }

  // handler to cancel edit main title
  handleCancel() {
    this.setState({
      showEditChannelDescription: !this.state.showEditChannelDescription,
      ChannelDescription: this.state.localData,
    });
  }

  grapCookieValue() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    return token_val;
  }

  // handler to submit edit form
  submitChannelForm(e) {
    e.preventDefault();
    const ChannelDescription = this.state.ChannelDescription;
    if (ChannelDescription == '') {
      alert('Channel must have a Description !!');
      return false;
    }
    this.setState({
      ChannelDescription,
      localData: ChannelDescription,
      showEditChannelDescription: !this.state.showEditChannelDescription,
    });
    const token_val = this.grapCookieValue();
    // calling action here
    localStorage.setItem('channel_description', JSON.stringify(ChannelDescription));
  }

  // display html acc to state value
  openChannelForm() {
    if (this.state.showEditChannelDescription) {
      return (
        <form onSubmit={this.submitChannelForm.bind(this)}>
          <div className="form-group">
            <textarea
              autoFocus
              type="text"
              value={this.state.ChannelDescription ? this.state.ChannelDescription : ''}
              onChange={this.handleChannelDescription.bind(this)}
              type="text"
              className="form-control mainInp"
              name="ContentDescription"
              placeholder="Channel Description"
              maxLength="230"
            />
          </div>
          <div className="text-right">
            <button className="btn cancelBtn" onClick={this.handleCancel.bind(this)}>
              Cancel
            </button>
            <input
              type="submit"
              name="Channel_submit"
              value="Save"
              className="submit_button append-margin"
              onClick={this.submitChannelForm.bind(this)}
            />
          </div>
        </form>
      );
    }
    return (
      <p>
        {this.state.ChannelDescription}
      </p>
    );
  }
  render() {
    const openChannelForm = this.openChannelForm();
    return (
      <div className="parentSection">
        <div className="childSection1 sub-header">
          <h6>
            Channel Description <span> * </span>
          </h6>
          <ul className="text-muted pull-right">
            <li>
              <img
                src="../assets/images/user-profile/article-icon-1.png"
                onClick={this.handleOpenChannelDescription.bind(this)}
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              />
            </li>
          </ul>
        </div>
        <div className="childsection2">
          {openChannelForm}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const ChannelDescription = state;
  return { ChannelDescription };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(ChannelDescription);
