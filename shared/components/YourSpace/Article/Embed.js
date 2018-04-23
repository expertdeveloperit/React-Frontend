import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';

class Embed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frameURI: '',
      showEditEmbed: true,
      callRender: this.props.callRender,
      check_opened_module: this.props.check_opened_module,
      title: '',
      description: '',
    };
  }

  componentDidMount() {
    const localData = JSON.parse(localStorage.getItem('article_data'));
    if (localData) {
      localData.map((data) => {
        if (data.type == 'embed') {
          if (data.id == this.props.ID) {
            this.setState({
              frameURI: data.content,
              title: data.title,
              description: data.description,
              showEditEmbed: false,
            });
          }
        }
      });
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

  detectChange(e) {
    if (e.target.dataset.id === 'frameURI') {
      this.setState({
        frameURI: e.target.value,
      });
    } else if (e.target.dataset.id === 'title') {
      this.setState({
        title: e.target.value,
      });
    } else if (e.target.dataset.id === 'description') {
      this.setState({
        description: e.target.value,
      });
    }
  }

  getIframelyHtml() {
    return { __html: this.props.value };
  }

  handleOpen(e) {
    e.preventDefault();
    const test = this.state.check_opened_module();
    if (test) {
      this.setState({
        showEditEmbed: true,
      });
    }
  }

  handleCancel(e) {
    e.preventDefault();
    const frameURI = '';
    if (this.props.value == undefined) {
      this.props.callRender();
      // toast.error("Field can't be empty! Delete Instead", { position: toast.POSITION.TOP_CENTER });
      // return false;
    }
    this.setState({
      showEditEmbed: !this.state.showEditEmbed,
    });
    return true;
  }

  handleSave(e) {
    e.preventDefault();
    const localData = JSON.parse(localStorage.getItem('article_data'));
    if (localData) {
      if (this.state.frameURI) {
        let check = false;
        const map = localData.map((data) => {
          if (e.target.id == data.id) {
            data.id = data.id;
            data.type = 'embed';
            data.content = this.state.frameURI;
            data.title = this.state.title;
            data.description = this.state.description;
            data.rank = data.rank;
            check = true;
          }
        });
        if (check) {
          localStorage.setItem('article_data', JSON.stringify(localData));
        } else {
          var data = {
            id: this.props.ID,
            type: 'embed',
            content: this.state.frameURI,
            title: this.state.title,
            description: this.state.description,
            rank: this.props.list.length,
          };
          let temp = {};
          temp = localData;
          temp.push(data);
          localStorage.setItem('article_data', JSON.stringify(temp));
        }
      } else {
        toast.error("Embed can't be empty! Delete instead", {
          position: toast.POSITION.TOP_CENTER,
        });
        return false;
      }
    } else {
      var data = [
        {
          id: this.props.ID,
          type: 'embed',
          content: this.state.frameURI,
          rank: this.props.list.length,
        },
      ];
      localStorage.setItem('article_data', JSON.stringify(data));
    }
    this.setState({
      showEditEmbed: false,
    });
    this.state.callRender();
  }

  formMode() {
    if (this.props.open || this.state.showEditEmbed) {
      return (
        <div className=" embededjs no-drag drag-event">
          <form className="no-drag drag-event opened">
            <div className="embedControl no-drag drag-event">
              <input
                data-id="frameURI"
                className="form-control no-drag drag-event embedInput"
                type="text"
                name="fromRisorso"
                placeholder="Paste The Embeded Code Here"
                value={this.state.frameURI}
                onChange={this.detectChange.bind(this)}
              />
              <button
                className="btn post-btn no-drag drag-event embedPaste"
                data-id={this.props.ID}
              >
                Paste
              </button>
            </div>
            {this.state.frameURI != ''
              ? <div className="dataTrue clear-both no-drag drag-event">
                <div
                  className="embed no-drag drag-event col-xs-5 col-sm-5 col-md-5"
                  dangerouslySetInnerHTML={{ __html: this.state.frameURI }}
                />
                <div className="embedData no-drag drag-event col-xs-7 col-sm-7 col-md-7">
                  <input
                    data-id="title"
                    className="form-control no-drag drag-event embedInput"
                    type="text"
                    name="fromRisorso"
                    placeholder="Title Here"
                    value={this.state.title}
                    onChange={this.detectChange.bind(this)}
                  />
                  <input
                    data-id="description"
                    className="form-control no-drag drag-event embedInput"
                    type="text"
                    name="fromRisorso"
                    placeholder="Description Here"
                    value={this.state.description}
                    onChange={this.detectChange.bind(this)}
                  />
                </div>
                <div className="text-right embedButtons risorso-search-btn no-drag drag-event col-xs-7 col-sm-7 col-md-7">
                  <button
                    id={this.props.ID}
                    className="cancelBtn contentBtnForHover no-drag drag-event"
                    onClick={this.handleCancel.bind(this)}
                  >
                      Cancel
                    </button>
                  <input
                    autoFocus
                    id={this.props.ID}
                    type="submit"
                    name="AboutUs_submit"
                    value="Save"
                    className="submit_button contentBtnForHover append-margin no-drag drag-event"
                    onClick={this.handleSave.bind(this)}
                  />
                </div>
              </div>
              : <div className="text-right risorso-search-btn no-drag drag-event">
                <button
                  id={this.props.ID}
                  className="cancelBtn contentBtnForHover no-drag drag-event"
                  onClick={this.handleCancel.bind(this)}
                >
                    Cancel
                  </button>
                <input
                  autoFocus
                  id={this.props.ID}
                  type="submit"
                  name="AboutUs_submit"
                  value="Save"
                  className="submit_button contentBtnForHover append-margin no-drag drag-event"
                  onClick={this.handleSave.bind(this)}
                />
              </div>}
          </form>
        </div>
      );
    }
    return (
      <div className="embedPreview no-drag drag-event">
        <p className="embedPreviewTitle text-center">
          {this.state.title}
        </p>
        <div
          className="embedPreview text-center no-drag drag-event"
          dangerouslySetInnerHTML={this.getIframelyHtml()}
        />
        <p className="embedPreviewDescription text-center text-muted">
          {this.state.description}
        </p>
      </div>
    );
  }

  render() {
    const embed = this.formMode();
    return (
      <div className="parentSection related-article no-drag drag-event">
        <div className="childSection1 sub-header text-center no-drag drag-event">
          <h6 className="no-drag drag-event">Embed Article</h6>
          <ul className="text-muted pull-right no-drag drag-event">
            <li className="no-drag drag-event">
              <img
                className={
                  this.state.showEditEmbed
                    ? 'display-none no-drag drag-event'
                    : 'no-drag drag-event'
                }
                src="../assets/images/user-profile/article-icon-1.png"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
                onClick={this.handleOpen.bind(this)}
              />
            </li>
            <li className="no-drag drag-event">
              <img
                className="no-drag drag-event"
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
                id={this.props.ID}
                onClick={this.props.delete}
                src="../assets/images/user-profile/article-icon-2.png"
              />
            </li>
            <li className="no-drag drag-event">
              <img
                className={
                  this.state.showEditEmbed
                    ? 'display-none no-drag drag-event'
                    : 'no-drag drag-event'
                }
                data-toggle="tooltip"
                data-placement="top"
                title="Drag"
                src="../assets/images/user-profile/article-icon-3.png"
                onMouseDown={this.props.removeNoDrag}
                onMouseUp={this.props.addNoDrag}
              />
            </li>
          </ul>
        </div>
        <div className="childsection2 no-drag drag-event">
          {embed}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const Embed = state;
  return { Embed };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Embed);
