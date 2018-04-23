import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';
import { Redirect } from 'react-router-dom';
import FromRisorso from './FromRisorso';
import FromAnotherResource from './FromAnotherResource';

class RelatedArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptions: true,
      fromRisorso: true,
      fromAnotherRisorso: false,
      colorFromRisorso: true,
      colorAnotherResource: false,
      callProp: this.props.callRender,
      check_opened_module: this.props.check_opened_module,
    };
  }

  openSelectOptions() {
    const test = this.state.check_opened_module();
    if (test) {
      this.setState({
        selectOptions: !this.state.selectOptions,
        fromRisorso: true,
        fromAnotherResource: false,
      });
    }
  }

  componentDidMount() {
    const myurl = JSON.parse(localStorage.getItem('fromAnotherResource'));
    if (this.props.open == false) {
      this.setState({ selectOptions: false });
      this.setState({ fromRisorso: false });
    }
  }

  selectOptions() {
    if (this.state.selectOptions) {
      return (
        <ul className="text-muted no-drag drag-event">
          <li
            className={
              this.state.colorFromRisorso ? 'colorChange no-drag drag-event' : 'no-drag drag-event'
            }
            id="From-Risorso"
            onClick={this.fromRisorso.bind(this)}
          >
            <i
              className="ico-icon35 no-drag drag-event"
              aria-hidden="true"
              data-toggle="tooltip"
              data-placement="top"
              title="From Risoso"
            />
            From Risorso
          </li>
          <li
            className={
              this.state.colorAnotherResource
                ? 'colorChange no-drag drag-event'
                : 'no-drag drag-event'
            }
            id="From-Another-Resource"
            onClick={this.fromRisorso.bind(this)}
          >
            <i
              className="ico-icon38 no-drag drag-event"
              aria-hidden="true"
              data-toggle="tooltip"
              data-placement="top"
              title="From Risoso"
            />
            From Another Resource
          </li>
        </ul>
      );
    }
  }

  fromRisorso(e) {
    if (e.target.id == 'From-Another-Resource') {
      this.setState({
        fromAnotherRisorso: true,
        fromRisorso: false,
        colorAnotherResource: true,
        colorFromRisorso: false,
      });
    } else {
      this.setState({
        fromAnotherRisorso: false,
        fromRisorso: true,
        colorAnotherResource: false,
        colorFromRisorso: true,
      });
    }
  }

  savedAnotherResource() {
    this.setState({
      selectOptions: false,
      fromAnotherRisorso: false,
      fromRisorso: false,
    });
    // this.renderData();
  }

  viewExternalUrl(url) {
    window.open(url, '_blank');
  }

  renderData() {
    if (this.state.fromRisorso) {
      return <FromRisorso callRender={this.props.callRender} />;
    } else if (this.state.fromAnotherRisorso) {
      return (
        <FromAnotherResource
          savedarticle={this.savedAnotherResource.bind(this)}
          ID={this.props.ID}
          callRender={this.props.callRender}
          value={this.props.value}
          list={this.props.list}
        />
      );
    }
    const data = this.props.value;

    if (data) {
      setTimeout(() => {
        const childNodes = document.getElementById('relatedEditable').childNodes;
        if (childNodes.length > 0) {
          for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType != Node.TEXT_NODE) {
              childNodes[i].removeAttribute('style');
            }
          }
        }
      }, 100);
      let img;
      if (data.image.length == 0) {
        img = <img className="no-drag drag-event" src="../assets/images/no-image-available.png" />;
      } else {
        img = <img className="no-drag drag-event" src={data.image} />;
      }
      return (
        <div
          className="preview_otherSource no-drag drag-event"
          onClick={this.viewExternalUrl.bind(this, data.externalUrl)}
        >
          <div className="col-sm-4 no-drag drag-event">
            <div className="preview_otherSource_card no-drag drag-event">
              <div className="preview_otherSource_imgPart no-drag drag-event">
                {img}
              </div>
              <div className="related-article-info">
                <div className="related-article-host">
                  <p>
                    {data.host}
                  </p>
                </div>
                <div className="preview_otherSource_dataPart no-drag drag-event">
                  <div className="title no-drag drag-event">
                    {data.title}
                  </div>
                  <div className="description text-muted no-drag drag-event">
                    {data.des}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="relatedEditable"
            className="col-sm-8 preview_otherSource_text text-muted no-drag drag-event"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      );
    }
  }

  render() {
    const selectOptions = this.selectOptions();
    const renderData = this.renderData();
    return (
      <div className="parentSection related-article ret-atc-wrp no-drag drag-event">
        <div className="childSection1 sub-header text-center no-drag drag-event">
          <h6 className="no-drag drag-event">Related Article</h6>
          <span className="select-source no-drag drag-event">
            {selectOptions}
          </span>
          <ul className="text-muted related-article-list pull-right no-drag drag-event">
            <li className="no-drag drag-event">
              <img
                className={
                  this.state.selectOptions ? 'opened no-drag drag-event' : 'no-drag drag-event'
                }
                src="../assets/images/user-profile/article-icon-1.png"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
                onClick={this.openSelectOptions.bind(this)}
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
                className="no-drag drag-event"
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
          {renderData}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const relatedArticle = state;
  return { relatedArticle };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RelatedArticle);
