import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImgCrop from './ImgCrop';
import ImgUpload from './ImgUpload';

class Thumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }

  componentDidMount() {}

  changeContent() {
    if (this.state.count == 1) {
      return <ImgUpload />;
    }
    return <ImgCrop />;
  }

  render() {
    const content = this.changeContent();

    return (
      <div className="channelThumbnail">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const Thumbnail = { state };
  return { Thumbnail };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
