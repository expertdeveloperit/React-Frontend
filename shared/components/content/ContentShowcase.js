import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { NavLink } from 'react-router-dom';
import { getContentData } from '../../actions/contentActions/contentShowcase_action';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class ContentShowcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      loading: false,
      message: '',
      articleData: '',
      propHeader: this.props.propHeader,
    };
  }

  componentWillMount() {
    // this.state.propHeader;
    const article_id = this.props.match.params.id;
    this.props.getContent(article_id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      if (nextProps.ContentShowcase.contentData.loading) {
        // alert('loading');
        this.setState({
          loading: nextProps.ContentShowcase.contentData.loading,
          message: nextProps.ContentShowcase.contentData.message,
        });
      } else if (nextProps.ContentShowcase.contentData.result.status) {
        this.setState({
          loading: nextProps.ContentShowcase.contentData.loading,
          message: nextProps.ContentShowcase.contentData.message,
          articleData: nextProps.ContentShowcase.contentData.result.article,
        });
      } else {
        this.setState({
          loading: nextProps.ContentShowcase.contentData.loading,
          message: nextProps.ContentShowcase.contentData.message,
        });
      }
    }
  }

  componentDidUpdate() {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }

  componentDidMount() {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }

  getElements() {
    if (this.state.articleData) {
      const mapping = this.state.articleData.article_data.map((data) => {
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
          return <img src="../assets/images/separator.png" className="preview_seperator" />;
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
      return mapping;
    }
    const message = 'No data to Display';
    return message;
  }

  render() {
    const elements = this.getElements();
    return (
      <div className="contentShowcaseMain ShowcaseMain">
        <div className="preview container no_padding card-header">
          <div className="card card-section">
            <img
              src={this.state.articleData ? this.state.articleData.featuring_image : ''}
              className="preview_cover_img"
            />
            <div className="col-sm-12 col-md-8">
              <div className="card-left text-left">
                <h2>
                  {' '}{this.state.articleData.main_title}
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
                      Test Channel
                      <span className="text-muted"> ,11 month ago</span>
                    </p>
                  </div>
                  <div className="social-icon">
                    <ul>
                      <li>
                        <a href="#">
                          <img className="flag-icon" src="../assets/images/preview/flag.png" />
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
                          src={
                            this.state.articleData.published_channel
                              ? `http://18.195.238.14:3000${this.state.articleData.published_channel
                                  .channel_logo}`
                              : 'this.state.articleData.quick_category'
                          }
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Channel Logo"
                        />
                      </li>
                      <li>
                        <img src="../assets/images/content-card/banner-icon-divider.png" />
                      </li>
                      <li>
                        <img
                          src={
                            this.state.articleData.quick_category
                              ? `http://18.195.238.14:3000${this.state.articleData.quick_category
                                  .category_icon}`
                              : 'this.state.articleData.quick_category'
                          }
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Quick Category"
                        />
                      </li>
                      <li>
                        <img src="../assets/images/content-card/banner-icon-divider.png" />
                      </li>
                      <li>
                        <img
                          src={`http://18.195.238.14:3000${this.state.articleData
                            .content_type_icon}`}
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
              {this.state.articleData.main_title}
            </h2>
          </div>
          <div className="preview text-center">
            {elements}
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const ContentShowcase = state;
  return { ContentShowcase };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getContent: (id) => {
      dispatch(getContentData(id));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContentShowcase);
