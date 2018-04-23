// Component For loading components like upload image , crop image and adding details for image alt tag.

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ImgCrop from './ImgCrop';
import ImgUpload from './ImgUpload';
import VideoUpload from './VideoUpload';
import Thumbnail from './Thumbnail';
import CoverUpload from './CoverUpload';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextCount: 1,
    };
  }

  // Function nextChange() id used here for accepting next clicks from other components.
  nextModule() {
    const count = this.state.nextCount + 1;
    this.setState({
      nextCount: count,
    });
  }

  // Function setUpload(),setVideo() & setThumbnails() are used to change the layout from header clicks.
  setUpload() {
    const count = 1;
    this.setState({
      nextCount: count,
    });
    toast.success('On Channel Cover Upload', { position: toast.POSITION.TOP_CENTER });
  }
  setVideo() {
    const count = 2;
    this.setState({
      nextCount: count,
    });
    toast.success('On Channel Video Upload', { position: toast.POSITION.TOP_CENTER });
  }
  setThumbnails() {
    const count = 3;
    this.setState({
      nextCount: count,
    });
    toast.success('On Channel Thumbnail Upload', { position: toast.POSITION.TOP_CENTER });
  }
  changeContent() {
    if (this.state.nextCount == 1) {
      return <CoverUpload nextModule={this.nextModule.bind(this)} />;
    } else if (this.state.nextCount == 2) {
      return <VideoUpload nextModule={this.nextModule.bind(this)} />;
    }
    return <Thumbnail />;
  }

  render() {
    const content = this.changeContent();
    return (
      <div className="parentSection">
        <div className="childSection1 no-drag sub-header">
          <h6 className="pull-left">Channel Graphics</h6>
          <ul className="image-uplode-top-bar">
            <li
              className={this.state.nextCount == 1 ? 'active uploadIcon' : 'uploadIcon'}
              onClick={this.setUpload.bind(this)}
            >
              <span className="Image-up" />Upload Image
            </li>
            <li
              className={this.state.nextCount == 2 ? 'active videoIcon' : 'videoIcon'}
              onClick={this.setVideo.bind(this)}
            >
              <span className="Crop" />Video
            </li>
            <li
              className={this.state.nextCount == 3 ? 'active thumbnailIcon' : 'thumbnailIcon'}
              onClick={this.setThumbnails.bind(this)}
            >
              <span className="Details" />Thumbnail
            </li>
          </ul>
          <ul className="text-muted pull-right no-drag">
            <li>
              <img src="../assets/images/user-profile/article-icon-2.png" />
            </li>
          </ul>
        </div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const Photo = state;
  return { Photo };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
