import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ImgCrop from './ImgCrop';
import ImgDetails from './ImgDetails';
import ImgUpload from './ImgUpload';
import ImgPreview from './ImgPreview';
import { ToastContainer, toast } from 'react-toastify';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextCount: 1,
      stopRender: this.props.setRender,
      stop: false,
      imageurl: '',
      galleryImage: '',
      callProp: this.props.callRender,
    };
  }

  componentDidMount() {
    let imageurl = JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`)),
      galleryImage = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`));

    if (imageurl || galleryImage) {
      this.setState({
        imageurl,
        galleryImage,
      });
    }
    if (this.props.open) {
      this.setState({
        nextCount: 1,
      });
    } else {
      this.setState({
        nextCount: 4,
      });
      // this.state.callProp();
    }
  }

  handleOpenImage(e) {
    const count = 1;
    this.setState({
      stop: true,
      nextCount: count,
    });
    this.props.test;
  }

  nextChange() {
    const count = this.state.nextCount + 1;
    this.setState({
      nextCount: count,
    });
  }

  checkCropData(e) {
    const cardImg = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`));
    if (cardImg == null) {
      toast.error('Please Crop Image', { position: toast.POSITION.TOP_CENTER });
    } else {
      this.setState({
        nextCount: 3,
      });
    }
  }

  cancel() {
    this.setState({
      nextCount: 4,
    });
    localStorage.setItem(`imageUrl${this.props.ID}`, JSON.stringify(this.state.imageurl));
    localStorage.setItem(`gallery${this.props.ID}`, JSON.stringify(this.state.galleryImage));
  }

  setUpload() {
    const count = 1;
    this.setState({
      nextCount: count,
    });
  }
  setCrop() {
    const imageUrl = JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`));
    if (imageUrl == null) {
      toast.error('First please upload pic', { position: toast.POSITION.TOP_CENTER });
    } else {
      const count = 2;
      this.setState({
        nextCount: count,
      });
    }
  }
  setDetails(e) {
    const cardImg = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`));
    if (cardImg == null) {
      toast.error('Please Crop Image', { position: toast.POSITION.TOP_CENTER });
    } else {
      const count = 3;
      this.setState({
        nextCount: count,
      });
    }
  }

  ChangePreview() {
    const count = this.state.nextCount + 1;
    this.setState({
      nextCount: count,
    });
    this.state.callProp();
  }

  render() {
    if (this.state.nextCount == 2) {
      return (
        <div className="no-drag drag-event image">
          <ImgCrop
            checkCropData={this.checkCropData.bind(this)}
            setUpload={this.setUpload.bind(this)}
            setCrop={this.setCrop.bind(this)}
            setDetails={this.setDetails.bind(this)}
            ID={this.props.ID}
            delete={this.props.delete}
            from="image"
            stop={this.state.stop}
            check_opened_module={this.props.check_opened_module}
          />
        </div>
      );
    } else if (this.state.nextCount == 3) {
      return (
        <div className="no-drag drag-event image">
          <ImgDetails
            list={this.props.list}
            setUpload={this.setUpload.bind(this)}
            setCrop={this.setCrop.bind(this)}
            setDetails={this.setDetails.bind(this)}
            ID={this.props.ID}
            ChangePreview={this.ChangePreview.bind(this)}
            delete={this.props.delete}
            cancel={this.cancel.bind(this)}
            from="image"
            check_opened_module={this.props.check_opened_module}
          />
        </div>
      );
    } else if (this.state.nextCount == 4) {
      return (
        <div className="no-drag drag-event image">
          <ImgPreview
            setUpload={this.setUpload.bind(this)}
            setCrop={this.setCrop.bind(this)}
            setDetails={this.setDetails.bind(this)}
            ID={this.props.ID}
            delete={this.props.delete}
            handleOpenParagraph={this.handleOpenImage.bind(this)}
            from="image"
            callRender={this.props.callRender}
            addNoDrag={this.props.addNoDrag}
            removeNoDrag={this.props.removeNoDrag}
          />
        </div>
      );
    }
    return (
      <div className="no-drag drag-event image">
        <ImgUpload
          nextChange={this.nextChange.bind(this)}
          setUpload={this.setUpload.bind(this)}
          setCrop={this.setCrop.bind(this)}
          setDetails={this.setDetails.bind(this)}
          ID={this.props.ID}
          delete={this.props.delete}
          from="image"
          stop={this.state.stop}
          check_opened_module={this.props.check_opened_module}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const Image = state;
  return { Image };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Image);
