import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { getAllDrafts } from '../../actions/YourSpace_actions/article_actions';
import Cookies from 'universal-cookie';
import { getData, saveUserData } from '../../actions/userProfile_action';
import { Redirect } from 'react-router-dom';
import variables from '../../../variables';
import TimeAgo from 'react-timeago';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const apiURL = variables.url.liveURL;

class ContentTypeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ontentType: false,
      move_to_login: false,
      move_to_createArticle: false,
      cookie: '',
      login: false,
      myDrafts: '',
      showDraftList: false,
      pageno: 1,
      status: false,
      max_page: '',
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
    }
  }

  componentDidMount() {
    if (this.props.contentType) {
      this.openContentType();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      if (nextProps.ContentTypeModal.fetchArticleData) {
        if (nextProps.ContentTypeModal.fetchArticleData.result.data) {
          if (this.state.status) {
            if (nextProps.ContentTypeModal.fetchArticleData.result.data != this.state.oldData) {
              this.setState({
                myDrafts: this.state.myDrafts.concat(
                  nextProps.ContentTypeModal.fetchArticleData.result.data,
                ),
                oldData: nextProps.ContentTypeModal.fetchArticleData.result.data,
              });
            }
          } else {
            this.setState({
              myDrafts: nextProps.ContentTypeModal.fetchArticleData.result.data,
              oldData: nextProps.ContentTypeModal.fetchArticleData.result.data,
              max_page: nextProps.ContentTypeModal.fetchArticleData.result.max_page,
              showDraftList: true,
            });
          }
        }
      }
    }
  }

  /*
    Function goToMixedArticle(e) is used to confirm
  */
  goToMixedArticle(e) {
    if (
      JSON.parse(localStorage.getItem('mainTitle')) != null ||
      JSON.parse(localStorage.getItem('article_data')) != null ||
      JSON.parse(localStorage.getItem('imageUrl0')) != null
    ) {
      if (
        confirm(
          'unsaved drafts/articles will be deleted. \n Are you sure want to create new if yes click ok \n otherwise click cancel',
        )
      ) {
        localStorage.clear();
        this.setState({ move_to_createArticle: true });
        // return true
      } else {
        this.setState({ move_to_createArticle: true });
        // return false
      }
    } else {
      this.setState({ move_to_createArticle: true });
    }
  }

  /*
    Function showDraftList(e) is used to get all drafts in the modal.
  */
  showDraftList(e) {
    const pageno = 1;
    this.setState({ contentType: !this.state.contentType });
    this.setState({ showDraftList: !this.state.showDraftList });
    this.props.getAllDrafts(this.state.cookie, 1);
  }

  /*
    Function editDraft(data) is used to edit drafts.
  */
  editDraft(data) {
    if (
      JSON.parse(localStorage.getItem('mainTitle')) != null ||
      JSON.parse(localStorage.getItem('imageUrl0')) != null ||
      JSON.parse(localStorage.getItem('article_data')) != null
    ) {
      if (
        confirm(
          'Are sure to continue with Draft? \n Unsaved article/draft will be deleted. \n If No Click Cancel \n Otherwise Click Ok to Continue',
        )
      ) {
        localStorage.clear();
        localStorage.setItem('mainTitle', JSON.stringify(data.main_title));
        localStorage.setItem('draft_id', JSON.stringify(data._id));
        if (data.article_data != null) {
          localStorage.setItem('article_data', JSON.stringify(data.article_data));
        }

        if (data.content_description != null) {
          localStorage.setItem('content_description', JSON.stringify(data.content_description));
        }

        const coverImg = [{ url: data.featuring_image }];
        if (data.featuring_image != null) {
          localStorage.setItem('coverImg', JSON.stringify(coverImg));
        }

        if (data.published_channel != null) {
          const channel_data = [data.published_channel];
          localStorage.setItem('channel_data', JSON.stringify(channel_data));
        }

        if (data.featuring_data != null) {
          localStorage.setItem('featuring_data', JSON.stringify(data.featuring_data));
        }

        if (data.featuring_image != null) {
          const featuring_image = [{ name: 'cover image', url: data.featuring_image }];
          localStorage.setItem('coverImg', JSON.stringify(featuring_image));
        }

        if (data.quick_category != null) {
          const category_data = [
            {
              _id: data.quick_category._id,
              category_icon: data.quick_category.category_icon,
              title: data.quick_category.title,
            },
          ];
          localStorage.setItem('category_data', JSON.stringify(category_data));
        }
        this.setState({ move_to_createArticle: true });
      } else {
        // dont want to continue with draft!
        return false;
      }
    } else {
      localStorage.clear();
      localStorage.setItem('mainTitle', JSON.stringify(data.main_title));
      localStorage.setItem('draft_id', JSON.stringify(data._id));
      if (data.article_data != null) {
        localStorage.setItem('article_data', JSON.stringify(data.article_data));
      }

      if (data.content_description != null) {
        localStorage.setItem('content_description', JSON.stringify(data.content_description));
      }

      const coverImg = [{ url: data.featuring_image }];
      if (data.featuring_image != null) {
        localStorage.setItem('coverImg', JSON.stringify(coverImg));
      }

      if (data.published_channel != null) {
        const channel_data = [data.published_channel];
        localStorage.setItem('channel_data', JSON.stringify(channel_data));
      }

      if (data.featuring_data != null) {
        localStorage.setItem('featuring_data', JSON.stringify(data.featuring_data));
      }

      if (data.featuring_image != null) {
        const featuring_image = [{ name: 'cover image', url: data.featuring_image }];
        localStorage.setItem('coverImg', JSON.stringify(featuring_image));
      }

      if (data.quick_category != null) {
        const category_data = [
          {
            _id: data.quick_category._id,
            category_icon: data.quick_category.category_icon,
            title: data.quick_category.title,
          },
        ];
        localStorage.setItem('category_data', JSON.stringify(category_data));
      }
      this.setState({ move_to_createArticle: true });
      return false;
    }
  }

  handleScrollDrafts() {
    const x = document.getElementById('draft_list');
    const offset = Math.ceil(x.scrollTop + x.offsetHeight);
    const height = x.scrollHeight;
    if (offset == height) {
      const pageno = ++this.state.pageno;
      if (pageno <= this.state.max_page) {
        this.props.getAllDrafts(this.state.cookie, pageno);
        this.setState({ pageno, status: true });
      } else {
        this.setState({ status: false });
        toast.warn('All Data Fetched', {
          position: toast.POSITION.TOP_CENTER,
        });
        return false;
      }
    }
  }

  /*
    Function draftList() is used to show all the drafts.
  */
  draftList() {
    const apiUrl = variables.url.localURL;
    if (this.state.showDraftList) {
      return (
        <div className="modal modalParent main-modal-card ">
          <div className="modal-dialog modal-lg">
            <div className="modal-container modalChild">
              <div className="modal-header content-title-top">
                <button type="button" className="close" onClick={this.props.closeModal}>
                  <img src="../assets/images/close.png" />
                </button>
                <h4 className="modal-title text-center content-title">Drafts</h4>
              </div>
              <div
                className="modal-body draft_list"
                id="draft_list"
                onScroll={this.handleScrollDrafts.bind(this)}
              >
                {this.state.myDrafts.length > 0
                  ? this.state.myDrafts.map((data, i) =>
                    (<div
                      key={i}
                      className="col-xs-12 col-sm-6 col-md-6 col-lg-4 card-wrapper no_padding padding_left"
                    >
                      <div className="panel content-card drafts-content-card">
                        {data.featuring_data
                            ? <div className="featuringImage">
                              <img
                                className="img-responsive card-image"
                                src={data.featuring_data[0].imgurl}
                                alt="card image"
                                data-placement="top"
                                title="Card Image"
                                alt="Card Image"
                              />
                            </div>
                            : <div className="dummy_featuringImage">
                              <img
                                className="img-responsive"
                                src="../assets/images/main_logo.png"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="No image saved"
                                alt="risorso"
                              />
                            </div>}
                        <div className="panel-body">
                          <div className="content-card-section1">
                            <div className="content-card-title">
                              <p>
                                {data.published_channel
                                    ? data.published_channel.channel_title
                                    : 'No Channel selected'},
                                  <span className="text-muted">
                                    <TimeAgo date={data.creation_time} />
                                  </span>
                              </p>
                            </div>
                            <div className="content-card-info">
                              <a>
                                <h3>
                                  {data.main_title}
                                </h3>
                              </a>
                              <p className="text-muted">
                                {data.content_description == null
                                    ? 'No content description saved'
                                    : data.content_description}
                              </p>
                            </div>
                          </div>
                          <div className="content-card-section2">
                            <ul>
                              <li>
                                <img
                                  src={
                                      data.published_channel
                                        ? apiUrl + data.published_channel.channel_logo
                                        : null
                                    }
                                />
                              </li>
                              <li>
                                <img src="assets/images/content-card/banner-icon-divider.png" />
                              </li>
                              <li>
                                <img
                                  src={
                                      data.quick_category
                                        ? apiUrl + data.quick_category.category_icon
                                        : null
                                    }
                                />
                              </li>
                              <li>
                                <img src="assets/images/content-card/banner-icon-divider.png" />
                              </li>
                              <li>
                                <img src="assets/images/content-card//banner-icon3.png" />
                              </li>
                            </ul>
                          </div>
                          <NavLink to="createarticle">
                            <div className="draft-edit">
                              <img
                                onClick={this.editDraft.bind(this, data)}
                                src="assets/images/draft-edit.png"
                              />
                            </div>
                          </NavLink>
                        </div>
                      </div>
                    </div>),
                    )
                  : <div className="no-draft-exists">
                      No draft exists <span className="text-muted">(click back to create)</span>
                  </div>}
                <div className="text-right back-drafts-modal">
                  <button
                    className="submit_button append-margin"
                    onClick={this.showDraftList.bind(this)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  /*
    Function openContentType(e) used to check if user is logged in or not.
  */
  openContentType() {
    // If User is logged in then open content type modal or, else open ogin screen.
    if (this.state.cookie != '') {
      this.setState({ contentType: true });
    } else {
      this.setState({ move_to_login: true });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('onScroll', this.handleScrollDrafts);
  }

  render() {
    if (this.state.move_to_createArticle) {
      return <Redirect to="/createarticle" />;
    }
    const draftList = this.draftList();
    if (this.state.contentType) {
      return (
        <div className="contentTypeModal">
          <div className="modal modalParent">
            <div className="main_parent">
              <div className="modal-dialog modal-lg">
                <div className="modal-container modalChild">
                  <div className="modal-header">
                    <button type="button" className="close" onClick={this.props.closeModal}>
                      <img src="../assets/images/close.png" />
                    </button>
                    <h4 className="modal-title text-center content-title">Create</h4>
                  </div>
                  <div className="modal-body text-center">
                    <ul className="content-type-list">
                      <li onClick={this.goToMixedArticle.bind(this)}>
                        {/* <NavLink to="/createarticle"> */}
                        <div className="list-content">
                          <img src="../assets/images/create/Create-ICON-1.jpg" />
                          <span>Mixed Article</span>
                        </div>
                        {/* </NavLink> */}
                      </li>
                      <li className="not-allowed">
                        <div className="list-content">
                          <img src="../assets/images/create/Create-ICON-2.jpg" />
                          <span>Image</span>
                        </div>
                      </li>
                      <li className="not-allowed">
                        <div className="list-content">
                          <img src="../assets/images/create/Create-ICON-3.jpg" />
                          <span>Video</span>
                        </div>
                      </li>
                      <li className="not-allowed">
                        <div className="list-content">
                          <img src="../assets/images/create/Create-ICON-4.jpg" />
                          <span>List</span>
                        </div>
                      </li>
                    </ul>

                    <button
                      className="create-btn contentBtnForHover"
                      onClick={this.showDraftList.bind(this)}
                    >
                      Continue From Drafts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="contentTypeModal">
        {draftList}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ContentTypeModal = state;
  return { ContentTypeModal };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getAllDrafts: (space, pageno) => {
      dispatch(getAllDrafts(space, pageno));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypeModal);
