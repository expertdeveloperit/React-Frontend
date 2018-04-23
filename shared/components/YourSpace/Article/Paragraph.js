import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import TranslationScreen from './TranslationScreen';

class Paragraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditParagraph: false,
      paragraph: '',
      localData: [],
      callProp: this.props.callRender,
      check_opened_module: this.props.check_opened_module,
      bold: false,
      italic: false,
      link: false,
      reference: false,
      translationScreen: false
    };
  }

  componentWillMount() {}

  componentDidMount() {
    if (this.props.open) {
      document.getElementById('editableDiv').focus();
      this.setState({
        showEditParagraph: true,
      });
      this.addClass.bind(this);
    }
    const mydiv = document.getElementsByClassName('addDrag');
    const child = [];
    for (let j = 0; j < mydiv.length; j++) {
      child.push(mydiv[j].getElementsByTagName('*'));
    }
    for (let i = 0; i < child[0].length; i++) {
      child[0][i].classList.add('no-drag');
    }
  }

  addClass() {
    const mydiv = document.getElementsByClassName('paragraphEdit');
    const child = [];
    for (let j = 0; j < mydiv.length; j++) {
      child.push(mydiv[j].getElementsByTagName('*'));
    }
    for (let i = 0; i < child[0].length; i++) {
      child[0][i].classList.add('no-drag drag-event');
    }
  }

  /*
    Function handleOpenParagraph(e) is used to maintain the stability for editting mode of component.
  */
  handleOpenParagraph(e) {
    const test = this.state.check_opened_module();
    const value = this.props.value;
    if (test) {
      this.setState({
        paragraph: value,
        showEditParagraph: true,
      });
    }
  }

  /*
    Function submitParagraph(e) is used to handle the submit action of paragraph when clicked on save.
  */
  submitParagraph(e) {
    e.preventDefault();
    const elem = document.getElementsByClassName('paragraphEdit');
    const paragraph = elem[0].innerHTML;
    this.setState({
      paragraph,
    });
    if (paragraph == '') {
      toast.error("Field can't be empty. Delete instead", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    this.setState({
      showEditParagraph: !this.state.showEditParagraph,
    });

    /* Check if there is any data in localStorage or not if not will make a new localStorage */
    if (JSON.parse(localStorage.getItem('article_data')) == null) {
      var newData = [
        {
          id: this.props.ID,
          type: 'paragraph',
          content: paragraph,
          rank: this.props.list.length,
        },
      ];
      localStorage.setItem('article_data', JSON.stringify(newData));
    } else {
      /* Check if there is any data in localStorage or not if yes will check for update the entry or append new */
      let check = false;
      const localData = JSON.parse(localStorage.getItem('article_data'));

      /* Mapping for updation */
      const mapping = localData.map((data) => {
        /* Condition for update if the clicked id or id in localstorage match */
        if (e.target.id == data.id) {
          data.id = data.id;
          data.type = 'paragraph';
          data.content = paragraph;
          data.rank = data.rank;
          check = true;
        }
      });

      /* If id matches in above condition then check will be true and new array of localData will be updated */
      if (check) {
        localStorage.setItem('article_data', JSON.stringify(localData));
      } else {
        /* If id not match then it will make append a new entry in the localStorage */
        this.state.callProp();
        let temp = {};
        temp = localData;
        var newData = {
          id: this.props.ID,
          type: 'paragraph',
          content: paragraph,
          rank: this.props.list.length,
        };
        temp.push(newData);
        localStorage.setItem('article_data', JSON.stringify(temp));
      }
    }
    this.state.callProp();
  }

  /*
    Function handleParagraphInput(e) is used to maintaining data when an input fiels is changes.
  */
  handleParagraphInput(e) {
    this.setState({ paragraph: e.target.innerHTML });
  }

  /*
    Function handleCancel() is used to main the stability of edit mode when cancel button is clicked.
  */
  handleCancel(e) {
    e.preventDefault();
    if (this.props.value == undefined) {
      this.props.callRender();
      // return false;
    }
    this.setState({
      showEditParagraph: !this.state.showEditParagraph,
    });
    return true;
  }

  /*
    Remove Unwanted styling
  */
  removeAttribute(e) {
    // e.preventDefault();
    setTimeout(() => {
      var childNodes = document.getElementById('editableDiv').childNodes;
      if (childNodes.length > 0) {
        for (let i = 0; i < childNodes.length; i++) {
          if (childNodes[i].nodeType != Node.TEXT_NODE) {
            childNodes[i].removeAttribute('style');
          }
        }
      }
      const mydiv = document.getElementById('editableDiv');
      var childNodes = '';
      if (this.state.paragraph) {
        if (document.getElementById('editableDiv')) {
          document.getElementById('editableDiv').setAttribute('data-placeholder', '');
        }
      }
      if (mydiv != null) {
        const child = mydiv.getElementsByTagName('*');
        for (let i = 0; i < child.length; i++) {
          child[i].classList.add('no-drag');
        }
      }
    }, 10);
    if (document.getElementById('editableDiv')) {
      document.getElementById('editableDiv').setAttribute('data-placeholder', '');
    }
  }

  removePlaceholder(e) {
    const mydiv = document.getElementById('editableDiv');
    if (mydiv.innerHTML) {
      if (document.getElementById('editableDiv')) {
        document.getElementById('editableDiv').setAttribute('data-placeholder', '');
      }
    }
  }

  /*
    Function formData() contains the html for editable form.
  */
  formData() {
    setTimeout(() => {
      const mydiv = document.getElementById('editableDiv');
      const childNodes = '';
      if (this.state.paragraph) {
        // this.getSelection();
        if (document.getElementById('editableDiv')) {
          document.getElementById('editableDiv').setAttribute('data-placeholder', '');
        }
      }
      if (mydiv != null) {
        const child = mydiv.getElementsByTagName('*');
        for (let i = 0; i < child.length; i++) {
          child[i].classList.add('no-drag drag-event');
        }
      }
    }, 500);
    return (
      <form onSubmit={this.submitParagraph.bind(this)} className="no-drag drag-event opened">
        <div className="form-group no-drag drag-event">
          <div
            className="paragraphEdit editableDiv no-drag drag-event addDrag editable"
            id="editableDiv"
            contentEditable
            autoFocus
            data-placeholder="Enter some text"
            onChange={this.handleParagraphInput.bind(this)}
            dangerouslySetInnerHTML={{ __html: this.state.paragraph }}
            onPaste={this.removeAttribute.bind(this)}
            onBlur={this.removePlaceholder.bind(this)}
          />
        </div>
        <div className="text-right no-drag drag-event">
          <button
            id={this.props.ID}
            className="cancelBtn contentBtnForHover no-drag drag-event"
            onClick={this.handleCancel.bind(this)}
          >
            Cancel
          </button>
          <input
            id={this.props.ID}
            type="submit"
            name="AboutUs_submit"
            value="Save"
            className="submit_button contentBtnForHover append-margin saveBtn no-drag drag-event"
            onClick={this.submitParagraph.bind(this)}
          />
        </div>
      </form>
    );
  }

  /*
    Function pData() contains the html for non editable mode.
  */
  pData() {
    return (
      <div
        className="text-muted no-drag drag-event paragraphview addDrag"
        dangerouslySetInnerHTML={{ __html: this.props.value }}
      />
    );
  }

  /*
    Function translationData() contains the HTML for translation screen.
  */
  translationData(){
    console.log("translationData")
    return(
      <TranslationScreen />
    )
  }

  /*
    Function openParagraph() used make the component editable or non-editable.
  */
  openParagraph() {
    let formData = this.formData(),
      pData = this.pData();
    if (this.props.open || this.state.showEditParagraph) {
      return formData;
    } 
    return pData;
  }

  checkEdit(e) {
    e.preventDefault();
    setTimeout(() => {
      const mydiv = document.getElementById('editableDiv');
      const childNodes = '';
      if (mydiv != null) {
        const child = mydiv.getElementsByTagName('*');
        for (let i = 0; i < child.length; i++) {
          child[i].classList.add('no-drag');
        }
      }
    }, 500);
    if (e.target.dataset.id == 'bold') {
      document.execCommand(e.target.dataset.id, false, null);

      // this.setState({
      //   bold: !this.state.bold,
      // });
      // this.getSelection('bold', bold);
    }
    if (e.target.dataset.id == 'italic') {
      document.execCommand(e.target.dataset.id, false, null);
      // const italic = !this.state.italic;
      // this.setState({
      //   italic: !this.state.italic,
      // });
      // this.getSelection('italic', italic);
    }
    if (e.target.dataset.id == 'reference') {
      const reference = true;
      this.setState({
        reference,
      });
      this.getSelection('reference', reference);
    }
    if (e.target.dataset.id == 'link') {
      document.execCommand('createLink', false, prompt('Enter a URL', 'http://'));
      // const link = true;
      // this.setState({
      //   link
      // });
      // this.getSelection('link', link);
    } else {
    }
    // this.getSelection(e);
  }

  getSelection(mode, value) {
    // e.preventDefault();
    const elem = document.getElementById('editableDiv').innerHTML;
    const length = elem.length;
    const test = document.getElementById('editableDiv');
    test.selectionStart = 0;
    test.selectionEnd = 0;

    const text = window.getSelection ? window.getSelection() : document.selection.createRange();

    if (text.getRangeAt) {
      const range = text.getRangeAt(0);
      switch (mode) {
        case 'bold':
        //   if (value == true) {
        //     var newNode = document.createElement('b');
        //     range.surroundContents(newNode);
        //   } else {
        //     document.getElementById('editableDiv').innerHTML = `${elem}&#8203`;
        //   }
        //   break;
        // case 'italic':
        //   if (value == true) {
        //     var newNode = document.createElement('i');
        //     range.surroundContents(newNode);
        //   } else {
        //     document.getElementById('editableDiv').innerHTML = `${elem}&#8203`;
        //   }
        //   break;
        case 'link':
          if (value == true) {
            const url = prompt('Please Enter the Url.');
            if (url == null || url == '') {
              return false;
            }
            var newNode = document.createElement('a');
            newNode.setAttribute('href', url);
            range.surroundContents(newNode);
            var newNode = document.createElement('b');
            range.surroundContents(newNode);
          } else {
            document.getElementById('editableDiv').innerHTML = `${elem}&#8203`;
          }
          break;
        case 'reference':
          if (value == true) {
            var newNode = document.createElement('mark');
            range.surroundContents(newNode);
          } else {
            document.getElementById('editableDiv').innerHTML = `${elem}&#8203`;
          }
          break;
        default:
          alert('No selection');
      }
    }
    // var caretPos = document.getElementsByClassName('paragraphEdit')[0].html(getCaretPosition(this));

    // if (window.getSelection) {
    //   text = window.getSelection();
    // } // else if (document.getSelection) {
    //     text = document.getSelection();
    // } else if (document.selection) {
    //     text = document.selection.createRange().text;
    // }
    // const range = text.getRangeAt(0);
    // const node = text.anchorNode;
    // while(range.toString().indexOf(' ') != 0) {
    //   range.setStart(node,(range.startOffset -1));
    // }
    // range.setStart(node, range.startOffset +1);
    // do{
    //        range.setEnd(node,range.endOffset + 1);

    //     }while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
    // do{
    //        range.setEnd(node,range.endOffset + 1);

    //     }while(range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
    //     var str = range.toString().trim();
    //     alert(str);
    // const startPosition = elem.search(text);
    // const getPosition = range.toString();
    // const endPosition = parseInt(getPosition.length) + parseInt(startPosition);
    // elem.substring(startPosition, endPosition)

    // text.collapse()
    // if (text.getRangeAt) {
    //   const range = text.getRangeAt(0);
    //   if (this.state.link) {
    //     const url = prompt('Please Enter the Url.');
    //     if (url == null || url == '') {
    //       return false;
    //     }
    //     var newNode = document.createElement('a');
    //     newNode.setAttribute('href', url);
    //     range.surroundContents(newNode);
    //   } if (this.state.bold) {
    //     var newNode = document.createElement('b');
    //     range.surroundContents(newNode);
    //   } if (this.state.italic) {
    //     var newNode = document.createElement('i');
    //     range.surroundContents(newNode);
    //     } else{
    //       document.getElementById('editableDiv').innerHTML = `${elem}&#8203`;
    //     }

    //   if (this.state.reference) {
    //     var newNode = document.createElement('mark');
    //     range.surroundContents(newNode);
    //   }
    // } else if (!this.state.bold) {
    //   document.getElementById('editableDiv').innerHTML = `${elem}&#8203`;
    // }
    // else if (e.target.dataset.id == 'link') {
    //   const url = prompt('Please Enter the Url.');
    //   if (url == null || url == '') {
    //     return false;
    //   }
    //   text.pasteHTML(`<a href=${url}>'${text.htmlText}</a>`);
    // } else if (e.target.dataset.id == 'bold') {
    //   text.pasteHTML(`<b>${text.htmlText}</b>`);
    // } else if (e.target.dataset.id == 'italic') {
    //   text.pasteHTML(`<i>${text.htmlText}</i>`);
    // } else if (e.target.dataset.id == 'reference') {
    //   text.pasteHTML(`<mark>${text.htmlText}</mark>`);
    // }
    // var selection = window.getSelection();
    // if (selection.rangeCount > 0) {
    //   selection.removeAllRanges();
    //   selection.addRange(range);
    // }
    // else if (e.target.dataset.id == 'bold') {
    //   var change = elem.replace(
    //     text.toString(),
    //     `<span class=${e.target.dataset.id}>${text.toString()}</span>`,
    //   );
    // } else if (e.target.dataset.id == 'italic') {
    //   var change = elem.replace(
    //     text.toString(),
    //     `<span class=${e.target.dataset.id}>${text.toString()}</span>`,
    //   );
    // } else if (e.target.dataset.id == 'reference') {
    //   var change = elem.replace(
    //     text.toString(),
    //     `<mark class=${e.target.dataset.id}>${text.toString()}</mark>`,
    //   );
    // }
    // document.getElementsByClassName('paragraphEdit')[0].innerHTML = change;
  }

  // Function openTranslationScreen() is used to open the translation screen of the paragraph.
  openTranslationScreen(e){
    console.log("open")
    // e.preventDefault();
    this.setState({
      translationScreen: true,
      showEditParagraph: false
    })
  }

  render() {
    const openParagraphForm = this.openParagraph();
    const translationData = this.translationData();
    if(this.state.translationScreen){
      console.log("openParagraph")
      return translationData;
    }else{
      return (
        <div id="1">
          <div
            className="parentSection no-drag drag-event"
            data-rank={this.props.rank}
            id={this.props.ID}
          >
            <div className="childSection1 sub-header no-drag drag-event">
              <div className="">
                <h6 className="no-drag drag-event">Paragraph</h6>
                <ul
                  className={
                    this.state.showEditParagraph || this.props.open
                      ? 'no-drag drag-event image-uplode-top-bar Paragraph-top-bar'
                      : 'no-drag drag-event image-uplode-top-bar Paragraph-top-bar display-none'
                  }
                >
                  <li className="no-drag drag-event" data-id="link">
                    <button
                      className="editorButton no-drag drag-event"
                      data-id="link"
                      onClick={this.checkEdit.bind(this)}
                    >
                      <span className="ico-icon31 no-drag drag-event" data-id="link" />
                      Link
                    </button>
                  </li>
                  <li className="no-drag drag-event" data-id="bold">
                    <button
                      className="editorButton no-drag drag-event"
                      data-id="bold"
                      onClick={this.checkEdit.bind(this)}
                    >
                      <span className="ico-icon32 no-drag drag-event" data-id="bold" />
                      Bold
                    </button>
                  </li>
                  <li className="no-drag drag-event" data-id="italic">
                    <button
                      className="editorButton no-drag drag-event"
                      data-id="italic"
                      onClick={this.checkEdit.bind(this)}
                    >
                      <span className="ico-icon33 no-drag drag-event" data-id="italic" />
                      Italic
                    </button>
                  </li>
                  <li className="no-drag drag-event" data-id="reference">
                    <button
                      className="editorButton no-drag drag-event"
                      data-id="reference"
                      onClick={this.checkEdit.bind(this)}
                    >
                      <span className="ico-icon34 no-drag drag-event" data-id="reference" />
                      Reference
                    </button>
                  </li>
                </ul>

                <ul className="text-muted pull-right no-drag drag-event paragraphUl">
                  <li>
                    <img
                      className={
                        this.state.showEditParagraph
                          ? 'no-drag drag-event opened'
                          : 'no-drag drag-event'
                      }
                      id={this.props.ID}
                      src={this.state.showEditParagraph ? "../assets/images/translate.png" : "../assets/images/user-profile/article-icon-1.png"}
                      onClick={this.state.showEditParagraph || this.props.open 
                                ? this.openTranslationScreen.bind(this) 
                                : this.handleOpenParagraph.bind(this)
                              }
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                    />
                    {this.state.showEditParagraph ? "Translate paragraph" : ""}
                  </li>
                  <li>
                    <img
                      className="no-drag drag-event"
                      id={this.props.ID}
                      src="../assets/images/user-profile/article-icon-2.png"
                      onClick={this.props.delete}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                    />
                  </li>
                  <li>
                    <img
                      className="no-drag drag-event"
                      id={this.props.ID}
                      src="../assets/images/user-profile/article-icon-3.png"
                      onMouseDown={this.props.removeNoDrag}
                      onMouseUp={this.props.addNoDrag}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Drag"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="childsection2 paragraph_content no-drag drag-event">
              {openParagraphForm}
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const Paragraph = state;
  return { Paragraph };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Paragraph);
