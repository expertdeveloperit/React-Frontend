import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import CreateImage from './CreateImage';
import SelectLayout from './SelectLayout';
import PhotoUpload from './PhotoUpload';
import PhotoCrop from './PhotoCrop';
import PhotoDescription from './PhotoDescription';
import PhotoPreview from './PhotoPreview';

class ImageCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextChange: 1,
      selected: '',
      componentUpdate: true,
    };
  }

  componentDidMount() {}

  select(test) {
    this.setState({
      selected: test,
    });
  }

  nextChange() {
    if (this.state.selected) {
      const count = ++this.state.nextChange;
      this.setState({
        nextChange: count,
      });
    } else {
      alert('Please Select The layout first');
    }
  }

  checkChange() {
    if (this.state.nextChange == 1) {
      return (
        <CreateImage
          select={this.select.bind(this)}
          nextChange={this.nextChange.bind(this)}
          id={this.props.ID}
        />
      );
    } else if (this.state.nextChange == 2) {
      return (
        <SelectLayout
          select={this.select.bind(this)}
          nextChange={this.nextChange.bind(this)}
          id={this.props.ID}
        />
      );
    } else if (this.state.nextChange == 3) {
      return (
        <PhotoUpload
          nextChange={this.nextChange.bind(this)}
          id={this.props.ID}
          from="ImageCreation"
        />
      );
    } else if (this.state.nextChange == 4) {
      return (
        <PhotoCrop
          nextChange={this.nextChange.bind(this)}
          id={this.props.ID}
          from="ImageCreation"
        />
      );
    }
  }

  render() {
    const element = this.checkChange();
    return (
      <div className="no-drag drag-event">
        {element}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ImageCreation = state;
  return { ImageCreation };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageCreation);
