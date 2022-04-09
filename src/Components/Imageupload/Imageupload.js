import React, { Component, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from "react-dom";
import './Imageupload.scss';
import { Col, Row, InputGroup, FormControl,Form, Button, Modal, Dropdown, ButtonGroup, DropdownButton} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faTrash,faEdit, faRetweet } from '@fortawesome/free-solid-svg-icons';

  const ModalChild = forwardRef((props,ref) => {
    const [show, setShow] = useState(false);
    const [editText, setEdittext] = useState(null);
    const [constIndex, setContIndex] = useState(null);
    const getIndex = useRef(null);
    const { editDrawWindow, renderHtml, textInputChild, fromChildClick } = props;
    const parentAccess = (index) =>  {
      setShow(true); 
      editDrawWindow(index);
      setContIndex(index);
    }
    useImperativeHandle(ref, () => {
      return {
        parentAccess: parentAccess
      };
    });
    const deleteArray=()=>{
      props.fromChildClick(constIndex,'');
      // ReactDOM.findDOMNode(getIndex.current).getElementsByClassName('textDraw')[0].remove();
      // console.log(textInputChild, constIndex,"ARROW");
      setShow(false);
    }
    const editActive = async()=>{
      console.log(constIndex, editText,"EDOTESTPER  ");
      props.fromChildClick(constIndex, editText,'TEXT');
      setShow(false);
    }
    const UpdateEditText = (e) => {
      setEdittext(e.currentTarget.textContent);
    }
    return (
      <>
        <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w"  aria-labelledby="example-custom-modal-styling-title" animation={false}>
          <Modal.Header className="pd-2" closeButton>
            <span className="iconsizes">
              <span className="icontop" onClick={deleteArray}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span className="icontop" onClick={editActive}>
                <FontAwesomeIcon icon={faRetweet} />
              </span>
            </span>
          </Modal.Header>
          <Modal.Body>
            <div contentEditable={true} onInput={e => UpdateEditText(e)} className="windowDraw" ref={getIndex}
              dangerouslySetInnerHTML={{
                __html: props.renderHtml
              }}></div>
          </Modal.Body>
        </Modal>
      </>
    );
  });

