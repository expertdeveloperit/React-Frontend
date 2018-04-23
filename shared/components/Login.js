import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { fetchLogin, fetchForgetPassword } from '../actions/login_action';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// import Profile from './Profile'
// import App from './App';

// import { instanceOf } from 'prop-types';
// import { withCookies, Cookies } from 'react-cookie';
import Cookies from 'universal-cookie';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showForgetPassword: false,
      message: '',
      email_msg: '',
      password_msg: '',
      token: '',
      res_received: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.logindata.fetchLogin.response) {
      const cookies = new Cookies();
      if (nextProps.logindata.fetchLogin.response.token) {
        const token = nextProps.logindata.fetchLogin.response.token;
        this.setState({
          token,
        });
        cookies.set('risorsoLoggedIn', token, { path: '/' });
        localStorage.setItem('risorsoLoggedIn', JSON.stringify(token));
      }
      if (nextProps.logindata.fetchLogin.response.message) {
        this.setState({
          res_received: nextProps.logindata.fetchLogin.response.message,
        });
        res_received = (
          <span className="response">
            {nextProps.logindata.fetchLogin.response.message}
          </span>
        );
      }
      console.log('nextProps+++++++++', nextProps);
      if (nextProps.logindata.fetchLogin.response.message) {
        if (nextProps.logindata.fetchLogin.response.message == 'No user Found') {
          toast.error('No registered email found!', { position: toast.POSITION.TOP_CENTER });
        }
      }
    }
  }

  canBeSubmited() {
    const { email, password } = this.state;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email == ' ' && password == ' ') {
      return false;
    }
    if (reg.test(email) && password.length == 4) {
      return true;
    }
    const isEnabled = false;
    return isEnabled;
  }

  // handler for email
  handleEmailInput(e) {
    this.setState({ email: e.target.value });
    const email = e.target.value;
    // for email error message
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email)) {
      this.setState({ email_msg: ' ' });
      this.setState({ email });
    } else {
      this.setState({ email_msg: 'Enter valid email e.g. example@example.com' });
    }
  }

  handlePasswordInput(e) {
    this.setState({ password: e.target.value });
    const pswd = e.target.value;

    // for password error message
    const numbers = /^[0-9]+$/;

    // let pswd= this.state.password
    if (!(pswd.length == 4)) {
      this.setState({ password_msg: 'Incorrect password' });
    } else if (!numbers.test(this.state.password)) {
      this.setState({ password_msg: 'Incorrect password' });
    } else {
      this.setState({ password_msg: ' ' });
      this.setState({ password: pswd });
    }
  }

  login(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    const params = this.props.auth_params;
    this.props.fetchLogin(email, password, params);

    // to reset  input fields
    this.setState({ email: '', password: '' });
  }

  forgetPassword() {
    this.setState({ showForgetPassword: !this.state.showForgetPassword });
  }

  sendMyEmail(e) {
    e.preventDefault();
    const forgetPassword_email = this.forget_password.value;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (forgetPassword_email == '') {
      toast.error("Field can't be empty", { position: toast.POSITION.BOTTOM_CENTER });

      // alert("Enter email address")
      return false;
    } else if (!reg.test(forgetPassword_email)) {
      toast.error('Enter valid email e.g. example@example.com', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return false;
    }
    this.props.fetchForgetPassword(forgetPassword_email);
    this.setState({ showForgetPassword: !this.state.showForgetPassword });
  }

  forget_password_modal() {
    if (this.state.showForgetPassword) {
      return (
        <div className="modal modalParent">
          <div className="modal-dialog modal-lg">
            <div className="modal-container">
              <div className="modal-header fp_close_btn">
                <button type="button" className="close" onClick={this.forgetPassword.bind(this)}>
                  Close
                </button>
                <h4 className="modal-title">Please enter your registerd email address</h4>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group no-drag drag-event">
                    <input
                      type="email"
                      id={this.props.ID}
                      autoFocus
                      className="form-control mainInp no-drag drag-event"
                      name="forget_password"
                      placeholder="Email Address"
                      ref={(input) => {
                        this.forget_password = input;
                      }}
                    />
                  </div>
                  <div className="pull-right forget_password_Btns">
                    <button
                      type="button"
                      className="cancelBtn contentBtnForHover"
                      onClick={this.forgetPassword.bind(this)}
                    >
                      Cancel
                    </button>
                    <input
                      type="submit"
                      name="email_submit"
                      value="Send"
                      className="submit_button contentBtnForHover append-margin"
                      onClick={this.sendMyEmail.bind(this)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const isEnabled = this.canBeSubmited();
    let res_received;
    const token = this.state.token;
    if (this.state.res_received) {
      res_received = (
        <span className="response">
          {this.state.res_received}
        </span>
      );
    }
    if (token) {
      console.log('this.props', this.props);
      const string = '54568sfdg65454fgd45d5fg';
      const url = `${this.props.location}?${string}`;
      let params = '';
      if (this.props.match) {
        params = this.props.match.params.id;
      }
      if (
        this.props.location == '/createarticle' ||
        this.props.location == '/login' ||
        this.props.location == `/verify/${params}`
      ) {
        return <Redirect to="/" />;
      }
      return <Redirect to={url} />;
    }

    const forget_password_modal = this.forget_password_modal();

    return (
      <div className="login_section">
        <div className="login_img">
          <span className="login_text">Log In</span>
          <img src="../assets/images/login/login.png" alt="login_img" />
        </div>
        <div className="login_input">
          <form onSubmit={this.login.bind(this)}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="user_inputs_login form-control password_note"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleEmailInput.bind(this)}
              />
              <span className="errorMessage">
                {this.state.email_msg}
              </span>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                className="user_inputs_login form-control password_note"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handlePasswordInput.bind(this)}
                maxLength="4"
              />
              <span className="errorMessage">
                {}
              </span>
            </div>
            <div className="form-group">
              <span className="forgot">
                <a onClick={this.forgetPassword.bind(this)}>Forgot password?</a>
              </span>
            </div>
            <div className="form-group text-right submit_button_parent">
              <input
                type="submit"
                name="Login_submit"
                value="Log In"
                className={isEnabled == true ? 'submit_button login_submit' : 'IMDisabled'}
                disabled={!isEnabled}
              />
            </div>
          </form>
          {res_received}
        </div>
        {forget_password_modal}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const logindata = state;
  return { logindata };
}

function mapDispatchToProps(dispatch, props) {
  return {
    fetchLogin: (email, password, params) => {
      dispatch(fetchLogin(email, password, params));
    },
    fetchForgetPassword: (email) => {
      dispatch(fetchForgetPassword(email));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
