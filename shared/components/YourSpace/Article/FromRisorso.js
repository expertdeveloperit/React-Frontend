import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';
import { Redirect } from 'react-router-dom';

class FromRisorso extends Component {
  constructor(props) {
    super(props);
  }

  submitFromRosorso() {}

  handleCancel() {
    this.props.callRender();
  }

  render() {
    return (
      <div className="risorso-search no-drag drag-event">
        <form className="no-drag drag-event opened">
          <input
            className="form-control text-center no-drag drag-event "
            type="text"
            name="fromRisorso"
            placeholder="Search in Risorso"
            disabled
            autoFocus
          />
          <div className=" risorso-search-warpper no-drag drag-event">
            <div className="risorso-search-box no-drag drag-event">
              <span className="risorso-img no-drag drag-event">
                <img className="no-drag drag-event" src="../assets/images/uplode-icon.png" />
              </span>
              <span className="risorso-contact no-drag drag-event">
                <p className="no-drag drag-event">Siyah ve Beyaz Hareketleri Gjon tarafından</p>
                <ul className="no-drag drag-event">
                  <li className="no-drag drag-event">
                    <a href="#">Food</a>
                  </li>
                  <li className="text-right no-drag drag-event">
                    <a href="#">John Dead</a>
                  </li>
                </ul>
              </span>
            </div>
            <div className="risorso-search-box no-drag drag-event">
              <span className="risorso-img no-drag drag-event">
                <img className="no-drag drag-event" src="../assets/images/uplode-icon.png" />
              </span>
              <span className="risorso-contact no-drag drag-event">
                <p className="no-drag drag-event">Siyah ve Beyaz Hareketleri Gjon tarafından</p>
                <ul className="no-drag drag-event">
                  <li className="no-drag drag-event">
                    <a href="#">Food</a>
                  </li>
                  <li className="text-right no-drag drag-event">
                    <a href="#">John Dead</a>
                  </li>
                </ul>
              </span>
            </div>
          </div>
          <div className="text-right risorso-search-btn no-drag drag-event">
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
              className="submit_button append-margin contentBtnForHover no-drag drag-event"
              onClick={this.submitFromRosorso.bind(this)}
            />
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const fromRisorso = state;
  return { fromRisorso };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(FromRisorso);
