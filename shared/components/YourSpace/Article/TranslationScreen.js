import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class TranslationScreen extends Component{
	constructor(props){
		super(props);

		this.state = {

		}
	}

	render() {
		return(
			<div className="no-drag drag-event translationParent parentSection">
				<div className="no-drag drag-event translationHeader childSection1">
			        <div 
			          className="no-drag drag-event translationHedaerLeft col-xs-6 col-sm-6 col-md-6 col-lg-6"
			        >
			        	<form className="no-drag drag-event">
							<div className="no-drag drag-event input-group">
								<input 
					            	type="text" 
					            	placeholder="Paste Link of The Text to Translate Here"
					            	className="no-drag drag-event translationSearch from-control"
					            />
					            <div className="no-drag drag-event input-group-btn">
						            <button className="no-drag drag-event translationPaste btn">
						            	Paste
						            </button>
					            </div>
							</div>
			        	</form>
			        </div>
			        <div 
			          className="no-drag drag-event translationHedaerRight col-xs-6 col-sm-6 col-md-6 col-lg-6"
			        >
			            <ul
		                  className={
		                    this.state.showEditParagraph || this.props.open
		                      ? 'no-drag drag-event image-uplode-top-bar Paragraph-top-bar'
		                      : 'no-drag drag-event image-uplode-top-bar Paragraph-top-bar'
		                  }
		                >
		                  <li className="no-drag drag-event" data-id="link">
		                    <button
		                      className="editorButton no-drag drag-event"
		                      data-id="link"
		                    >
		                      <span className="ico-icon31 no-drag drag-event" data-id="link" />
		                      Link
		                    </button>
		                  </li>
		                  <li className="no-drag drag-event" data-id="bold">
		                    <button
		                      className="editorButton no-drag drag-event"
		                      data-id="bold"
		                    >
		                      <span className="ico-icon32 no-drag drag-event" data-id="bold" />
		                      Bold
		                    </button>
		                  </li>
		                  <li className="no-drag drag-event" data-id="italic">
		                    <button
		                      className="editorButton no-drag drag-event"
		                      data-id="italic"
		                    >
		                      <span className="ico-icon33 no-drag drag-event" data-id="italic" />
		                      Italic
		                    </button>
		                  </li>
		                  <li className="no-drag drag-event" data-id="reference">
		                    <button
		                      className="editorButton no-drag drag-event"
		                      data-id="reference"
		                    >
		                      <span className="ico-icon34 no-drag drag-event" data-id="reference" />
		                      Reference
		                    </button>
		                  </li>
		                </ul>
			        </div>
				</div>
				<div className="no-drag drag-event translationWrapper childSection2">
					<div 
			          className="no-drag drag-event translationWrapperLeft col-xs-6 col-sm-6 col-md-6 col-lg-6 no_padding"
			        >
			        	<div className="no-drag drag-event translationEditLeft translationEdit" contentEditable={true} />
			        </div>
			        <div 
			          className="no-drag drag-event translationWrapperRight col-xs-6 col-sm-6 col-md-6 col-lg-6 no_padding"
			        >
			        	<div className="no-drag drag-event translationEditRight translationEdit" contentEditable={true} />
			        </div>
			        <div 
			          className="no-drag drag-event translationWrapperButton col-xs-12 col-sm-12 col-md-12 col-lg-12 no_padding"
			        >
			        	<div className="no-drag drag-event translationButtonLeft col-xs-6 col-sm-6 col-md-6 col-lg-6">
			        		<div className="no-drag drag-event translationButton pull-right">
			        			<button 
			        				className="btn btn-clean translationBtn"
			        			>
			        				Clean
			        			</button>
			        			<button 
			        				className="btn btn-paste translationBtn"
			        			>
			        				Clean
			        			</button>
			        		</div>
			        	</div>
			        	<div className="no-drag drag-event translationButtonRight col-xs-6 col-sm-6 col-md-6 col-lg-6">
			        		<div className="no-drag drag-event translationButton pull-right">
			        			<button 
			        				className="btn btn-save translationBtn"
			        			>
			        				Save
			        			</button>
			        			<button 
			        				className="btn btn-cancel translationBtn"
			        			>
			        				Cancel
			        			</button>
			        		</div>
			        	</div>
			        </div>
			        <div 
			          className="no-drag drag-event translationWrapperBottom col-xs-12 col-sm-12 col-md-12 col-lg-12"
			        >
			        	<div className="no-drag drag-event translationRisorso translation col-xs-4 col-sm-4 col-md-4 col-lg-4">
			        		<div className="no-drag drag-event dictionaryDiv">
			        			<input type="text" className="no-drag drag-event risorsoWord dictionary" placeholder="Risorso Word Dictionary"/>
			        		</div>
			        		<div className="no-drag drag-event translationData risorsoData">
			        			jdshjkfdbvjhbvjhfd
			        			sfdgjkvhfjkdn
			        			dfvklf
			        			fvjkfd
			        		</div> 
			        	</div>
			        	<div className="no-drag drag-event translationGoogle translation col-xs-4 col-sm-4 col-md-4 col-lg-4">
			        		<div className="no-drag drag-event dictionaryDiv">
			        			<input type="text" className="no-drag drag-event googleTranslate dictionary" placeholder="Google Translate"/>
			        		</div>
			        		<div className="no-drag drag-event translationData googleData">
			        			jdshjkfdbvjhbvjhfd
			        			sfdgjkvhfjkdn
			        			dfvklf
			        			fvjkfd
			        		</div> 
			        	</div>
			        	<div className="no-drag drag-event translationWikipedia translation col-xs-4 col-sm-4 col-md-4 col-lg-4">
			        		<div className="no-drag drag-event dictionaryDiv">
			        			<input type="text" className="no-drag drag-event wikipediaTerms dictionary" placeholder="Wikipedia Terms Dictionary"/>
			        		</div>
			        		<div className="no-drag drag-event translationData wikipediaData">
			        			jdshjkfdbvjhbvjhfd
			        			sfdgjkvhfjkdn
			        			dfvklf
			        			fvjkfd
			        		</div> 
			        	</div>
			        </div>
				</div>
		    </div>
		)
	}
}

export default TranslationScreen;