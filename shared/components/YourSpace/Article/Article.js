import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Sidebar from './Sidebar/Sidebar';
import MainTitle from './MainTitle';
import ContentDescription from './ContentDescription';
import Category from './Category';
import Channel from './Channel';
import Subtitle from './SubTitle';
import Paragraph from './Paragraph';
import Quote from './Quote';
import Separator from './Separator';
import Photo from './Photo';
import Image from './Image';
import DragSortableList from '../../react-drag-sortable/lib/index';
import interact from 'interactjs';
import ArticleHeader from './ArticleHeader';
import RelatedArticle from './RelatedArticle';
import { Redirect, NavLink } from 'react-router-dom';
import ImageCreation from './ImageCreation/ImageCreation';
import { ToastContainer, toast } from 'react-toastify';
import Embed from './Embed';

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      localData: [],
      open: false,
      modal: false,
      componentUpdate: true,
      elements: [],
      render: true,
      test: true,
      check_opened_module: false,
    };
  }

  componentDidMount() {
    const localData = JSON.parse(localStorage.getItem('article_data'));
    if (localData) {
      if (localData.length > 0) {
        let check = 0;
        localData.map((data) => {
          check = data.id;
          this.setState({ count: check });
        });
      }
    }
    if (localData !== '') {
      this.setState({
        localData: this.state.localData.concat(localData),
        // paragraph: this.state.localData.concat(localData),
      });
    }
  }

  componentDidUpdate(nextProps) {
    const testNode = ReactDOM.findDOMNode(this.refs.test);
    setTimeout(() => {
      window.scrollTo(0, testNode.offsetTop);
    }, 500);
  }

  add(check) {
    const test1 = this.check_opened_module();
    if (test1) {
      if (check == 'photo') {
        this.setState({
          render: false,
          componentUpdate: false,
        });
      }
      // this.setState({
      //   componentUpdate: true,
      // });
      const count = ++this.state.count;
      const newData = [
        {
          id: count,
          rank: count,
          type: check,
        },
      ];
      this.setState({
        elements: newData,
      });
      window.scrollTo(0, window.innerHeight);
    } else {
      // toast.error('Save draged module first', { position: toast.POSITION.TOP_CENTER });
      // alert('Save draged module first');
      return false;
    }
  }

  delete(e) {
    this.setState({
      componentUpdate: true,
    });
    const id = e.target.id;
    let parent;
    let parent_deleted_only = false;
    let deleted_parent_id;
    const test = JSON.parse(localStorage.getItem('article_data'));
    if (test != null) {
      if (test.length > 0) {
        const check = false;

        // retrieve parent_id if item to be deleted is a child subtitle
        test.map((data) => {
          if (data.id == e.target.id) {
            if (data.parent_id) {
              parent = data.parent_id;
            }
          }
        });
        let deleted;
        test.map((data) => {
          if (data.type == 'subtitle') {
            if (data.id == id) {
              if (data.child_ids.length == 0) {
                deleted = test.filter(data => id != data.id);
              } else {
                const confirm = window.confirm(
                  'Do you want to delete all its connected Subtitles? \n\n If yes click "OK" \n\n Otherwise click "Cancel", it will delete respective Subtitle only.',
                );
                if (confirm) {
                  // delete all its child/desendends subtitles

                  // deleting grandparent
                  const test_deleted = test.filter(data => id != data.id);

                  // before deleting  parent gets its child
                  const child = test_deleted.filter(data => data.parent_id == id);
                  const arr = [];
                  child.map((data) => {
                    data.child_ids.map(m => arr.push(m));
                  });

                  // deleting parent
                  let test2_deleted = test_deleted.filter(data => id != data.parent_id);

                  // deleting child
                  arr.map((data) => {
                    test2_deleted = test2_deleted.filter(dd => dd.id != data);
                  });
                  deleted = test2_deleted;
                } else {
                  // deleting only grand parent
                  parent_deleted_only = true;
                  deleted_parent_id = data.id;
                  deleted = test.filter(data => id != data.id);
                }
              }
            }
            // new ends
          } else {
            deleted = test.filter(data => id != data.id);
          }
        });

        // const deleted = test.filter(data => id != data.id);
        localStorage.removeItem(`gallery${id}`);
        localStorage.removeItem(`imageUrl${e.target.id}`);
        localStorage.setItem('article_data', JSON.stringify(deleted));

        // to update parent subtitle if child deleted
        const localData = JSON.parse(localStorage.getItem('article_data'));
        if (parent) {
          localData.map((data) => {
            if (data.id == parent) {
              const myarr = data.child_ids.filter(child => child != id);
              data.child_ids = myarr;
            }
          });
          localStorage.setItem('article_data', JSON.stringify(localData));
        }

        // to update child subtitle if its parent deleted
        const localData2 = JSON.parse(localStorage.getItem('article_data'));
        if (parent_deleted_only) {
          localData2.map((data) => {
            if (data.parent_id == deleted_parent_id) {
              delete data.parent_id;
            }
          });
          localStorage.setItem('article_data', JSON.stringify(localData2));
        }

        this.callRender();
      } else {
        localStorage.removeItem('article_data');
        localStorage.removeItem(`gallery${id}`);
        localStorage.removeItem(`imageUrl${id}`);
        const deleted = this.state.elements.filter(data => id != data.id);
        this.setState({
          elements: deleted,
        });
      }
    } else {
      localStorage.removeItem(`gallery${id}`);
      localStorage.removeItem(`imageUrl${id}`);
      const deleted = this.state.elements.filter(data => id != data.id);
      this.setState({
        elements: deleted,
      });
    }
  }

  checkData(e) {
    let mainTitle = JSON.parse(localStorage.getItem('mainTitle')),
      channel_data = JSON.parse(localStorage.getItem('channel_data')),
      category_data = JSON.parse(localStorage.getItem('category_data')),
      content_description = JSON.parse(localStorage.getItem('content_description')),
      featuring_data = JSON.parse(localStorage.getItem('featuring_data'));
    if (mainTitle == null || featuring_data == null) {
      toast.error('Please enter the Main Title and Featuring Image...', {
        position: toast.POSITION.TOP_CENTER,
      });
      e.preventDefault();
      return false;
    } else if (channel_data == null || category_data == null || content_description == null) {
      this.setState({
        modal: true,
      });
      e.preventDefault();
      return false;
    }
    return true;
  }

  modalOpen() {
    if (this.state.modal) {
      return (
        <div className="modal modalParent">
          <div className="modal-dialog modal-lg">
            <div className="modal-container">
              <div className="modal-header articleDataModal">
                <button
                  type="button"
                  className="close"
                  onClick={this.modalCloseNoRedirect.bind(this)}
                >
                  <img
                    src="../assets/images/close.png"
                    onClick={this.modalCloseNoRedirect.bind(this)}
                  />
                </button>
                <h4 className="modal-title">Please Fill</h4>
              </div>
              <div className="modal-body">
                <Channel />
                <Category />
                <ContentDescription />
              </div>
              <div className="modal-footer">
                <NavLink to="/previewarticle">
                  <button type="button" className="btn-save" onClick={this.modalClose.bind(this)}>
                    Save
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  modalCloseNoRedirect() {
    this.setState({ modal: false });
  }

  modalClose(e) {
    let channel_data = JSON.parse(localStorage.getItem('channel_data')),
      category_data = JSON.parse(localStorage.getItem('category_data')),
      content_description = JSON.parse(localStorage.getItem('content_description'));

    if (channel_data == null || category_data == null || content_description == null) {
      toast.error('Please Fill all the fields', { position: toast.POSITION.TOP_CENTER });
      this.setState({
        modal: true,
      });
      // this.modalOpen()
      e.preventDefault();
      return false;
    }
    this.setState({
      modal: false,
      componentUpdate: true,
    });
  }

  removeNoDrag(e) {
    const drag = document.getElementsByClassName('no-drag');
    while (drag.length) {
      drag[0].classList.add('dragevent');
      drag[0].classList.remove('no-drag');
    }
    // const all = document.querySelectorAll('div.dragged');
    // const cur = e.target.id;
    // const elm = document.getElementById(cur).parentNode.parentNode;
  }

  addNoDrag(e) {
    const dragevent = document.getElementsByClassName('dragevent');
    while (dragevent.length) {
      dragevent[0].classList.add('no-drag');
      dragevent[0].classList.remove('dragevent');
    }
  }

  /*
    Function onSort(sortedList, dropEvent) is used when a user drags or drop some component.
  */
  onSort(sortedList, dropEvent) {
    const data = JSON.parse(localStorage.getItem('article_data'));
    const reduce = sortedList.reduce(
      (map, item) => map.set(item.content.props.ID, item.rank),
      new Map(),
    );
    const result = data.map(check =>
      Object.defineProperty(check, 'rank', {
        value: reduce.get(check.id),
      }),
    );
    result.sort((a, b) => a.rank - b.rank);
    localStorage.setItem('article_data', JSON.stringify(result));
  }

  /*
    Function callRender() is used for re-rendering all data of localStorage to other components for stability.
  */
  callRender() {
    this.setState({
      elements: [],
    });
    const localData = JSON.parse(localStorage.getItem('article_data'));
    if (localData !== '') {
      this.setState({
        localData,
      });
    }
  }

  test() {
    this.setState({
      test: false,
    });
  }

  check_opened_module() {
    const obj = document.getElementsByClassName('opened');

    if (obj.length >= 1) {
      toast.error('Save previous module first!', { position: toast.POSITION.TOP_CENTER });
      this.opened = true;
      return false;
    }
    this.opened = false;
    return true;
  }

  render() {
    const article_elements = [];
    const list = [];
    const modal = this.modalOpen();
    const components = {
      paragraph: Paragraph,
      subtitle: Subtitle,
      quote: Quote,
      seperator: Separator,
      relatedArticle: RelatedArticle,
      photo: Image,
      embed: Embed,
      imageCreation: ImageCreation,
    };

    let check;
    /* Check if there is any data in localStorage if yes it will display it in the article. */
    if (this.state.localData) {
      check = 'form local data';
      if (this.state.localData.length != 0) {
        if (this.state.localData[0] != null) {
          if (this.state.localData.length > 0) {
            this.state.localData.map((data) => {
              if (data.type == 'paragraph') {
                list.push({
                  content: (
                    <Paragraph
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.content}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              } else if (data.type == 'subtitle') {
                list.push({
                  content: (
                    <Subtitle
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.content}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              } else if (data.type == 'quote') {
                list.push({
                  content: (
                    <Quote
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.content}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              } else if (data.type == 'seperator') {
                list.push({
                  content: (
                    <Separator
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.content}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              } else if (data.type == 'relatedArticle') {
                list.push({
                  content: (
                    <RelatedArticle
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.fromAnotherResource}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              } else if (data.type == 'photo') {
                list.push({
                  content: (
                    <Image
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.content}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      setRender={this.callRender.bind(this)}
                      test={this.test.bind(this)}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              } else if (data.type == 'embed') {
                list.push({
                  content: (
                    <Embed
                      key={data.id}
                      ID={data.id}
                      rank={data.id}
                      delete={this.delete.bind(this)}
                      list={list}
                      type={data.type}
                      value={data.content}
                      callRender={this.callRender.bind(this)}
                      open={false}
                      addNoDrag={this.addNoDrag.bind(this)}
                      removeNoDrag={this.removeNoDrag.bind(this)}
                      setRender={this.callRender.bind(this)}
                      test={this.test.bind(this)}
                      check_opened_module={this.check_opened_module.bind(this)}
                    />
                  ),
                });
              }
            });
          }
        }
      }
    }
    /* Check If new Component is to be added */
    if (this.state.elements.length > 0) {
      const lastElement = this.state.elements.slice(-1)[0];
      this.state.elements.map((data) => {
        if (this.opened) {
          data.type = 'no allowed';
        }

        if (data.type == 'paragraph') {
          list.push({
            content: (
              <Paragraph
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'subtitle') {
          list.push({
            content: (
              <Subtitle
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'photo') {
          list.push({
            content: (
              <Image
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                setRender={this.callRender.bind(this)}
                test={this.test.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'separator') {
          list.push({
            content: (
              <Separator
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'quote') {
          list.push({
            content: (
              <Quote
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'related') {
          list.push({
            content: (
              <RelatedArticle
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'imageCreation') {
          list.push({
            content: (
              <ImageCreation
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        } else if (data.type == 'embed') {
          list.push({
            content: (
              <Embed
                key={data.id}
                ID={data.id}
                delete={this.delete.bind(this)}
                list={list}
                type={data.type}
                rank={data.id}
                callRender={this.callRender.bind(this)}
                open
                addNoDrag={this.addNoDrag.bind(this)}
                removeNoDrag={this.removeNoDrag.bind(this)}
                check_opened_module={this.check_opened_module.bind(this)}
              />
            ),
          });
        }
      });
    }

    const placeholder = <div className="placeholderContent">Drop Here!!!</div>;
    return (
      <div className="container">
        <div className="row">
          <div className="userprofile-sidebar">
            <Sidebar
              addParagraph={this.add.bind(this, 'paragraph')}
              addSubTitle={this.add.bind(this, 'subtitle')}
              addPhoto={this.add.bind(this, 'photo')}
              addQuote={this.add.bind(this, 'quote')}
              addSeparator={this.add.bind(this, 'separator')}
              addRelatedArticle={this.add.bind(this, 'related')}
              addImageCreation={this.add.bind(this, 'imageCreation')}
              addEmbed={this.add.bind(this, 'embed')}
            />
          </div>
          <div className="userprofile-main add-userprofile">
            <ArticleHeader
              checkData={this.checkData.bind(this)}
              check_opened_module={this.check_opened_module.bind(this)}
            />
            <MainTitle check_opened_module={this.check_opened_module.bind(this)} />
            <Photo
              key={this.state.count}
              ID={0}
              rank={this.state.count}
              delete={this.delete.bind(this)}
              list={list}
              type="photo"
              callRender={this.callRender.bind(this)}
              render={this.state.render}
              check_opened_module={this.check_opened_module.bind(this)}
            />
            <DragSortableList
              items={list}
              placeholder={placeholder}
              onSort={this.onSort.bind(this)}
              type="vertical"
            />
          </div>
        </div>
        {modal}
        <div ref="test" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const Article = state;
  return { Article };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
