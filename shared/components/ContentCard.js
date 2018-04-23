/*
  Component of Articles or contentcards.
  It imports Time Ago plug-in for changing the time zone format into hours and minutes ago.
  getContentCard is the redux-action to fetch the data of contentcards from backend.
*/
/*
  componentDidMount is used to call the redux-action before rendering and fetch all the data,
  it consists of "this.props.getContentCard(this.props.likesort, this.props.trendingsort);" ,
  which is used to call the getContentCard() from action and "(this.props.likesort,
  this.props.trendingsort)",are used as arguments to pass in redux action on which the sorting,
  for likes and trending will be done.

*/
/*
  "componentWillReceiveProps(nextProps)" Is used to call when the value of props will change,
  especially for props likesort and trendingsort, if there value will cahange it again goes to,
  redux action and hit the server URL.
*/
/*
  For layout change that is 3column view or 4 column view we are using props that is layout3 and,
  layout4. Its values are changing from header then passed to App.js and then in contentcard for ,
  toggling the classes of the content card.
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import TimeAgo from 'react-timeago';
import PageNotFound from './Static/PageNotFound';
import { getContentCard } from '../actions/contentcard_action';
import variables from '../../variables';
import configureStore from '../redux/configureStore';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class ContentCard extends Component {
  constructor(props) {
    super(props);
    this.test = this.handleScroll.bind(this);
    this.state = {
      contentArray: [],
      pageno: 1,
      status: false,
      max_page: '',
      loader: false,
      dataLeft: false,
    };
  }

  // componentWillMount() {

  // }
  componentDidMount() {
    this.props.getContentCard(this.props.likesort, this.props.trendingsort, this.state.pageno);
    window.addEventListener('scroll', this.test);
  }

  componentDidUpdate(nextProps) {
    this.truncate();
  }

  // getting all data on page as component loads
  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      const oldArray = this.state.contentArray;
      if (nextProps.ContentCard.ContentCard.result) {
        if (nextProps.ContentCard.ContentCard.result.status) {
          if (nextProps.ContentCard.ContentCard.result.content.length > 0) {
            this.setState({
              contentArray: nextProps.ContentCard.ContentCard.result.content,
              max_page: nextProps.ContentCard.ContentCard.result.max_page,
            });
            if (
              this.props.likesort != nextProps.likesort ||
              this.props.trendingsort != nextProps.trendingsort
            ) {
              nextProps.getContentCard(
                nextProps.likesort,
                nextProps.trendingsort,
                this.state.pageno,
              );
              this.setState({
                status: false,
                contentArray: nextProps.contentdata.viewContentCard.result,
              });
            }
            if (this.state.status) {
              if (oldArray != nextProps.ContentCard.ContentCard.result.content) {
                console.log('check');
                this.setState({
                  contentArray: this.state.contentArray.concat(
                    nextProps.ContentCard.ContentCard.result.content,
                  ),
                  loader: false,
                });
                const d = document.documentElement;
                var scrollHeight = Math.ceil(window.innerHeight / 3) 
                d.scrollTo(0, scrollHeight);
              }
            }
          }
        } else {
          this.setState({
            contentArray: oldArray,
          });
        }
      }
    }
  }

  // for lazy loading--in progress
  handleScroll() {
    const d = document.documentElement;
    const offset = Math.ceil(d.scrollTop + window.innerHeight);
    const height = d.offsetHeight;
    if (offset == height) {
      const pageno = ++this.state.pageno;
      if (pageno <= this.state.max_page) {
        console.log('true');
        this.setState({
          pageno,
          status: true,
          loader: true,
          dataLeft: false,
        });
        this.props.getContentCard(this.props.likesort, this.props.trendingsort, this.state.pageno);
      } else {
        this.setState({
          status: false,
          loader: false,
          dataLeft: true,
        });
        // toast.warn('All Data Fetched', {
        //   position: toast.POSITION.TOP_CENTER,
        // });
        return false;
      }
    } else {
      this.setState({
        loader: false,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.test);
  }

  truncate() {
    setTimeout(() => {
      const elem = document.getElementsByTagName('time');
      for (let i = 0; i < elem.length; i++) {
        let inner = elem[i].innerHTML;
        inner = inner.replace('ago', '');
        elem[i].innerHTML = inner;
      }
    }, 100);
  }

  render() {
    const apiUrl = variables.url.localURL;
    if (this.state.contentArray) {
      if (this.state.contentArray.length > 0) {
        const my = this;
        var contentMapping = this.state.contentArray.map((data, i) => {
          if (data != undefined) {
            return (
              <div
                key={i}
                className={
                  my.props.layout3 == true && my.props.layout4 == false
                    ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4 no_padding padding_left box-3'
                    : my.props.layout4 == true && my.props.layout3 == false
                      ? 'col-xs-3 col-sm-3 col-md-3 col-lg-3 no_padding padding_left box-4 '
                      : 'col-xs-4 col-sm-4 col-md-4 col-lg-4 no_padding padding_left box-3'
                }
              >
                <div className="panel content-card main-content-card">
                  <div className="featuringImage">
                    <img
                      className="img-responsive card-image"
                      src={data.featuring_data[0].imgurl}
                      alt="content card img"
                    />
                  </div>
                  <div className="panel-body">
                    <div
                      className={
                        my.props.layout3 == true && my.props.layout4 == false
                          ? 'content-card-section1'
                          : my.props.layout4 == true && my.props.layout3 == false
                            ? 'content-card4-section1'
                            : 'content-card-section1'
                      }
                    >
                      <div className="content-card-title">
                        <p>
                          {data.published_channel.channel_title},{' '}
                          <span className="text-muted timeAgo">
                            <TimeAgo date={data.published_time} />
                          </span>
                        </p>
                      </div>
                      <div className="content-card-info">
                        <NavLink to={`/preview/${data._id}`}>
                          <h3>
                            {data.main_title}
                          </h3>
                        </NavLink>
                        <p className="text-muted">
                          {data.content_description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={
                        my.props.layout3 == true && my.props.layout4 == false
                          ? 'content-card-section2'
                          : my.props.layout4 == true && my.props.layout3 == false
                            ? 'content-card4-section2'
                            : 'content-card-section2'
                      }
                    >
                      <ul>
                        <li>
                          <img
                            src={apiUrl + data.published_channel.channel_logo}
                            alt="logo"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Channel Logo"
                          />
                        </li>
                        <li>
                          <img src="assets/images/content-card/banner-icon-divider.png" />
                        </li>
                        <li>
                          <img
                            src={apiUrl + data.quick_category.category_icon}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Quick Category"
                          />
                        </li>
                        <li>
                          <img src="assets/images/content-card/banner-icon-divider.png" />
                        </li>
                        <li>
                          <img
                            src={apiUrl + data.content_type_icon}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Content Type"
                          />
                        </li>
                      </ul>
                    </div>
                    <div
                      className={
                        my.props.layout3 == true && my.props.layout4 == false
                          ? 'content-card-footer'
                          : my.props.layout4 == true && my.props.layout3 == false
                            ? 'content-card4-footer'
                            : 'content-card-footer'
                      }
                    >
                      <ul>
                        <li>
                          <img src="assets/images/azd.png" />
                          <span className="text-muted">
                            {data.trend_graph}
                          </span>
                        </li>
                        <li>
                          <i
                            className="ico-icon44 footer-icons text-muted"
                            aria-hidden="true"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Comments"
                          />
                          <span className="text-muted">
                            {data.comments.length}
                          </span>
                        </li>
                        <li>
                          <i
                            className="ico-icon43 footer-icons text-muted"
                            aria-hidden="true"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Likes"
                          />
                          <span className="text-muted">
                            {data.likes}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        });
      }
      return (
        <div>
          {contentMapping}
          {this.state.loader
            ? <div className="loader_in_drafts" />
            : this.state.dataLeft
              ? <div className="noMoreData text-muted">No More Data</div>
              : <div className="noMoreData text-muted" />}
        </div>
      );
    }
    return (
      <div>
        <PageNotFound />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ContentCard = state;
  return { ContentCard };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getContentCard: (like, trending, pageno) => {
      dispatch(getContentCard(like, trending, pageno));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentCard);
