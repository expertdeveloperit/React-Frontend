import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class PhotoPreview extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return <div>photo preview</div>;
  }
}

function mapStateToProps(state) {
  const PhotoPreview = state;
  return { PhotoPreview };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoPreview);
