import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { NavLink } from 'react-router-dom';
import ContentDescription from './ContentDescription';
import Category from './Category';
import Channel from './Channel';
import Cookies from 'universal-cookie';
import {
  getAllDrafts,
  overrideDraft,
  saveNewDraft,
} from '../../../actions/YourSpace_actions/article_actions';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import variables from '../../../variables';

class ArticleHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePostBalloon: false,
      search_drafts: '',
      activate_loader: '',
      getAllDrafts: [],
      clickedDraft: '',
      new_draft_name: '',
      token: '',
      newDraftIsSaved: false,
      moveToHome: false,
      check_opened_module: this.props.check_opened_module,
      checkData: this.props.checkData,
      moveToPreview: false,
      pageno: 1,
      status: false,
      max_page: '',
    };
    // this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    this.setState({ token });
    this.props.getAllDrafts(token, this.state.pageno);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    // this.handleScrollDrafts();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('onScroll', this.handleScrollDrafts);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ savePostBalloon: !this.state.savePostBalloon });
      this.setState({ new_draft_name: '', clickedDraft: '' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ArticleHeader.fetchArticleData.loading == true) {
      // this.setState({activate_loader:true})
    } else if (nextProps.ArticleHeader.fetchArticleData.success == true) {
      this.setState({ getPreviousDrafts: this.state.getAllDrafts });
      if (nextProps.ArticleHeader.fetchArticleData.result) {
        this.setState({ activate_loader: false });
        if (this.state.status) {
          this.setState({
            getAllDrafts: this.state.getAllDrafts.concat(
              nextProps.ArticleHeader.fetchArticleData.result.data,
            ),
          });
          this.setState({
            status: false,
            max_page: nextProps.ArticleHeader.fetchArticleData.result.max_page,
          });
        } else {
          this.setState({ getAllDrafts: nextProps.ArticleHeader.fetchArticleData.result.data });
        }
      }
    }

    if (this.state.status == true) {
      this.setState({
        getAllDrafts: this.state.getAllDrafts.concat(
          nextProps.ArticleHeader.fetchArticleData.result.data,
        ),
      });
      this.setState({ status: false });
    }
  }

  componentDidUpdate(nextProps) {
    if (this.state.newDraftIsSaved) {
      this.props.getAllDrafts(this.state.token, this.state.pageno);
      this.setState({ newDraftIsSaved: false });
    }
  }

  savePost(e) {
    const test = this.state.check_opened_module();
    const main_title = JSON.parse(localStorage.getItem('mainTitle'));
    if (test) {
      if (main_title != null) {
        this.setState({ savePostBalloon: !this.state.savePostBalloon });
        return true;
      }
      toast.error('Add main title to save', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
  }

  handleSearchDraft(e) {
    this.setState({ search_drafts: e.target.value });
  }

  selectDraft(data) {
    this.setState({ clickedDraft: data });
  }

  override(e) {
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');

    const main_title = JSON.parse(localStorage.getItem('mainTitle'));

    const draft_title = this.state.clickedDraft.draft_title;
    const draft_id = this.state.clickedDraft._id;
    let published_channel;
    const channel_data = JSON.parse(localStorage.getItem('channel_data'));
    if (channel_data) {
      channel_data.map((data) => {
        published_channel = data._id;
      });
    }

    let quick_category;
    const category_data = JSON.parse(localStorage.getItem('category_data'));
    if (category_data) {
      category_data.map((data) => {
        quick_category = data._id;
      });
    }
    const content_type = 'mixed';

    const article_data = JSON.parse(localStorage.getItem('article_data'));

    const content_description = JSON.parse(localStorage.getItem('content_description'));
    let featuring_image;
    const coverImg = JSON.parse(localStorage.getItem('coverImg'));
    if (coverImg) {
      const featuring_image_data = JSON.parse(localStorage.getItem('coverImg'));
      const featuring_image = featuring_image_data[0].url;
    }

    const creation_time = Date.now();
    const featuring_data = JSON.parse(localStorage.getItem('featuring_data'));
    if (draft_title != undefined) {
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
      toast.success('Draft override Successfully!!', { position: toast.POSITION.TOP_CENTER });
      // this.setState({ clickedDraft: '' });
      this.setState({ savePostBalloon: !this.state.savePostBalloon });
    } else {
      toast.error('Click a draft to override!', { position: toast.POSITION.TOP_CENTER });
      e.preventDefault();
    }
  }

  handleNewDraft(e) {
    this.setState({ new_draft_name: e.target.value });
  }

  submitNewDraft(e) {
    e.preventDefault();
    const draft_title = this.state.new_draft_name;
    const cookies = new Cookies();
    const token = cookies.get('risorsoLoggedIn');
    if (draft_title == '') {
      toast.error('Enter draft name', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    const main_title = JSON.parse(localStorage.getItem('mainTitle'));

    let published_channel;
    const channel_data = JSON.parse(localStorage.getItem('channel_data'));
    if (channel_data) {
      channel_data.map((data) => {
        published_channel = data._id;
      });
    }

    let quick_category;
    const category_data = JSON.parse(localStorage.getItem('category_data'));
    if (category_data) {
      category_data.map((data) => {
        quick_category = data._id;
      });
    }

    const content_type = 'mixed';

    const article_data = JSON.parse(localStorage.getItem('article_data'));

    const content_description = JSON.parse(localStorage.getItem('content_description'));

    const coverImg = JSON.parse(localStorage.getItem('coverImg'));
    let featuring_image;
    if (coverImg) {
      const featuring_image_data = JSON.parse(localStorage.getItem('coverImg'));
      featuring_image = featuring_image_data[0].url;
    }

    const creation_time = Date.now();
    const featuring_data = JSON.parse(localStorage.getItem('featuring_data'));

    this.props.saveNewDraft(
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
    this.props.getAllDrafts(this.state.token, this.state.pageno);
    toast.success('Draft Saved Successfully!!', { position: toast.POSITION.TOP_CENTER });
    this.setState({ savePostBalloon: !this.state.savePostBalloon });
    // this.setState({ new_draft_name: '' });
  }

  handleScrollDrafts() {
    const x = document.getElementById('previous_drafts');
    if (x.scrollTop + x.offsetHeight == x.scrollHeight) {
      this.props.getAllDrafts(this.state.token, this.state.pageno + 1);
      this.setState({ pageno: this.state.pageno + 1, status: true });
    }
  }

  savePostBalloon() {
    if (this.state.savePostBalloon) {
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
                        className={this.state.clickedDraft == data ? 'draftColored' : null}
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

  previewPost(e) {
    const test = this.state.check_opened_module();
    this.setState({ moveToPreview: false });
    if (test) {
      if (this.state.checkData(e)) {
        this.setState({ moveToPreview: true });
        return true;
      }
      return false;
    }
    // toast.error('Save opened module first', { position: toast.POSITION.TOP_CENTER });
    return false;
  }

  render() {
    const savePostBalloon = this.savePostBalloon();
    if (this.state.moveToPreview) {
      return <Redirect to="/PreviewArticle" />;
    }
    return (
      <div className="parentSection">
        <div className="article-header childSection1">
          <div className="col-sm-6 ">
            <h5>Make a New Post</h5>
          </div>
          <div className="col-sm-6 text-right childSection2">
            <button type="button" className="btn btn-Preview" onClick={this.previewPost.bind(this)}>
              Preview Post
            </button>
            <button type="button" className="btn btn-Save" onClick={this.savePost.bind(this)}>
              Save Post
            </button>
          </div>
        </div>
        {savePostBalloon}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ArticleHeader = state;
  return { ArticleHeader };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getAllDrafts: (token, pageno) => {
      dispatch(getAllDrafts(token, pageno));
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

    saveNewDraft: (
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleHeader);
