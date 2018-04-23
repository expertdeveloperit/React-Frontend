/*
	Parent Login is the parent component for login and and sign up
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Login from './Login';
import SignUp from './SignUp';
import Cookies from 'universal-cookie';

class Parentlogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: '',
      location: '',
    };
  }

  componentDidMount() {
    const location = this.props.location.pathname;
    this.setState({
      location,
    });
    if (location != '/login' && location != `/verify/${this.props.match.params.id}`) {
      const cookies = new Cookies();
      const token = cookies.get('risorsoLoggedIn');
      if (token == null) {
        alert('Please Login or Signup first');
      }
    }
  }

  render() {
    return (
      <div className="parentlogin">
        <div className="row no_margin">
          <div className="col-sm-12">
            <div className="col-sm-6 login_col no_padding">
              <Login auth_params={this.props.match.params.id} location={this.state.location} />
            </div>
            <div className="col-sm-6 no_padding">
              <SignUp location={this.state.location} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const check = state;
  return { check };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Parentlogin);
