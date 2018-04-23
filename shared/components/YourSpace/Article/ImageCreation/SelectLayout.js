import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class SelectLayout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  select(e) {
    let id = e.target.id,
      elem = document.getElementById(id),
      rest_elem = document.getElementsByClassName('create');
    for (let i = 0; i < rest_elem.length; i++) {
      rest_elem[i].classList.remove('current');
    }
    elem.classList.add('current');
    this.setState({
      selected: id,
    });
    const data = [
      {
        count: 2,
        type: id,
      },
    ];
    localStorage.setItem('collection', JSON.stringify(data));
    this.props.select(id);
  }

  alert(e) {
    alert('Image Creation is under Development');
  }

  render() {
    return (
      <div className="parentSection no-drag drag-event">
        <div className="childSection1 sub-header no-drag drag-event">
          <h6 className="no-drag drag-event">Image Creation</h6>
        </div>
        <div className="childsection2 createImage no-drag drag-event">
          <h3 className="create_style no-drag drag-event">Select layout</h3>
          <div className="container-wrapper no-drag drag-event">
            <div className="col-sm-3 layout1 no-drag drag-event">
              <img
                className="create no-drag drag-event"
                id="layout1"
                src="../assets/images/select_layout/layout1.png"
                onClick={this.select.bind(this)}
                alt="layout1"
              />
            </div>
            <div className="col-sm-3 layout2 no-drag drag-event">
              <img
                className="create no-drag drag-event"
                id="layout2"
                src="../assets/images/select_layout/layout2.png"
                onClick={this.select.bind(this)}
                alt="layout2"
              />
            </div>
            <div className="col-sm-3 layout3 no-drag drag-event">
              <img
                className="create no-drag drag-event"
                id="layout3"
                src="../assets/images/select_layout/layout3.png"
                onClick={this.select.bind(this)}
                alt="layout3"
              />
            </div>
            <div className="col-sm-3 layout3 no-drag drag-event">
              <img
                className="create no-drag drag-event"
                id="layout4"
                src="../assets/images/select_layout/layout4.png"
                onClick={this.select.bind(this)}
                alt="layout4"
              />
            </div>
          </div>
        </div>
        <div className="text-right next_button no-drag drag-event">
          <button
            className="btn btn-success green-button no-drag drag-event"
            onClick={this.props.nextChange}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const SelectLayout = state;
  return { SelectLayout };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectLayout);
