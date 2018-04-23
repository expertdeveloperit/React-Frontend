import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Switch from 'react-router-dom/Switch';
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';
import Content from './Content';
import Header from './Header';
import ParentLogin from './ParentLogin';
import PreviewArticle from './YourSpace/PreviewArticle';
import config from '../../config';
// import UserProfile from './YourSpace/userProfile/UserProfile';
// import Article from './article/Article';
import YourSpace from './YourSpace/YourSpace';
import Article from './YourSpace/Article/Article';
import ResetPassword from './ResetPassword';
import ContentShowcase from './content/ContentShowcase';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'universal-cookie';

const divcss = {
  position: 'relative',
};
const loadercss = {
  margin: 'auto',
  display: 'block',
  marginTop: '13%',
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      showLayoutOf4: false,
      showLayoutOf3: true,
      likeSort: false,
      trendSort: true,
      spinner: true,
      token: '',
    };
  }
  componentDidMount() {
    console.log("props", this.props)
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    // const token = JSON.parse(localStorage.getItem('risorsoLoggedIn'));
    if (token) {
      this.setState({
        token,
      });
    }
    window.addEventListener('load', this.handleLoad.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    if (token) {
      this.setState({
        token,
      });
    }
  }

  handleLoad(e) {
    setTimeout(() => {
      this.setState({
        spinner: false,
      });
    }, 1000);
  }

  // layout selectors
  toggleLayout3() {
    this.setState({
      showLayoutOf3: true,
      showLayoutOf4: false,
    });
  }
  toggleLayout4() {
    this.setState({
      showLayoutOf3: false,
      showLayoutOf4: true,
    });
  }

  // content sorting options
  toggleLikeSort() {
    this.setState({
      likeSort: !this.state.likeSort,
    });
  }

  toggleTrendSort() {
    this.setState({ trendSort: !this.state.trendSort });
  }

  spinner() {
    return (
      <div className="loader-parent">
        <img src="../assets/images/loader.gif" alt="loader" className="loader-gif" />
      </div>
    );
  }

  setHeader() {}

  render() {
    const loader = this.spinner();
    return (
      <div id="row">
        <Helmet>
          <html lang="en" />
          <meta charSet="utf-8" />
          <meta name="application-name" content={config('htmlPage.defaultTitle')} />
          <meta name="description" content={config('htmlPage.description')} />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="Content-Security-Policy : script-src * data: https://ssl.gstatic.com 'unsafe-inline' 'unsafe-eval';" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="msapplication-TileColor" content="#2b2b2b" />
          <meta name="msapplication-TileImage" content="/favicons/mstile-144x144.png" />
          <meta name="theme-color" content="#2b2b2b" />
          <link href="../assets/css/bootstrap.min.css" rel="stylesheet" />
          <link href="../assets/css/main.css" rel="stylesheet" />
          <link href="../assets/css/fonts.css" rel="stylesheet" />
          <link href="../assets/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
          <script src="http://platform.instagram.com/en_US/embeds.js" />
          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" />

          <title>
            {config('htmlPage.defaultTitle')}{' '}
          </title>
        </Helmet>
        <Header
          layout3={this.toggleLayout3.bind(this)}
          layout4={this.toggleLayout4.bind(this)}
          likesort={this.toggleLikeSort.bind(this)}
          trendingsort={this.toggleTrendSort.bind(this)}
        />
        {this.state.spinner ? loader : ''}
        <div className="container content no_padding">
          <div className="col-xs-12 no_padding">
            <ToastContainer autoClose={2000} />
            <div className="row no_margin">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props =>
                    (<Content
                      component={Content}
                      layout3={this.state.showLayoutOf3}
                      layout4={this.state.showLayoutOf4}
                      likesort={this.state.likeSort}
                      trendingsort={this.state.trendSort}
                    />)}
                />
                <Route path="/login" component={ParentLogin} />
                <Route path="/reset_password/:id" component={ResetPassword} />
                <Route path="/verify/:id" component={ParentLogin} />
                <Route path="/createarticle" component={this.state.token ? Article : ParentLogin} />
                <Route
                  path="/previewarticle"
                  component={this.state.token ? PreviewArticle : ParentLogin}
                />
                <Route path="/preview/:id" component={ContentShowcase} />
                <Route path="/yourspace" component={this.state.token ? YourSpace : ParentLogin} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
