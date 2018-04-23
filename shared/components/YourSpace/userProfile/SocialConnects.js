import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import variables from '../../../../variables';
import FacebookProvider, { Login } from 'react-facebook';
import { NavLink } from 'react-router-dom';
import { getData, saveUserData } from '../../../actions/userProfile_action';
import Cookies from 'universal-cookie';

const apiURL = variables.url.liveURL;

class SocialConnects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fbLink: '',
    };
  }

  componentWillMount() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    // to get user profile data when profile displayed
    this.props.getData(token_val);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      if (nextProps.SocialConnects.fetchUserProfile.response.profile.facebook) {
        this.setState({
          fbLink: nextProps.SocialConnects.fetchUserProfile.response.profile.facebook,
        });
      }
    }
  }

  handleResponse(data) {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    this.setState({
      fbLink: data.profile.link,
    });
    this.props.saveSocialLinks(token_val, data.profile.link, 'facebook');
  }
  handleError(err) {}

  render() {
    return (
      <div className="outer-section">
        <div className="title-section">
          <span>Social Network Connections</span>
        </div>
        <div className="data-section">
          <div className="social-network-connections">
            <div className="fb-connection">
              <span className="user-social-icons text-muted">
                <i className="fa fa-facebook" aria-hidden="true" />
              </span>
              <a
                href={this.state.fbLink ? this.state.fbLink : '#'}
                data-toggle="tooltip"
                data-placement="top"
                title="Profile Link"
              >
                <p className="socialnet-name">
                  Facebook{this.state.fbLink ? <span>/risorso</span> : ''}
                </p>
              </a>
              <FacebookProvider appId="187850568633836">
                <Login
                  scope="email"
                  onResponse={this.handleResponse.bind(this)}
                  onError={this.handleError.bind(this)}
                >
                  <button className="submit_button pull-right">
                    {this.state.fbLink ? 'Disconnect' : 'Connect'}
                  </button>
                </Login>
              </FacebookProvider>
            </div>
            <div className="fb-connection">
              <span className="user-social-icons text-muted">
                <i className="fa fa-twitter" aria-hidden="true" />
              </span>
              <p className="socialnet-name">
                Twitter/<span>risorso</span>
              </p>
              <button className="submit_button pull-right">Connect</button>
            </div>
            <div className="fb-connection">
              <span className="user-social-icons text-muted">
                <i className="fa fa-google-plus" aria-hidden="true" />
              </span>
              <p className="socialnet-name">
                Google Plus/<span>risorso</span>
              </p>
              <button className="submit_button pull-right">Connect</button>
            </div>
            <div className="fb-connection">
              <span className="user-social-icons text-muted">
                <i className="fa fa-linkedin" aria-hidden="true" />
              </span>
              <p className="socialnet-name">
                LinkedIn/<span>risorso</span>
              </p>
              <button className="submit_button pull-right">Connect</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const SocialConnects = state;
  return { SocialConnects };
}

function mapDispatchToProps(dispatch, props) {
  return {
    saveSocialLinks: (token_val, content, key) => {
      dispatch(saveUserData(token_val, content, key));
    },
    getData: (token_val) => {
      dispatch(getData(token_val));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialConnects);
