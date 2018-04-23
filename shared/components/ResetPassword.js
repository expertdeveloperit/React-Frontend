/*
	Parent Login is the parent component for login and and sign up
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { resetPassword } from '../actions/login_action';
import { Redirect } from 'react-router-dom';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      confirm_error: '',
      new_password: '',
      disable: true,
      button: true,
      confirm_password: '',
      redirect: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rp.fetchLogin.response.status == true) {
      this.setState({ redirect: true });
    }
  }

  handleNewPassword(e) {
    this.setState({ new_password: e.target.value });
    // var password= e.target.value
    const reg = /^[0-9]+$/;
    if (e.target.value == '') {
      this.setState({ error: '' });
      this.setState({ disable: true });
    } else if (!reg.test(e.target.value)) {
      this.setState({ error: 'password must be numeric only' });
      this.setState({ disable: true });
    } else if (!(e.target.value.length == 4)) {
      this.setState({ error: 'password must be of 4 digits' });
      this.setState({ disable: true });
    } else {
      this.setState({ error: '' });
      this.setState({ disable: false });
    }
  }

  confirm_password(e) {
    this.setState({ confirm_password: e.target.value });
    if (e.target.value == '') {
      this.setState({ confirm_error: '' });
    } else if (e.target.value != this.state.new_password) {
      this.setState({ confirm_error: 'password do not match!' });
    } else {
      this.setState({ confirm_error: '' });
      this.setState({ button: false });
    }
  }

  sendMyPassword(e) {
    e.preventDefault();
    const params = this.props.match.params.id;
    const newPassword = this.state.new_password;
    const verifyPassword = this.state.confirm_password;
    this.props.resetPassword(newPassword, verifyPassword, params);
    // return <Redirect to="/login" />
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <div className="col-sm-6 new_password">
          <h4>Reset Password</h4>
          <div>
            <span className="text-muted">
              (password must be of 4 digits only. No alphabets or special characters allowed)
            </span>
          </div>
          <form>
            <div className="form-group no-drag drag-event">
              <input
                type="password"
                autoFocus
                className="form-control mainInp no-drag drag-event"
                name="new_password"
                placeholder="New Password"
                value={this.state.new_password}
                maxLength="4"
                onChange={this.handleNewPassword.bind(this)}
              />
              <span className="errorMessage">
                {this.state.error}
              </span>
            </div>
            <div className="form-group confirm_password no-drag drag-event">
              <input
                type="password"
                onChange={this.confirm_password.bind(this)}
                value={this.state.confirm_password}
                className="form-control mainInp no-drag drag-event"
                name="forget_password"
                placeholder="Confirm Password"
                maxLength="4"
                disabled={this.state.disable}
              />
              <span className="errorMessage">
                {this.state.confirm_error}
              </span>
            </div>
            <div className="pull-right forget_password_Btns">
              <input
                type="submit"
                name="email_submit"
                value="Send"
                className="submit_button contentBtnForHover append-margin"
                onClick={this.sendMyPassword.bind(this)}
                disabled={this.state.button}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const rp = state;
  return { rp };
}

function mapDispatchToProps(dispatch, props) {
  return {
    resetPassword: (newPassword, verifyPassword, params) => {
      dispatch(resetPassword(newPassword, verifyPassword, params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
