import React, { Component } from 'react';
import './SeoManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from 'draft-js-import-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
class AddUpdateSeoManagement extends Component {

	constructor(props) {		
		super(props);		
		let $seo_id = '';
		//alert(props.refSysId)
		let $seo_ref_id = props.refSysId;
		var $seo_meta_title = '';	
		let $seo_meta_tag = '';
		let $seo_alt_tag = '';
		let $seo_meta_key_words = '';		
		let $seo_meta_desc = EditorState.createEmpty();		
		let $seo_og_title = '';
		let $seo_og_tag = '';
		let $seo_og_key_words = '';
		let $seo_og_desc = EditorState.createEmpty();		
		let $seo_og_image_width = '100';
		let $seo_og_image_height = '100';
		let $seo_twitter_title = '';
		let $seo_twitter_desc = EditorState.createEmpty();;
		let $seo_twitter_card = '';
		let $seo_twitter_site = '';		
		let $seo_active_yn = 'N';
		let $isActiveChecked = '';		
		let $old_avatar = '';	
		if(props.seoData.return_status==="0"){			
			var $seoObj = props.seoData.result[0];
			$seo_id = $seoObj.seo_id;
			$seo_ref_id = $seoObj.seo_ref_id;
			$seo_meta_title = $seoObj.seo_meta_title;
			$seo_meta_tag = $seoObj.seo_meta_tag;
			$seo_alt_tag = $seoObj.seo_alt_tag;
			$seo_meta_key_words = $seoObj.seo_meta_key_words;
			$seo_meta_desc = EditorState.createWithContent(stateFromHTML($seoObj.seo_meta_desc));
			$seo_og_title = $seoObj.seo_og_title;			
			$seo_og_tag = $seoObj.seo_og_tag;
			$seo_og_key_words = $seoObj.seo_og_key_words;
			$seo_og_desc = EditorState.createWithContent(stateFromHTML($seoObj.seo_og_desc));
			$seo_og_image_width = $seoObj.seo_og_image_width;
			$seo_og_image_height = $seoObj.seo_og_image_height;
			$seo_twitter_title = $seoObj.seo_twitter_title;
			$seo_twitter_desc = EditorState.createWithContent(stateFromHTML($seoObj.seo_twitter_desc));
			$seo_twitter_card = $seoObj.seo_twitter_card;
			$seo_twitter_site = $seoObj.seo_twitter_site;
			$seo_active_yn = $seoObj.seo_active_yn;
			$isActiveChecked = ($seoObj.seo_active_yn==="Y")?"checked":"";
			$old_avatar = $seoObj.seo_og_image_path;
		}			
			
		this.state = {
			seo_id: $seo_id, //this.props.match.params.id
			seo_ref_id: $seo_ref_id,
			seo_meta_title: $seo_meta_title,
			seo_meta_tag: $seo_meta_tag,
			seo_alt_tag: $seo_alt_tag,
			seo_meta_key_words: $seo_meta_key_words,			
			seo_meta_desc: $seo_meta_desc,
			seo_og_title: $seo_og_title,
			seo_og_tag: $seo_og_tag,
			seo_og_key_words: $seo_og_key_words,			
			seo_og_desc: $seo_og_desc,			
			seo_og_image_width: $seo_og_image_width,			
			seo_og_image_height: $seo_og_image_height,
			seo_twitter_title: $seo_twitter_title,
			seo_twitter_desc: $seo_twitter_desc,			
			seo_twitter_card: $seo_twitter_card,
			seo_twitter_site: $seo_twitter_site,			
			seo_active_yn: $seo_active_yn,
			isActiveChecked: $isActiveChecked,			
			avatar: '',
			old_avatar: $old_avatar,
			errors: {}
		}
				
		this.handleChange = this.handleChange.bind(this);
		this.handleActiveCheckboxChange = this.handleActiveCheckboxChange.bind(this);
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);	
		this.onEditorMetaStateChange = this.onEditorMetaStateChange.bind(this);
		this.onEditorOgStateChange = this.onEditorOgStateChange.bind(this);
		this.onEditorTwitterStateChange = this.onEditorTwitterStateChange.bind(this);
	}
	
	handleChange(event) {
		const name = event.target.name;
		var value = event.target.value;
		this.setState({
			[name]: value
		});
	}
			
	handleActiveCheckboxChange(event) {
		const name = event.target.name;
		var value = event.target.value;	
		value = (value==='Y')?'N':'Y';
		let activeChecked = (value==='Y')?'checked':'';
		this.setState({
			[name]: value,
			'isActiveChecked': activeChecked
		})
	}
				
	onFileChangeHandler (e) {		
		this.setState({
            'avatar': e.target.files[0]
        });
	}
	
	onEditorMetaStateChange (seo_meta_desc) {				
		this.setState({
            seo_meta_desc
        });
	}
	
	onEditorOgStateChange (seo_og_desc) {	
		this.setState({
            seo_og_desc
        });
	}
	
	onEditorTwitterStateChange (seo_twitter_desc) {	
		this.setState({
            seo_twitter_desc
        });
	}
	
	seoHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();		
			fmData.append('seo_meta_title', this.state.seo_meta_title);
			fmData.append('seo_meta_tag', this.state.seo_meta_tag);
			fmData.append('seo_alt_tag', this.state.seo_alt_tag);			
			fmData.append('seo_meta_key_words', this.state.seo_meta_key_words);			
			//fmData.append('seo_meta_desc', this.state.seo_meta_desc);			
			fmData.append('seo_meta_desc', stateToHTML(this.state.seo_meta_desc.getCurrentContent()));			
			fmData.append('seo_og_title', this.state.seo_og_title);			
			fmData.append('seo_og_tag', this.state.seo_og_tag);
			fmData.append('seo_og_key_words', this.state.seo_og_key_words);			
			fmData.append('seo_og_desc', this.state.seo_og_desc);			
			fmData.append('seo_og_desc', stateToHTML(this.state.seo_og_desc.getCurrentContent()));
			fmData.append('seo_og_image_width', this.state.seo_og_image_width);
			fmData.append('seo_og_image_height', this.state.seo_og_image_height);			
			fmData.append('seo_twitter_title', this.state.seo_twitter_title);
			//fmData.append('seo_twitter_desc', this.state.seo_twitter_desc);
			fmData.append('seo_twitter_desc', stateToHTML(this.state.seo_twitter_desc.getCurrentContent()));
			fmData.append('seo_twitter_card', this.state.seo_twitter_card);
			fmData.append('seo_twitter_site', this.state.seo_twitter_site);			
			fmData.append('seo_active_yn', this.state.seo_active_yn);			
			fmData.append('seo_ref_id', this.state.seo_ref_id);				
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);			
			this.props.onFormSubmit(fmData,this.state.seo_id,this.props.seoFor);
		}		
	}
	
	seoDeleteHandler = event => {
		this.props.onDeleteSubmit(this.state.seo_id,this.props.seoFor);
		//event.preventDefault();
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.seo_meta_title) {
		  formIsValid = false
		  errors['seo_meta_title'] = '*Please enter meta title'
		}
		
		if (!this.state.seo_meta_tag) {
		  formIsValid = false
		  errors['seo_meta_tag'] = '*Please enter meta tag'
		}
		
		if (!this.state.seo_alt_tag) {
		  formIsValid = false
		  errors['seo_alt_tag'] = '*Please enter alt tag'
		}
		
		if (!this.state.seo_meta_key_words) {
		  formIsValid = false
		  errors['seo_meta_key_words'] = '*Please enter meta keywords'
		}
				
		if (!this.state.seo_meta_desc) {
		  formIsValid = false
		  errors['seo_meta_desc'] = '*Please enter meta description'
		}
		
		/*if (this.state.seo_meta_title) {
		  if (!this.state.seo_meta_title.match(/^\w+$/)) {
			formIsValid = false
			errors['seo_meta_title'] = '*Please use alphanumeric characters only'
		  }
		}*/		
		
		if (!this.state.seo_og_title) {
		  formIsValid = false
		  errors['seo_og_title'] = '*Please enter OG image title'
		}
		
		if (!this.state.seo_og_tag) {
		  formIsValid = false
		  errors['seo_og_tag'] = '*Please enter OG image tag'
		}
		
		if (!this.state.seo_og_key_words) {
		  formIsValid = false
		  errors['seo_og_key_words'] = '*Please enter OG image keywords'
		}
		
		if (!this.state.seo_og_desc) {
		  formIsValid = false
		  errors['seo_og_desc'] = '*Please enter OG image description'
		}
		if (!this.state.seo_og_image_width) {
		  formIsValid = false
		  errors['seo_og_image_width'] = '*Please enter OG image width'
		}
		//regular expression for seo_ordering validation
		const re = /^[0-9\b]+$/; //rules
		if (this.state.seo_og_image_width) {		  
		  if (!re.test(this.state.seo_og_image_width)) {
			formIsValid = false
			errors['seo_og_image_width'] = '*Please enter only number value'
		  }
		}
		if (!this.state.seo_og_image_height) {
		  formIsValid = false
		  errors['seo_og_image_height'] = '*Please enter OG image height'
		}
		if (this.state.seo_og_image_height) {		  
		  if (!re.test(this.state.seo_og_image_height)) {
			formIsValid = false
			errors['seo_og_image_height'] = '*Please enter only number value'
		  }
		}
		
		if (!this.state.seo_twitter_title) {
		  formIsValid = false
		  errors['seo_twitter_title'] = '*Please enter twitter title'
		}
		if (!this.state.seo_twitter_desc) {
		  formIsValid = false
		  errors['seo_twitter_desc'] = '*Please enter twitter description'
		}
		if (!this.state.seo_twitter_card) {
		  formIsValid = false
		  errors['seo_twitter_card'] = '*Please enter twitter card'
		}
		if (!this.state.seo_twitter_site) {
		  formIsValid = false
		  errors['seo_twitter_site'] = '*Please enter twitter site'
		}		
		
		this.setState({ errors });
		return formIsValid;
	}
	
    // componentWillMount(){}
    // componentDidMount(){}
    // componentWillUnmount(){}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
	
  render() {
	//console.log('this.state',this.state);	
	//let pageTitle = (this.state.seo_id)?<h2>Edit Seo</h2>:<h2>Add Seo</h2>;
	let deleteButton = (this.state.seo_id)?<Button className="ml-1" onClick={ e => window.confirm("Are you sure you want to delete this seo record?") && this.seoDeleteHandler(e)} variant="danger" type="button">Delete</Button>:'';
	//const { seo_meta_title, seo_meta_tag, seo_alt_tag, seo_meta_key_words, seo_meta_desc, avatar, seo_og_title, seo_og_tag, seo_og_key_words, seo_og_desc, seo_og_image_width, seo_og_image_height, seo_twitter_title, seo_twitter_desc, seo_twitter_card, seo_twitter_site} = this.state;
	let $props = this.props;
	
    return (	
		<Container className="themed-container" fluid="true">
			{/*<Form onSubmit={this.handleSubmit}>*/}
			<Form>
				<Row noGutters>
					<Col>
						<Form.Group controlId="seo_meta_title">
						<Form.Label>Meta Title</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_meta_title"
							  value={this.state.seo_meta_title}
							  onChange={this.handleChange}
							  placeholder="Seo Title"/>
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_meta_title}</div>
					</Col>
				</Row>
				<Row>								
					<Col>
						<Form.Group controlId="seo_meta_tag">
						<Form.Label>Meta Tag</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_meta_tag"
							  value={this.state.seo_meta_tag}
							  onChange={this.handleChange}
							  placeholder="Seo Tag"/>
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_meta_tag}</div>
					</Col>
					<Col>
						<Form.Group controlId="seo_alt_tag">
						<Form.Label>Seo Alt Tag</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_alt_tag"
							  value={this.state.seo_alt_tag}
							  onChange={this.handleChange}
							  placeholder="Seo Alt Tag"/>
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_alt_tag}</div>
					</Col>
				</Row>
								
				<Row noGutters>
					<Col>	
						<Form.Group controlId="seo_meta_key_words">
							<Form.Label>Meta Keywords</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_meta_key_words"
							  value={this.state.seo_meta_key_words}
							  onChange={this.handleChange}
							  placeholder="Meta Keywords" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_meta_key_words}</div>
					</Col>
				</Row>
				<Row noGutters>
					<Col>
						<Form.Group controlId="seo_meta_desc">
							<Form.Label>Meta Description</Form.Label>								
							{/*
							<Form.Control
							  type="text"
							  name="seo_meta_desc"
							  value={this.state.seo_meta_desc}
							  onChange={this.handleChange}
							  placeholder="Meta Description" />
							*/}
							  
								<Editor
								  editorState={this.state.seo_meta_desc}
								  toolbarClassName="toolbarClassName"
								  wrapperClassName="wrapperClassName"
								  editorClassName="editorClassName"
								  onEditorStateChange={this.onEditorMetaStateChange}
								/>
							  
							  
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_meta_desc}</div>								
					</Col>
				</Row>				
				<Row>
					<Col>
						<Form.Group controlId="seo_og_title">
							<Form.Label>OG Image Title</Form.Label>							
							<Form.Control
							  type="text"
							  name="seo_og_title"
							  value={this.state.seo_og_title}
							  onChange={this.handleChange}
							  placeholder="OG Image Title" />							
							
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_og_title}</div>
					</Col>
					<Col>	
						<Form.Group controlId="seo_og_tag">
							<Form.Label>OG Image Tag</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_og_tag"
							  value={this.state.seo_og_tag}
							  onChange={this.handleChange}
							  placeholder="OG Image Tag" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_og_tag}</div>
					</Col>
				</Row>
				
				
				
				<Row noGutters>
					<Col>	
						<Form.Group controlId="seo_og_key_words">
							<Form.Label>OG Image Keywords</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_og_key_words"
							  value={this.state.seo_og_key_words}
							  onChange={this.handleChange}
							  placeholder="OG Image Keywords" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_og_key_words}</div>
					</Col>
				</Row>
				<Row noGutters>
					<Col>	
						<Form.Group controlId="seo_og_desc">
							<Form.Label>OG Image Description</Form.Label>
							{/*}
							<Form.Control
							  type="text"
							  name="seo_og_desc"
							  value={this.state.seo_og_desc}
							  onChange={this.handleChange}
							  placeholder="OG Image Description" />
							*/}  
							<Editor
								  editorState={this.state.seo_og_desc}
								  toolbarClassName="toolbarClassName"
								  wrapperClassName="wrapperClassName"
								  editorClassName="editorClassName"
								  onEditorStateChange={this.onEditorOgStateChange}
								/>
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_og_desc}</div>
					</Col>
				</Row>
				<Row>
					<Col>	
						<Form.Group controlId="avatar">
							<div><Form.Label>OG Image</Form.Label></div>
							<Form.Control
							  type="file"
							  name="avatar"	
							  style={{display:'none'}}
							  onChange={this.onFileChangeHandler}
							  placeholder="OG Image"
							  ref={fileInput => this.fileInput = fileInput}
							  />
							  &nbsp;
							  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
						</Form.Group>
						
						<div className='errorMsg'>{this.state.errors.avatar}</div>
					</Col>
					<Col>
					{(this.state.old_avatar) && 
					
						<img src={AVATAR_URL+this.state.old_avatar} width={80} height={80} alt={this.state.seo_og_title} />
					
					}
					</Col>
					
					<Col>	
						<Form.Group controlId="seo_og_image_width">
							<Form.Label>OG Image Width</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_og_image_width"
							  value={this.state.seo_og_image_width}
							  onChange={this.handleChange}
							  placeholder="OG Image Width" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_og_image_width}</div>
					</Col>
					<Col>	
						<Form.Group controlId="seo_og_image_height">
							<Form.Label>OG Image Height</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_og_image_height"
							  value={this.state.seo_og_image_height}
							  onChange={this.handleChange}
							  placeholder="OG Image Height" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_og_image_height}</div>
					</Col>
				</Row>				
				<Row noGutters>
					<Col>	
						<Form.Group controlId="seo_twitter_title">
							<Form.Label>Twitter Title</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_twitter_title"
							  value={this.state.seo_twitter_title}
							  onChange={this.handleChange}
							  placeholder="Twitter Title" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_twitter_title}</div>
					</Col>
				</Row>
				<Row noGutters>
					<Col>	
						<Form.Group controlId="seo_twitter_desc">
							<Form.Label>Twitter Description</Form.Label>
							{/*
							<Form.Control
							  type="text"
							  name="seo_twitter_desc"
							  value={this.state.seo_twitter_desc}
							  onChange={this.handleChange}
							  placeholder="Twitter Description" />
							*/}
							<Editor
								  editorState={this.state.seo_twitter_desc}
								  toolbarClassName="toolbarClassName"
								  wrapperClassName="wrapperClassName"
								  editorClassName="editorClassName"
								  onEditorStateChange={this.onEditorTwitterStateChange}
								/>
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_twitter_desc}</div>
					</Col>
				</Row>				
				<Row>
					<Col>	
						<Form.Group controlId="seo_twitter_card">
							<Form.Label>Twitter Card</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_twitter_card"
							  value={this.state.seo_twitter_card}
							  onChange={this.handleChange}
							  placeholder="Twitter Card" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_twitter_card}</div>
					</Col>
					<Col>	
						<Form.Group controlId="seo_twitter_site">
							<Form.Label>Twitter Site</Form.Label>
							<Form.Control
							  type="text"
							  name="seo_twitter_site"
							  value={this.state.seo_twitter_site}
							  onChange={this.handleChange}
							  placeholder="Twitter Site" />
						</Form.Group>
						<div className='errorMsg'>{this.state.errors.seo_twitter_site}</div>
					</Col>
				</Row>
				
				{/*<Row noGutters>
					<Col>	
						<Form.Group controlId="avatar">
							<Form.Label>Seo Icon</Form.Label>
							<Form.Control
							  type="file"
							  name="avatar"	
							  style={{display:'none'}}
							  onChange={this.onFileChangeHandler}
							  placeholder="Seo Icon"
							  ref={fileInput => this.fileInput = fileInput}
							  />
							  &nbsp;
							  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
						</Form.Group>
						
						<div className='errorMsg'>{this.state.errors.avatar}</div>
					</Col>
					{(this.state.old_avatar) && 
					<Col>
						<img src={AVATAR_URL+this.state.old_avatar} width={80} height={80} />
					</Col>
					}
				</Row>*/}
				<Row noGutters>
					<Col xs={4}>	
						<Form.Group controlId="seo_active_yn">
							<Form.Label className="checkbox_label mr-2 form-label">Active ?</Form.Label>
							<Form.Control
							  type="checkbox" 								  
							  name="seo_active_yn"								  
							  checked={this.state.isActiveChecked}
							  value={this.state.seo_active_yn}
							  onChange={this.handleActiveCheckboxChange}
							  placeholder="Active ?"
							  className="checkbox_input_s" />
						</Form.Group>						
					</Col>
					<Col xs={8}></Col>
				</Row>
				<Form.Group>
					{/*<Form.Control type="hidden" name="seo_id" value={this.state.seo_id} />
					<Form.Control type="hidden" name="old_avatar" value={this.state.old_avatar} />							
					<Form.Control type="hidden" name="lang_code" value={this.state.lang_code} />
					<Form.Control type="hidden" name="logged_user_id" value={this.state.logged_user_id} />
					<Form.Control type="hidden" name="logged_site_id" value={this.state.logged_site_id} />
					<Form.Control type="hidden" name="channel_id" value={this.state.channel_id} />
					<Form.Control type="hidden" name="auth_token" value={this.state.auth_token} />*/}
					<Row noGutters>
						<Col xs={4}></Col>
						<Col xs={4} className="alignCenter">
							<Button onClick={this.seoHandler} variant="success" type="submit">Save</Button>
							{ deleteButton }														
							<Button className="ml-1" variant="secondary" onClick={$props.closeModal}>Close</Button>
						</Col>
						<Col xs={4}></Col>
					</Row>
				</Form.Group>
			</Form>
		</Container>
    );
  }
}

export default AddUpdateSeoManagement;