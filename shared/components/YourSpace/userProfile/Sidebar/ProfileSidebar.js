import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { getAllDrafts } from '../../../../actions/YourSpace_actions/article_actions';
import { Redirect } from 'react-router-dom';
import variables from '../../../../../variables';
import ContentTypeModal from '../../ContentTypeModal';

const apiURL = variables.url.liveURL;

class ProfileSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentType: false,
    };
  }

  closeModal(e) {
    this.setState({
      contentType: false,
    });
  }

  openContentType() {
    this.setState({
      contentType: true,
    });
  }

  changeColor(space, e) {
    const rest_elem = document.getElementsByClassName('userprofile-data');
    for (let i = 0; i < rest_elem.length; i++) {
      rest_elem[i].classList.remove('active');
    }
    e.target.classList.add('active');
    if (space == 'create') {
      this.openContentType();
    }
  }

  render() {
    return (
      <div>
        <div className="userprofile-heading">Your Space </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'bookmarks')}>
          <img src="../assets/images/user-profile/bookmarks.png" />
          <p>Bookmarks</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'statistics')}>
          <img src="../assets/images/user-profile/statistics.png" />
          <p>Statistics</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'feeds')}>
          <img src="../assets/images/user-profile/feeds.png" />
          <p>Feeds</p>
        </div>
        <NavLink to="/yourspace/channel" onClick={this.changeColor.bind(this, 'your')}>
          <div className="userprofile-data">
            <img src="../assets/images/user-profile/channels.png" />
            <p>Your Channels</p>
          </div>
        </NavLink>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'responses')}>
          <img src="../assets/images/user-profile/responses.png" />
          <p>Responses</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'create')}>
          <img src="../assets/images/user-profile/create.png" />
          <p>Create</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'highlights')}>
          <img src="../assets/images/user-profile/highlights.png" />
          <p>Highlights</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'collaboration')}>
          <img src="../assets/images/user-profile/collaboration.png" />
          <p>Collaboration</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'notes')}>
          <img src="../assets/images/user-profile/notes.png" />
          <p>Notes</p>
        </div>
        <div className="userprofile-data" onClick={this.changeColor.bind(this, 'settigs')}>
          <img src="../assets/images/user-profile/settings.png" />
          <p>Settings</p>
        </div>
        {this.state.contentType
          ? <ContentTypeModal
            contentType={this.state.contentType}
            closeModal={this.closeModal.bind(this)}
          />
          : ''}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ProfileSidebar = state;
  return { ProfileSidebar };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getAllDrafts: (space) => {
      dispatch(getAllDrafts(space));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSidebar);