class Imageupload extends Component {
  constructor(props) {
    super(props);
    this.displayText = null;
    this.myRef = React.createRef();
    this.refern = React.createRef();
    this.state = {
      origincount:0,
      counter: 0,
      textchr: [],
      input:"",
      html:"",
      file: '',
      renderHtml:"",
      refTray:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      bold: false,
      italic: false,
      hTag:false,
      fontSelect:"",
      isActive:null,
      imagePreviewUrl: '',
      textInput:[],
      setFontsize:12,
      defaultStyle:[],
      activeCount:null,
      watermark:true,
      rangeone:0,
      rangetwo:0
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    for (let i = 0; i < this.state.refTray.length; i++) {
      this["dynamicRef" + this.state.refTray[i]] = React.createRef();
    };
    this.activeText = this.activeText.bind(this);
    this.data = {
      content: {
        people: [
          {
            htmlContent: '<div class="imagePreview"><div class="randomText"><div data-index="0" class="textDraw " style="position: absolute; left: 27%; top: 58%; font-weight: 800; text-transform: uppercase; user-select: none; color: rgba(0, 0, 0, 0.14); font-size: 92px;" id="txtAbsolu0">activity roller </div><div data-index="1" class="textDraw " style="position: absolute; top: 39%; left: 36%;" id="txtAbsolu1"><h3><b>unity</b></h3></div></div></div>'
            // htmlContent:''
          }
        ],
      },
    };
  }
  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  appendText = async () =>{
      let counter = this.state.counter;
      let activecount = this.state.activeCount;
      console.log(counter, activecount, "domlength");
      let count = (counter < activecount ? activecount : counter)
      await this.setState({
        counter: count,
        watermark:true,
        rangeone:0,
        rangetwo:0
      },()=> console.log(this.state,"TEST"));
    var countState = this.state.counter;
    var indexInit = (this["dynamicRef" + countState].current ? this["dynamicRef" + countState].current.getAttribute("data-index") : "");
    if (this["dynamicRef" + countState].current){
      ReactDOM.unmountComponentAtNode(this["dynamicRef" + this.state.counter].current);
    }
    var getInputValue = this.state.input;
    var dynamicStyle = [...this.state.defaultStyle];
    dynamicStyle[countState] = {position:'absolute'};
    const dynamiText = [...this.state.textchr];
    dynamiText[countState] = getInputValue;
    this.setState({
      textchr: dynamiText,
      defaultStyle: dynamicStyle
    });
    const setSpan = { name: "txtAbsolu" };
    const staticText = [...this.state.textInput];
    staticText[countState] = setSpan;
    if (countState > indexInit || indexInit==""){
      this.setState({
        textInput: staticText
      },()=>{
        console.log(this.state, "this.state")
      });
    }
  }
  
  handleChange = (e) => {
    let getInputValue = e.target.value;
    this.setState({
      input: getInputValue
    });    
  }
  changeVertical = (e) =>{
    let seeds = this.state.counter;
    if (document.getElementById("txtAbsolu" + seeds)){
      let rangeval = e.target.value;
      let toper = rangeval+'%';
      document.getElementById("txtAbsolu" + seeds).style.top = toper;
      this.setState({ rangeone: rangeval});
    }
  }
  changeHorizontal = (e) => {
    let seeds = this.state.counter;
    if (document.getElementById("txtAbsolu" + seeds)) {
      let rangeval = e.target.value;
      let toper = rangeval + '%';
      document.getElementById("txtAbsolu" + seeds).style.left = toper;
      this.setState({ rangetwo: rangeval });
    }
  }
  handleSubmit= async (e)=>{
    e.preventDefault();
    let htmlref = this.myRef.current;
    await this.setState({
      html: htmlref.outerHTML
    });
    console.log(this.state,"FORM SUBMIT");
  }
  fontSize = async (eventVal,param) => {
    let seeds = this.state.counter;
    let running = this["dynamicRef" + seeds];
    if (running){
      switch (param){
        case 'I':
          await this.setState({
            italic: !this.state.italic
          });
          break;
        case 'B':
          await this.setState({
            bold: !this.state.bold
          });
          break;
        case 'H':
          await this.setState({
            hTag: true,
            fontSelect: eventVal
          });
          break;
      }
      let currTag = this["dynamicRef" + seeds].current.innerHTML;
      var Stripedhtml = currTag.replace(/<[^>]+>/g, '');
      if (this.state.bold) {
        Stripedhtml = React.createElement('b', { key: 1 }, Stripedhtml);
      }
      if (this.state.italic){
        Stripedhtml = React.createElement('i', { key: 1 }, Stripedhtml);
      }
      if (this.state.hTag) {
        var fontSize = this.state.fontSelect;
        Stripedhtml = React.createElement(fontSize, { key: fontSize }, Stripedhtml);
      }
      console.log(Stripedhtml, "Stripedhtml");
      ReactDOM.render(Stripedhtml, this["dynamicRef" + seeds].current);
    }
  }
  activeText=(e,index)=>{
    let currentTrg = parseInt(e.currentTarget.getAttribute('data-index'));
    let domlength = this.state.textInput.length;
    this.setState({ 
      isActive: currentTrg,
      counter: currentTrg,
      activeCount: domlength
    },()=> console.log(this.state,"GOOGLE"));
    this.refern.current.parentAccess(currentTrg);
  }
  generateHtmlEditor = (bold) =>{
    const { isActive } = this.state;
    return this.state.textInput.map((item, index) => {
      console.log(index, "AM GETING");
      if (typeof(item) !=="undefined"){
        return (<div key={index} onClick={e => this.activeText(e, index)} data-index={index} className={`textDraw ${isActive == index ? 'activeClassCus' : ''}`} ref={this["dynamicRef" + (index)]} style={this.state.defaultStyle[index]} id={item.name + (index)} dangerouslySetInnerHTML={{ __html: this.state.textchr[index] }}></div>)
      }else{
        return "";
      }
    });
  }
  editDrawWindow = (index)=>{
    console.log(this["dynamicRef" + index], "current");
    var getDrawText = this["dynamicRef" + index].current.outerHTML;
    var createHtml =[];
    var arraySet = getDrawText.split(" ");
    for (var i = 0; i < arraySet.length; i++) {
      createHtml.push(arraySet[i]);
    }
    let joinArray = createHtml.join(' ');
    joinArray = joinArray.replace('position: absolute;', '');
    this.setState({
      renderHtml: joinArray
    })
  }
  updateParentState = async (index,text=null,param=null)=>{
    if (param=='TEXT'){
      const updateText = [...this.state.textchr];
      updateText[index] = text;
      await this.setState({
        textchr: updateText
      });
    }else{
      console.log(this.state.textInput, this.state.textchr, this.state.defaultStyle,"SILVER NITERATE");
      let filterStatic = [...this.state.textInput.filter((item, idx) => index != idx)];
      let filterDynamic = [...this.state.textchr.filter((item, idx) => index != idx)];
      let filterStyle = [...this.state.defaultStyle.filter((item, idx) => index != idx)];
      console.log(filterDynamic, index, "childUpdate");
      this.setState({
        textInput: filterStatic,
        textchr: filterDynamic,
        defaultStyle: filterStyle,
        counter: this.state.counter+1,
        input: ""
      }, () => console.log(this.state, "getInputValue 333"));
    }
  }
  nextwords=()=>{
    let appendValue = this.state.input;
    if (appendValue){
      this.setState(prevState => ({
        counter: prevState.counter+1,
        input: ""
      }),()=> console.log(this.state.counter,"METHODS"));
    }
  }
  fontSizeSetting=(size)=>{
    this.setState({
      setFontsize: size
    });
    let seeds = this.state.counter;
    if (document.getElementById("txtAbsolu" + seeds)){
      console.log(document.getElementById("txtAbsolu" + seeds).children.length, "CILDS");
      if (document.getElementById("txtAbsolu" + seeds).children.length!=0){
        document.getElementById("txtAbsolu" + seeds).childNodes[0].style.fontSize = size + 'px';
      }else{
        document.getElementById("txtAbsolu" + seeds).style.fontSize = size + 'px';
      }
    }
    
  }
  waterMark=()=>{
    let seeds = this.state.counter;
    let rootElement = document.getElementById("txtAbsolu" + seeds);
    if (rootElement){
      let activeMark = this.state.watermark;
      this.setState({ watermark:!activeMark});
      if (this.state.watermark){
        rootElement.style.fontSize = '5rm';
        rootElement.style.fontWeight = '800';
        rootElement.style.textTransform = 'uppercase';
        rootElement.style.userSelect = 'none';
        rootElement.style.color = 'rgba(0,0,0,.14)';
      }else{
        rootElement.style.fontSize = '';
        rootElement.style.fontWeight = '';
        rootElement.style.textTransform = '';
        rootElement.style.userSelect = '';
        rootElement.style.color = '';
      }
    }
  }
  htmlRender=()=>{
    let $content = null;
    var indexCnt=0;
    // console.log(this.data.content.people.length,"ACTION");
    if (this.data.content.people.length > 0) {
      var removeHtmlO = [];
      this.data.content.people.map((item, index) => {
        let htmlContent = item.htmlContent;
        $content = htmlContent.substring(50);
        var splitArray = $content.split("</div>");
        removeHtmlO.push(splitArray);
      });
      var loopString = removeHtmlO[0];
      var removeHtmlT = [];
      var storeStyle =[];
      for (var i = 0; i < loopString.length; i++) {
        if (loopString[i] != '') {
          var splitTwo = loopString[i].split(">"); 
          removeHtmlT[i] = [];
          for (var j = 0; j < splitTwo.length; j++) {
            if (j == 0) { 
              var getStyle = splitTwo[j].split("style=");
              var getStyleCss = getStyle[1].split("id=");
              storeStyle.push(getStyleCss[0]);
              continue;
            }
            removeHtmlT[i].push(splitTwo[j]);
          }
        }
      }
      var getFullHtml = [];
      // const { isActive } = this.state;
      var definedHtmTags = ['<h1', '</h1', '<h2', '</h2', '<h3', '</h3', '<h4', '</h4', '<h5', '</h5', '<h6', '</h6', '<b', '</b', '<i', '</i']; //futhur more data add have to define here..
      var dynamicText = [...this.state.textchr];
      var staticText = [...this.state.textInput];
      var dynamicStyle = [...this.state.defaultStyle];
      if (removeHtmlT.length!=0){
        for (var i = 0; i < removeHtmlT.length; i++) {
          for (var j = 0; j < removeHtmlT[i].length; j++) {
            var strinHtml = (definedHtmTags.includes(removeHtmlT[i][j]) ? removeHtmlT[i][j] + '>' : removeHtmlT[i][j]);
            getFullHtml.push(strinHtml);
          }
          var joinHtml = getFullHtml.join(" ");
          const setSpan = { name: "txtAbsolu"};
          staticText[i] = setSpan;
          console.log(dynamicText, staticText, i,"staticText");
          let styleApply = storeStyle[i].replace(/[" ]+/g, '');
          let reactFormCss = this.cssReactFormatting(styleApply);
          dynamicStyle[i] = reactFormCss;
          dynamicText[i] = joinHtml;
          getFullHtml=[];
          indexCnt++;
        }
      }else{
        indexCnt++;
      }
      let initiCount = (this.state.counter + indexCnt-1);
      this.setState({
        textInput: staticText,
        textchr: dynamicText,
        defaultStyle: dynamicStyle,
        counter: initiCount,
        activeCount: initiCount
      }, () => console.log(this.state, "ALL STATE"));
      // return makeHtml;
    }
  }

  cssReactFormatting = (styleApply)=>{
    var getStyleCss = styleApply.split(";");
    var { position, left, top, fontWeight, textTransform, userSelect, color, fontSize} = '';
    for (var i=0; i < getStyleCss.length; i++){
      if (getStyleCss[i]!=""){
        var aptCss = getStyleCss[i].split(":");
        let switchCss = aptCss[0];
        switch (switchCss){
          case 'position':
            position = '' + aptCss[1] + '';
            break;
          case 'left':
            left = '' + aptCss[1] + '';
            break;
          case 'top':
            top = '' + aptCss[1] + '';
            break;
          case 'font-weight':
            fontWeight = ''+ aptCss[1] + '';
            break;
          case 'text-transform':
            textTransform = '' + aptCss[1] + '';
            break;
          case 'user-select':
            userSelect = '' + aptCss[1] + '';
            break;
          case 'color':
            color = '' + aptCss[1] + '';
            break;
          case 'font-size':
            fontSize = '' + aptCss[1] + '';
            break;
        }
      }
    }
    let cssStyle = { position: position, left: left, top: top, fontWeight: fontWeight, textTransform: textTransform, userSelect: userSelect, color: color, fontSize: fontSize };
    return cssStyle;
  }

  saveCustomeBaner=()=>{
    console.log(this.myRef.current.innerHTML,"SAVE DATA ");
  }

  componentWillMount = async ()=>{
    await this.htmlRender();
  }
  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }
    return (
      <div className="windowPanel">
        <div className="windowHead inline-css">
          <h6 className="rm-Mrg">Banner Setup</h6>
          <ul className="list-inline list-unstyled rm-Mrg">
            <li className="list-inline-item"><FontAwesomeIcon icon={faTimes} /></li>
          </ul>
        </div>
        <div className="windowContent">
          <Row className="rowpadd_btm">
          <Col>
            <Form className="formbrd" onSubmit={this.handleSubmit}>
            <div className="imageUpload">
              <div className="customeblk">
                <Row className="mb-2">
                  <Col>
                        <label className="btn btn-outline-primary btn-sm mb-0">
                        <input onChange={this._handleImageChange} id="my-file-selector" type="file" className="d-none"/>
                          Browse...
                      </label>
                        {' '}
                        <Button size="sm" variant="outline-primary" onClick={(e) => this.fontSize(e, 'B')} type="button">bold</Button>{' '}
                        <DropdownButton onSelect={(e) => this.fontSize(e, 'H')} as={ButtonGroup} id="dropdown-button-drop" size="sm" variant="outline-primary" title="Heading">
                          <Dropdown.Item eventKey="h1"><h1>H1</h1></Dropdown.Item>
                          <Dropdown.Item eventKey="h2"><h2>H2</h2></Dropdown.Item>
                          <Dropdown.Item eventKey="h3"><h3>H3</h3></Dropdown.Item>
                          <Dropdown.Item eventKey="h4"><h4>h4</h4></Dropdown.Item>
                          <Dropdown.Item eventKey="h5"><h5>H5</h5></Dropdown.Item>
                          <Dropdown.Item eventKey="h6"><h6>H6</h6></Dropdown.Item>
                        </DropdownButton>{' '}
                        <Button variant="outline-primary" size="sm" onClick={(e) => this.fontSize(e, 'I')} type="button">Italic</Button>{' '}
                        <ModalChild editDrawWindow={this.editDrawWindow} fromChildClick={this.updateParentState} textInputChild={this.state.textInput} renderHtml={this.state.renderHtml} ref={this.refern} />{' '}
                        <DropdownButton onSelect={(e) => this.fontSizeSetting(e)} as={ButtonGroup} id="dropdown-button-drop" size="sm" variant="outline-primary" title="Font Size">
                          <Dropdown.Item eventKey="8"><span>8</span></Dropdown.Item>
                          <Dropdown.Item eventKey="9">9</Dropdown.Item>
                          <Dropdown.Item eventKey="12">12</Dropdown.Item>
                          <Dropdown.Item eventKey="16">16</Dropdown.Item>
                          <Dropdown.Item eventKey="20">20</Dropdown.Item>
                          <Dropdown.Item eventKey="42">42</Dropdown.Item>
                          <Dropdown.Item eventKey="62">62</Dropdown.Item>
                          <Dropdown.Item eventKey="72">72</Dropdown.Item>
                          <Dropdown.Item eventKey="92">92</Dropdown.Item>
                          <Dropdown.Item eventKey="132">132</Dropdown.Item>
                          <Dropdown.Item eventKey="152">152</Dropdown.Item>
                        </DropdownButton>{' '}
                        {' '}
                        <Button variant="outline-primary" size="sm" onClick={(e) => this.waterMark()} type="button">Water Mark</Button>{' '}
                        <div className="inlnBlk">
                          <span>top-bottom</span>
                          <RangeSlider className="rangetop" value={this.state.rangeone} onChange={this.changeVertical} />
                        </div>
                        <div className="inlnBlk">
                          <span>right-left</span>
                          <RangeSlider className="rangetop" value={this.state.rangetwo} onChange={this.changeHorizontal} />
                        </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="7">
                      <InputGroup>
                        <FormControl placeholder="Text..." className="form-control form-control-sm" value={this.state.input} onChange={this.handleChange}
                        />
                        <InputGroup.Prepend>
                            <Button size="sm" variant="outline-primary" type="button" onClick={this.appendText}>Appear Text</Button>
                        </InputGroup.Prepend>
                      </InputGroup>
                  </Col>
                  <Col className="maxwidth">
                    <Button variant="primary" size="sm" onClick={this.nextwords} type="button">Next Word</Button>
                  </Col>
                  <Col className="maxwidth">
                    <Button variant="success" size="sm" onClick={this.saveCustomeBaner} type="button">Save</Button>
                  </Col>
                </Row>
              </div>
              <div ref={this.myRef} className="imagePreview">
                <div className="randomText">
                  {$imagePreview}
                  {this.generateHtmlEditor()}
                </div>
              </div>
            </div>
            </Form>
          </Col>
          </Row>
        </div>
      </div>
    )
  }

}

export default Imageupload;