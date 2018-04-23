// Component For loading components like upload image , crop image and adding details for image alt tag.

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ImgCrop from './ImgCrop';
import ImgDetails from './ImgDetails';
import ImgUpload from './ImgUpload';
import ImgPreview from './ImgPreview';
import { ToastContainer, toast } from 'react-toastify';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextCount: 1,
      reRender: true,
      imageurl: '',
      cardImg: '',
      coverImg: '',
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentDidMount() {
    const localData = JSON.parse(localStorage.getItem('featuring_data'));
    let imageurl = JSON.parse(localStorage.getItem('imageUrl0')),
      cardImg = JSON.parse(localStorage.getItem('cardImg')),
      coverImg = JSON.parse(localStorage.getItem('coverImg'));
    if (localData) {
      this.setState({
        nextCount: 4,
        reRender: this.props.render,
      });
    }
    if (imageurl || cardImg || coverImg) {
      this.setState({
        imageurl,
        cardImg,
        coverImg,
      });
    }
  }

  handleOpenParagraph(e) {
    const count = 1;
    const test = this.state.check_opened_module();
    if (test) {
      this.setState({
        nextCount: count,
        reRender: true,
      });
    }
  }

  // Function nextChange() id used here for accepting next clicks from other components.
  nextChange() {
    const count = this.state.nextCount + 1;
    this.setState({
      nextCount: count,
    });
  }

  checkCropData(e) {
    let cardImg = JSON.parse(localStorage.getItem('cardImg')),
      coverImg = JSON.parse(localStorage.getItem('coverImg'));
    if (cardImg == null || coverImg == null) {
      toast.error('Please Crop Images', { position: toast.POSITION.TOP_CENTER });
    } else {
      this.nextChange();
    }
  }

  cancel() {
    this.setState({
      nextCount: 4,
    });
    localStorage.setItem('imageUrl0', JSON.stringify(this.state.imageurl));
    localStorage.setItem('cardImg', JSON.stringify(this.state.cardImg));
    localStorage.setItem('coverImg', JSON.stringify(this.state.coverImg));
  }

  // Function setUpload(),setCrop() & setDetails() are used to change the layout from header clicks.
  setUpload() {
    const count = 1;
    this.setState({
      nextCount: count,
    });
  }
  setCrop() {
    const imageUrl = JSON.parse(localStorage.getItem('imageUrl0'));
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
    let cardImg = JSON.parse(localStorage.getItem('cardImg')),
      coverImg = JSON.parse(localStorage.getItem('coverImg'));
    if (cardImg == null || coverImg == null) {
      toast.error('Please Crop Images', { position: toast.POSITION.TOP_CENTER });
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
  }

  render() {
    if (this.state.nextCount == 2) {
      return (
        <div className="no-drag drag-event">
          <ImgCrop
            nextChange={this.checkCropData.bind(this)}
            setUpload={this.setUpload.bind(this)}
            setCrop={this.setCrop.bind(this)}
            setDetails={this.setDetails.bind(this)}
            ID={this.props.ID}
            delete={this.props.delete}
            from="photo"
          />
        </div>
      );
    } else if (this.state.nextCount == 3) {
      return (
        <div className="no-drag drag-event">
          <ImgDetails
            setUpload={this.setUpload.bind(this)}
            setCrop={this.setCrop.bind(this)}
            setDetails={this.setDetails.bind(this)}
            ID={this.props.ID}
            ChangePreview={this.ChangePreview.bind(this)}
            delete={this.props.delete}
            cancel={this.cancel.bind(this)}
            from="photo"
          />
        </div>
      );
    } else if (this.state.nextCount == 4) {
      return (
        <div className="no-drag drag-event">
          <ImgPreview
            setUpload={this.setUpload.bind(this)}
            setCrop={this.setCrop.bind(this)}
            setDetails={this.setDetails.bind(this)}
            ID={this.props.ID}
            delete={this.props.delete}
            handleOpenParagraph={this.handleOpenParagraph.bind(this)}
            from="photo"
            check_opened_module={this.props.check_opened_module}
          />
        </div>
      );
    }
    return (
      <div className="no-drag drag-event">
        <ImgUpload
          nextChange={this.nextChange.bind(this)}
          setUpload={this.setUpload.bind(this)}
          setCrop={this.setCrop.bind(this)}
          setDetails={this.setDetails.bind(this)}
          ID={this.props.ID}
          delete={this.props.delete}
          from="photo"
          reRender={this.state.reRender}
          check_opened_module={this.props.check_opened_module}
        />
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
