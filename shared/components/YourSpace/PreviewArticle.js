import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { NavLink } from 'react-router-dom';
import {
  getAllDrafts,
  overrideDraft,
  saveNewDraft,
  publishArticle,
} from '../../actions/YourSpace_actions/article_actions';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class PreviewArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainTitle: '',
      channel_data: '',
      category_data: '',
      content_description: '',
      elements: [],
      featuringUrl: '',
      coverImage: '',
      featuring_data: '',
      showSavePostBalloon: false,
      token: '',
      getAllDrafts: [],
      search_drafts: '',
      activate_loader: '',
      getAllDrafts: '',
      clickedDraft: '',
      new_draft_name: '',
      newDraftIsSaved: false,
      moveToHome: false,
      pageno: 1,
      status: false,
      max_page: '',
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    this.setState({ token });
    this.props.getAllDrafts(token, this.state.pageno);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      console.log('nextProps', nextProps);
      if (nextProps.PreviewArticle.fetchArticleData.success == true) {
        if (nextProps.PreviewArticle.fetchArticleData.from === 'get_drafts') {
          this.setState({ getPreviousDrafts: this.state.getAllDrafts });
          if (nextProps.PreviewArticle.fetchArticleData.result) {
            this.setState({ activate_loader: false });
            if (this.state.status) {
              this.setState({
                getAllDrafts: this.state.getAllDrafts.concat(
                  nextProps.PreviewArticle.fetchArticleData.result.data,
                ),
              });
              this.setState({
                status: false,
                max_page: nextProps.PreviewArticle.fetchArticleData.result.max_page,
              });
            } else {
              this.setState({
                getAllDrafts: nextProps.PreviewArticle.fetchArticleData.result.data,
                max_page: nextProps.PreviewArticle.fetchArticleData.result.max_page,
              });
            }
          }
          if (this.state.status == true) {
            this.setState({
              getAllDrafts: this.state.getAllDrafts.concat(
                nextProps.PreviewArticle.fetchArticleData.result.data,
              ),
            });
            this.setState({ status: false });
          }
        } else if (nextProps.PreviewArticle.fetchArticleData.from === 'save_drafts') {
          var message = nextProps.PreviewArticle.fetchArticleData.result.message;
          toast.success('Draft Saved Successfully..', {
            position: toast.POSITION.TOP_CENTER,
          });
        } else if (nextProps.PreviewArticle.fetchArticleData.from === 'override_draft') {
          var message = nextProps.PreviewArticle.fetchArticleData.result.message;
          toast.success('Override Successfully..', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else if (nextProps.PreviewArticle.fetchArticleData.error == true) {
        if (nextProps.PreviewArticle.fetchArticleData.result.message) {
          var message = nextProps.PreviewArticle.fetchArticleData.result.message;
          toast.error(message, {
            position: toast.POSITION.TOP_CENTER,
          });
          return false;
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.state.newDraftIsSaved == true) {
      this.props.getAllDrafts(this.state.token);
      this.setState({ newDraftIsSaved: false });
    }
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // alert('You clicked outside of me!');
      this.setState({
        showSavePostBalloon: !this.state.showSavePostBalloon,
        new_draft_name: '',
        clickedDraft: '',
      });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);

    let mainTitle = JSON.parse(localStorage.getItem('mainTitle')),
      channel_data = JSON.parse(localStorage.getItem('channel_data')),
      category_data = JSON.parse(localStorage.getItem('category_data')),
      content_description = JSON.parse(localStorage.getItem('content_description')),
      coverImage = JSON.parse(localStorage.getItem('coverImg')),
      featuring_data = JSON.parse(localStorage.getItem('featuring_data')),
      article_data = JSON.parse(localStorage.getItem('article_data'));

    this.setState({
      mainTitle,
      channel_data,
      category_data,
      content_description,
      coverImage: coverImage[0].url,
      featuring_data,
    });

    if (article_data) {
      if (article_data.length > 0) {
        const maping = article_data.map((data) => {
          if (data.type == 'paragraph') {
            return (
              <div className="paragraph paragraph-section text-center">
                <div dangerouslySetInnerHTML={{ __html: data.content.toString() }} />
              </div>
            );
          } else if (data.type == 'subtitle') {
            return (
              <div className="subtitle subtitle-section text-center">
                <h3>
                  {data.content}
                </h3>
              </div>
            );
          } else if (data.type == 'quote') {
            return (
              <div className="quote quote-section">
                <div className="quote-heading text-center">
                  <h2>
                    {data.content}
                  </h2>
                </div>
              </div>
            );
          } else if (data.type == 'seperator') {
            return (
              <div>
                <img src="../assets/images/separator.png" className="preview_seperator" />
              </div>
            );
          } else if (data.type == 'add') {
            return (
              <div>
                <p className="preview_subtitle">
                  add {data.content}
                </p>
              </div>
            );
          } else if (data.type == 'photo') {
            // if (data.featuring == true) {
            //   this.setState({
            //     featuringUrl: this.state.coverImage,
            //   });
            // } else {
            // }
            return (
              <div className="image image-section text-center">
                <h3>
                  {data.title}
                </h3>
                <img src={data.imgurl} />

                <p>
                  <span className="featuringDescription featuring text-muted">
                    {data.discription}
                  </span>
                </p>
                <p>
                  <span className="featuringOwner featuring text-muted">
                    {data.owner} via{' '}
                  </span>
                  <div className="featuringUrl featuring">
                    {data.url}
                  </div>
                </p>
              </div>
            );
          } else if (data.type == 'relatedArticle') {
            const mydata = data.fromAnotherResource;
            let imgsrc;
            if (mydata.image == '') {
              imgsrc = '../assets/images/no-image-available.png';
            } else {
              imgsrc = mydata.image;
            }
            setTimeout(() => {
              const childNodes = document.getElementById('relatedPreviewEdit').childNodes;
              if (childNodes.length > 0) {
                for (let i = 0; i < childNodes.length; i++) {
                  if (childNodes[i].nodeType != Node.TEXT_NODE) {
                    childNodes[i].removeAttribute('style');
                  }
                }
              }
            }, 100);
            return (
              <div className="preview_otherSource no-drag drag-event">
                <div className="col-sm-4 no-drag drag-event">
                  <div className="preview_otherSource_card no-drag drag-event">
                    <div className="preview_otherSource_imgPart no-drag drag-event">
                      <img src={imgsrc} />
                    </div>
                    <div className="related-article-info">
                      <div className="related-article-host relatedPreview">
                        <p>
                          {mydata.host}
                        </p>
                      </div>
                      <div className="preview_otherSource_dataPart no-drag drag-event">
                        <div className="title no-drag drag-event">
                          {mydata.title}
                        </div>
                        <div className="description text-muted no-drag drag-event">
                          {mydata.des}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="relatedPreviewEdit"
                  className="col-sm-6 preview_otherSource_text text-muted no-drag drag-event"
                  dangerouslySetInnerHTML={{ __html: mydata.description }}
                />
              </div>
            );
          } else if (data.type == 'embed') {
            return (
              <div className="embedPreview no-drag drag-event">
                <p className="embedPreviewTitle text-center">
                  {data.title}
                </p>
                <div
                  className="embedPreview no-drag drag-event"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
                <p className="embedPreviewDescription text-center text-muted">
                  {data.description}
                </p>
              </div>
            );
          }
        });
        this.setState({
          elements: maping,
        });
      }
    }
  }

  showSavePostBalloon() {
    this.setState({ showSavePostBalloon: !this.state.showSavePostBalloon });
  }

  handleSearchDraft(e) {
    this.setState({ search_drafts: e.target.value });
  }

  selectDraft(data) {
    this.setState({ clickedDraft: data });
  }

  handleNewDraft(e) {
    this.setState({ new_draft_name: e.target.value });
  }

  override(e) {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');

    if (this.state.clickedDraft == '') {
      toast.error('Select a draft from list to Override', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    const main_title = JSON.parse(localStorage.getItem('mainTitle'));

    const draft_title = this.state.clickedDraft.draft_title;
    const draft_id = this.state.clickedDraft._id;
    let published_channel;
    const channel_data = JSON.parse(localStorage.getItem('channel_data'));
    channel_data.map((data) => {
      published_channel = data._id;
    });

    let quick_category;
    const category_data = JSON.parse(localStorage.getItem('category_data'));
    category_data.map((data) => {
      quick_category = data._id;
    });

    const content_type = 'mixed';

    const article_data = JSON.parse(localStorage.getItem('article_data'));

    const content_description = JSON.parse(localStorage.getItem('content_description'));

    const featuring_image_data = JSON.parse(localStorage.getItem('coverImg'));
    const featuring_image = featuring_image_data[0].url;

    const creation_time = Date.now();

    const featuring_data = JSON.parse(localStorage.getItem('featuring_data'));

    this.props.overrideDraft(
      token,
      main_title,
      draft_title,
      draft_id,
      published_channel,
      content_type,
      quick_category,
      content_description,
      article_data,
      featuring_image,
      featuring_data,
      creation_time,
    );
    this.setState({
      showSavePostBalloon: !this.state.showSavePostBalloon,
      clickedDraft: '',
    });
  }

  submitNewDraft(e) {
    e.preventDefault();
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    const draft_title = this.state.new_draft_name;

    if (draft_title == '') {
      toast.error('Enter Draft title!!', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    const main_title = JSON.parse(localStorage.getItem('mainTitle'));

    let published_channel;
    const channel_data = JSON.parse(localStorage.getItem('channel_data'));
    channel_data.map((data) => {
      published_channel = data._id;
    });

    let quick_category;
    const category_data = JSON.parse(localStorage.getItem('category_data'));
    category_data.map((data) => {
      quick_category = data._id;
    });

    const content_type = 'mixed';

    const article_data = JSON.parse(localStorage.getItem('article_data'));

    const content_description = JSON.parse(localStorage.getItem('content_description'));

    const featuring_image_data = JSON.parse(localStorage.getItem('coverImg'));
    const featuring_image = featuring_image_data[0].url;
    const featuring_data = JSON.parse(localStorage.getItem('featuring_data'));

    const creation_time = Date.now();
    this.props.saveDraftArticle(
      token,
      main_title,
      draft_title,
      published_channel,
      content_type,
      quick_category,
      content_description,
      article_data,
      featuring_image,
      featuring_data,
      creation_time,
    );
    // this.props.getAllDr  afts(this.state.token, 1);
    this.setState({
      showSavePostBalloon: !this.state.showSavePostBalloon,
      new_draft_name: '',
      status: false,
    });
  }

  handleScrollDrafts() {
    const x = document.getElementById('previous_drafts');
    const offset = Math.ceil(x.scrollTop + x.offsetHeight);
    const height = x.scrollHeight;
    if (offset == height) {
      const pageno = ++this.state.pageno;
      if (pageno <= this.state.max_page) {
        this.props.getAllDrafts(this.state.token, pageno);
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

  savePostBalloon() {
    if (this.state.showSavePostBalloon) {
      return (
        <div ref={this.setWrapperRef.bind(this)} className="savePostBalloon">
          <div className="search_SavePost">
            <form>
              <div className="input-group">
                <input
                  type="text"
                  id=""
                  autoFocus
                  value={this.state.search_drafts}
                  onChange={this.handleSearchDraft.bind(this)}
                  className="form-control mainInp"
                  name="save_post"
                  placeholder="Search"
                />
                <span className="input-group-addon">
                  <i
                    className="fa fa-search draft_search_icon"
                    aria-hidden="true"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Search Drafts"
                  />
                </span>
              </div>
            </form>
            <div
              id="previous_drafts"
              className="previous_drafts"
              onScroll={this.handleScrollDrafts.bind(this)}
            >
              {this.state.activate_loader
                ? <div className="loader_in_drafts" />
                : <ul>
                  {this.state.getAllDrafts.map((data, i) =>
                      (<li
                        key={i}
                        onClick={this.selectDraft.bind(this, data)}
                        className={
                          this.state.clickedDraft == data ? 'draftColored text-left' : 'text-left'
                        }
                      >
                        {data ? data.draft_title : ''}{' '}
                        <span className="pull-right">
                          {data ? data.creation_time.split('T')[0] : ''}
                        </span>
                      </li>),
                    )}
                </ul>}
            </div>
            <div>
              <button
                className="submit_button override_btn append-margin pull-right"
                onClick={this.override.bind(this)}
              >
                Override
              </button>
            </div>
            <div className="save_as_new_draft">
              <form onSubmit={this.submitNewDraft.bind(this)}>
                <input
                  type="text"
                  id=""
                  autoFocus
                  value={this.state.new_draft_name}
                  onChange={this.handleNewDraft.bind(this)}
                  className="form-control mainInp"
                  name="save_post"
                  placeholder="Name Here"
                  autoFocus
                />
                <input
                  id=""
                  type="submit"
                  name="save_new_draft"
                  value="Save As New"
                  className="submit_button append-margin pull-right"
                  onClick={this.submitNewDraft.bind(this)}
                />
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  publishArticle() {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    const main_title = JSON.parse(localStorage.getItem('mainTitle'));

    let published_channel;
    const channel_data = JSON.parse(localStorage.getItem('channel_data'));
    channel_data.map((data) => {
      published_channel = data._id;
    });

    let quick_category;
    const category_data = JSON.parse(localStorage.getItem('category_data'));
    category_data.map((data) => {
      quick_category = data._id;
    });

    const content_type = 'video';
    const content_type_icon = '/images/content-card/banner-icon3.png';

    const article_data = JSON.parse(localStorage.getItem('article_data'));

    const content_description = JSON.parse(localStorage.getItem('content_description'));

    const featuring_image_data = JSON.parse(localStorage.getItem('coverImg'));
    const featuring_image = featuring_image_data[0].url;

    const featuring_data = JSON.parse(localStorage.getItem('featuring_data'));
    const published_time = Date.now();

    const draft_id = JSON.parse(localStorage.getItem('draft_id'));

    this.props.publishArticle(
      token,
      draft_id,
      main_title,
      published_channel,
      content_type,
      quick_category,
      content_description,
      article_data,
      featuring_image,
      featuring_data,
      published_time,
    );
    localStorage.clear();
  }

  render() {
    let channelTitle,
      channelLogo,
      category_icon;
    // for channel info
    if (this.state.channel_data) {
      this.state.channel_data.map((data) => {
        channelTitle = data.channel_title;
        channelLogo = data.channel_logo;
      });
    }

    // for category info
    if (this.state.category_data) {
      this.state.category_data.map((data) => {
        category_icon = data.category_icon;
      });
    }

    const savePostBalloon = this.savePostBalloon();
    return (
      <div className="preview container ShowcaseMain no_padding card-header">
        <div className="">
          <div className="preview_article_header">
            <div className="col-sm-6">
              <NavLink to="/createarticle">
                <button className="back-btn card-btn">Back</button>
              </NavLink>
            </div>
            <div className="col-sm-6 text-right">
              <div className="previewSaveButton">
                <button className="card-btn save-btn" onClick={this.showSavePostBalloon.bind(this)}>
                  Save
                </button>
                {savePostBalloon}
              </div>
              <NavLink to="/">
                <button onClick={this.publishArticle.bind(this)} className="card-btn publish-btn">
                  Publish
                </button>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="card card-section">
          <img src={this.state.coverImage} className="preview_cover_img" />
          <div className="col-sm-12 col-md-8">
            <div className="card-left text-left">
              <h2>
                {' '}{this.state.mainTitle}
              </h2>
              <div className="content-card-footer preview-footer">
                <ul>
                  <li>
                    <i
                      className="ico-icon42 footer-icons"
                      aria-hidden="true"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Trending"
                    />
                    <span className="text-muted">0</span>
                  </li>
                  <li>
                    <i
                      className="ico-icon44 footer-icons text-muted"
                      aria-hidden="true"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Comments"
                    />
                    <span className="text-muted">0</span>
                  </li>
                  <li>
                    <i
                      className="ico-icon43 footer-icons text-muted"
                      aria-hidden="true"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Likes"
                    />
                    <span className="text-muted">0</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4">
            <div className="card-right text-right">
              <div className="main-card">
                <div className="content-card-title">
                  <p>
                    {channelTitle}
                    <span className="text-muted"> ,11 month ago</span>
                  </p>
                </div>
                <div className="social-icon">
                  <ul>
                    <li>
                      <a href="#">
                        <img className="flag-icon" src="assets/images/preview/flag.png" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="ico-icon52 ico-icon" />
                    </li>
                    <li>
                      <a href="#" className="ico-icon53 ico-icon" />
                    </li>
                    <li>
                      <a href="#" className="ico-icon54 puls-icon" />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="main-card">
                <div className="content-card-section2">
                  <ul>
                    <li>
                      <img
                        src={`http://18.195.238.14:3000${channelLogo}`}
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
                        src={`http://18.195.238.14:3000${category_icon}`}
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
                        src="http://18.195.238.14:3000/images/banner-icon3.png"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Content Type"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* {data.content} */}
        </div>
        <div className="title title-section text-center">
          <h2>
            {this.state.mainTitle}
          </h2>
        </div>
        <div className="preview text-center">
          {this.state.elements}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const PreviewArticle = state;
  return { PreviewArticle };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getAllDrafts: (token, page) => {
      dispatch(getAllDrafts(token, page));
    },

    saveDraftArticle: (
      token,
      main_title,
      draft_title,
      published_channel,
      content_type,
      quick_category,
      content_description,
      article_data,
      featuring_image,
      featuring_data,
      creation_time,
    ) => {
      dispatch(
        saveNewDraft(
          token,
          main_title,
          draft_title,
          published_channel,
          content_type,
          quick_category,
          content_description,
          article_data,
          featuring_image,
          featuring_data,
          creation_time,
        ),
      );
    },

    overrideDraft: (
      token,
      main_title,
      draft_title,
      draft_id,
      published_channel,
      content_type,
      quick_category,
      content_description,
      article_data,
      featuring_image,
      featuring_data,
      creation_time,
    ) => {
      dispatch(
        overrideDraft(
          token,
          main_title,
          draft_title,
          draft_id,
          published_channel,
          content_type,
          quick_category,
          content_description,
          article_data,
          featuring_image,
          featuring_data,
          creation_time,
        ),
      );
    },

    publishArticle: (
      token,
      draft_id,
      main_title,
      published_channel,
      content_type,
      quick_category,
      content_description,
      article_data,
      featuring_image,
      featuring_data,
      published_time,
    ) => {
      dispatch(
        publishArticle(
          token,
          draft_id,
          main_title,
          published_channel,
          content_type,
          quick_category,
          content_description,
          article_data,
          featuring_image,
          featuring_data,
          published_time,
        ),
      );
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewArticle);
