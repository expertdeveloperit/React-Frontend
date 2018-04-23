import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { NavLink } from 'react-router-dom';
import Login from './Login';
import Cookies from 'universal-cookie';
import { getData } from '../actions/userProfile_action';
import { Redirect } from 'react-router-dom';
import { getAllDrafts } from '../actions/YourSpace_actions/article_actions';
import TimeAgo from 'react-timeago';
import variables from '../../variables';
import { ToastContainer, toast } from 'react-toastify';
import ContentTypeModal from './YourSpace/ContentTypeModal';

const apiURL = variables.url.liveURL;

class Spacetab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      route: '',
      cookie: '',
      contentType: false,
      move_to_login: false,
      profilePic: '../assets/images/unknown.png',
      profileName: '',
      email: '',
    };
  }
  componentWillMount() {
    const cookies = new Cookies();
    const space = cookies.get('risorsoLoggedIn');
    if (space) {
      this.setState({
        login: true,
        cookie: space,
      });
      this.props.getUserData(space);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      if (nextProps.spaceTabData.fetchUserProfile.response) {
        if (nextProps.spaceTabData.fetchUserProfile.response.status) {
          let profilePic = nextProps.spaceTabData.fetchUserProfile.response.profile.profile_picture,
            profileName = `${nextProps.spaceTabData.fetchUserProfile.response.profile
              .name} ${nextProps.spaceTabData.fetchUserProfile.response.profile.surname}`,
            email = nextProps.spaceTabData.fetchUserProfile.response.profile.email;
          if (profilePic) {
            this.setState({
              profilePic: `${apiURL}/${profilePic}`,
              profileName,
              email,
            });
          }
        }
      }
    }
  }

  handleLog(e) {
    const cookies = new Cookies();
    const space = cookies.get('risorsoLoggedIn');
    if (space) {
      if (confirm('Unsaved Drafts/Articles will be lost. Are you sure you want to Logout?')) {
        cookies.remove('risorsoLoggedIn');
        localStorage.clear();
        toast.error('Logged out from risorso!', { position: toast.POSITION.BOTTOM_CENTER });
        this.setState({ login: !this.state.login });
        window.location.reload(); /* to refresh cookies!!! pending yet */
      } else {
        // do nothing
      }
    } else {
      this.setState({ login: !this.state.login });
    }
  }

  handleAuth() {
    fetch('http://192.168.20.127:4000/api/connect/facebook', {
      method: 'get',
    }).then((res) => {
      if (res) {
        window.open(res.url);

        // return dispatch(handleAboutUs(res));
      }
      // return dispatch(handleFormError(res));
    });
    // .catch(err => dispatch(handleFormError(err)));
  }

  loginButton() {
    return (
      <div
        className="col-sm-3 col-lg-3 col-md-3 space_log space_tabs"
        data-toggle="tooltip"
        data-placement="top"
        title="Login"
      >
        <NavLink to="/login">
          <img
            src="../assets/images/sidebar_icons/log-out.png"
            className="space_image"
            alt="login-img"
            onClick={this.handleLog.bind(this)}
          />
        </NavLink>
      </div>
    );
  }

  logoutButton() {
    return (
      <div
        className="col-sm-3 col-lg-3 col-md-3 space_log space_tabs"
        data-toggle="tooltip"
        data-placement="top"
        title="Logout"
      >
        <img
          src="../assets/images/sidebar_icons/log-out.png"
          className="space_image"
          alt="logout-img"
          onClick={this.handleLog.bind(this)}
        />
      </div>
    );
  }

  openContentType() {
    if (this.state.cookie != '') {
      this.setState({ contentType: !this.state.contentType });
    } else {
      this.setState({ move_to_login: true });
    }
  }

  closeModal() {
    this.setState({ contentType: false });
    this.setState({ showDraftList: false });
  }

  render() {
    // for login/out
    let mybutton;
    if (this.state.login == false) {
      mybutton = this.loginButton();
    } else {
      mybutton = this.logoutButton();
    }

    if (this.state.move_to_login) {
      return <Redirect to="/createarticle" />;
    }
    return (
      <div className="sidebar3">
        <div className="row no_margin">
          <div className="col-sm-12 no_padding">
            <div className="row no_margin space">
              <div className="col-sm-3 col-lg-3 col-md-3 space_pic">
                <div
                  className="space_profile space_tabs"
                  data-toggle="tooltip"
                  data-placement="top"
                  title={
                    this.state.profileName
                      ? this.state.profileName
                      : this.state.space ? this.state.email : 'Profile Image'
                  }
                >
                  <NavLink to="/yourspace">
                    <img
                      src={
                        this.state.profilePic
                          ? this.state.profilePic
                          : '../assets/images/unknown.png'
                      }
                      className="space_image"
                    />
                  </NavLink>
                </div>
              </div>
              <div
                className="col-sm-3 col-lg-3 col-md-3 space_messages space_tabs"
                data-toggle="tooltip"
                data-placement="top"
                title={this.props.from == 'article' ? 'Upload' : 'Message'}
              >
                <img
                  src={
                    this.props.from == 'article'
                      ? '../assets/images/sidebar_icons/upload.png'
                      : '../assets/images/sidebar_icons/message-icon.png'
                  }
                  className="space_image"
                />
              </div>
              <div
                className="col-sm-3 col-lg-3 col-md-3 space_edit space_tabs"
                data-toggle="tooltip"
                data-placement="top"
                title={this.props.from == 'article' ? 'Settings' : 'Create'}
              >
                <img
                  src={
                    this.props.from == 'article'
                      ? '../assets/images/sidebar_icons/settings.png'
                      : '../assets/images/sidebar_icons/edit-icon.png'
                  }
                  className="space_image"
                  onClick={this.props.from == 'article' ? '' : this.openContentType.bind(this)}
                />
              </div>
              {mybutton}
            </div>
            {this.state.contentType
              ? <ContentTypeModal
                contentType={this.state.contentType}
                closeModal={this.closeModal.bind(this)}
              />
              : ''}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const spaceTabData = state;
  return { spaceTabData };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getAllDrafts: (space) => {
      dispatch(getAllDrafts(space));
    },
    getUserData: (space) => {
      dispatch(getData(space));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spacetab);
