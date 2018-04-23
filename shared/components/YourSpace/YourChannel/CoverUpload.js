import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImgCrop from './ImgCrop';
import ImgUpload from './ImgUpload';

class CoverUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }

  componentDidMount() {}

  nextChange() {
    const nextCount = ++this.state.count;
    this.setState({
      count: nextCount,
    });
  }

  changeContent() {
    if (this.state.count == 1) {
      return <ImgUpload nextChange={this.nextChange.bind(this)} />;
    }
    return <ImgCrop nextChange={this.props.nextModule} />;
  }

  render() {
    const content = this.changeContent();

    return (
      <div className="channelCoverUpload">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const CoverUpload = { state };
  return { CoverUpload };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverUpload);
