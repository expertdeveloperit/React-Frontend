import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class PhotoDescription extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return <div>photo Description</div>;
  }
}

function mapStateToProps(state) {
  const PhotoDescription = state;
  return { PhotoDescription };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDescription);
