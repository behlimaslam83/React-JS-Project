
import React, { Component } from 'react';
import './ItemInfo.scss';
import { Col, Row, Form, Table, Collapse } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import moment from 'moment';


class ItemInfoProduct extends Component {
  constructor(props) {
    super(props);
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChildEvent = this.handleChildEvent.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.state = {
      country_specific_price : this.props.country_specific_price,
      open : [{0 : false}],
      startDate: new Date(),
      endDate: moment("31/Dec/2099", 'DD-MMM-YYYY').toDate(),
      tr : 
        [{
          id:'',
          product: '',
          currency:'',
          primary_price: '',
          product_price_yn   : 'Y',
          child_tr : [{
            id:'',
            country_currency:'',
            price: '',
            offer_yn: 'N',
            offer_price: '',
            offer_pct: '',
            old_price: '',
            from_date: new Date(),
            upto_date: moment("31/Dec/2099", 'DD-MMM-YYYY').toDate(),
          }]
        }]
    };

    
  }

  handleAddEvent(event){
    event.preventDefault();
    var pro_price = {
      id                 :'',
      product            : '',
      currency           : '',
      primary_price      : '',
      product_price_yn   : 'Y',
      child_tr : [{
        id               : '',
        country_currency : '',
        price            : '',
        offer_yn         : 'N',
        offer_price      : '',
        offer_pct        : '',
        old_price        : '',
        from_date: this.state.startDate,
        upto_date: this.state.endDate,
      }]
    }

    var open = true;


    this.state.open.push(open);
    this.state.tr.push(pro_price);
    this.setState({...this.state.tr});
    //this.renderRows()
    this.props.productRecord(this.state.tr);
    console.log(this.state.tr);

    // this.state.tr.map((row, key) => {
    //   console.log(row);
    // })

    this.setState(this.state.tr);
    
  }

  removeRow(id){
    //console.log(id)
    this.state.tr.splice(id, 1);
    this.setState(this.state.tr);
    console.log(this.state.tr)
  }

  removeChildRow(child_key, key){
    console.log(this.state)
    this.state.tr[key].child_tr.splice(child_key, 1);
    this.setState(this.state.tr);
    console.log(this.state.tr);
  }

  tabe(id){
    this.setState({country_specific_price : id});
    this.props.productRecord(this.state.tr);
    this.setState({ tr: this.props.fetch });
  }

  tabe2(id){
    console.log('come....');
    //this.props.productRecord(this.state.tr);
    this.setState({ tr: this.props.fetch });
    this.renderRows()
  }


  handleInputChange (key, child_key, event, data=false, mode=false) {
    console.log('key---' + key + 'child_key---' + child_key)
    const { id, value, name, checked } = event.target;
      console.log(checked)
      for(var i=0; i < this.state.tr.length; i++)
      {
        if(key == i && id == 'product[]'){
          this.state.tr[i].product = value
        }
        if(key == i && id == 'currency[]'){
          this.state.tr[i].currency = value
        }
        if(key == i && id == 'primary_price[]'){
          this.state.tr[i].primary_price = value
        }

          //console.log(child_key)
          for(var j=0; j < this.state.tr[key].child_tr.length; j++)
          {
          
            if(child_key == j && id == 'country_currency[]'){
              this.state.tr[key].child_tr[child_key].country_currency = value;
            }
            if(child_key == j && id == 'price[]'){
              this.state.tr[key].child_tr[child_key].price = value;
            }
            if(child_key == j && id == 'offer_yn[]'){
             
              var values = (checked ? 'Y' : 'N');
             
              this.state.tr[key].child_tr[child_key].offer_yn = values;
            }
            if(child_key == j && id == 'offer_price[]'){
              this.state.tr[key].child_tr[child_key].offer_price = value;
            }
            if(child_key == j && id == 'offer_pct[]'){
              this.state.tr[key].child_tr[child_key].offer_pct = value;
            }
            if(child_key == j && id == 'old_price[]'){
              this.state.tr[key].child_tr[child_key].old_price = value;
            }
            
            

          }
      }
   
      this.props.productRecord(this.state.tr);

    
    console.log(this.state.tr);

  }

  handleChildEvent(key){
   
    var child_price = {
      id:'',
      country_currency:'',
      price: '',
      offer_yn: 'N',
      offer_price: '',
      offer_pct: '',
      old_price: '',
      from_date: this.state.startDate,
      upto_date: this.state.endDate,
    }
    this.state.tr[key].child_tr.push(child_price);
    this.setState(this.state.tr);
    //this.renderRows()
  }

  setOpen(type, key){
    let open = [...this.state.open];

  //  var open = this.state.open[key];
    open[key] = !type;
    this.setState({open});
  }


  changeDate(key, child_key, data, mode){
    // console.log(key);
    // console.log(child_key);
    // console.log(moment(data).format('DD-MMM-YYYY'));
    // console.log(mode);
    //console.log(data);
    
    
    // for(var i=0; i < this.state.tr.length; i++)
    // {
    //   for(var j=0; j < this.state.tr[key].child_tr.length; j++)
    //   {
      
    //     if(child_key == j && mode == 'FD'){
    //       this.state.tr[key].child_tr[child_key].from_date = moment(data).format('DD-MMM-YYYY');
    //     }
    //     if(child_key == j && mode == 'UD'){
    //       this.state.tr[key].child_tr[child_key].upto_date = moment(data).format('DD-MMM-YYYY');
    //     }
    //   }
    // }
    //console.log(this.state.tr);
    //this.props.productRecord(this.state.tr);
    
    // var format = moment(data).format('DD-MMM-YYYY');
    //var end_format = moment("31/Dec/2099", 'DD-MMM-YYYY').toDate();
    //(mode === 'FD' ? this.setState({ startDate: data }) : this.setState({ endDate: data }));
    //(mode === 'UD' ? this.setState({ from_date: end_format }) : this.setState({ upto_date: end_format }));
  }

  

    

  // componentDidUpdate(prevProps, prevState, snapshot){
  //   if (this.props.show && !prevProps.show) {
  //     console.log(this.props.fetch)
  //    // this.setState({ tr: this.props.fetch });
  //   }  
  //   //this.props.productRecord(this.state.tr);
  // }
  
  renderRows() {

    return this.state.tr.map((row, key) => {
      return (
        <> 
        {/* <Col sm={6}>
          {JSON.stringify(this.props.country_specific_price)}
        </Col> */}
          <tr className="parent">
           
            <td>
              {key+1}
              {this.state.country_specific_price === 'N' ? 
                <div onClick={() => this.setOpen(this.state.open[key], key)} aria-controls="example-collapse-text" aria-expanded={this.state.open[key]}>Add Child</div>
              : ''}
            </td>
            <td>
              
              <Form.Control as="select" id="product[]" value={row.product} onChange={this.handleInputChange.bind(this, key, false)} disabled={row.id ? true : false}>
                <option>Select Product</option>
                {this.props.product && this.props.product.map((data,i) => (
                  <option value={data.id} key={i}>{data.desc}</option>
                ))}
              </Form.Control>
            </td>
            <td>
              <Form.Control as="select" id="currency[]" value={row.currency} onChange={this.handleInputChange.bind(this, key, false)}>
                <option>Select Currency</option>
                {this.props.currency && this.props.currency.map((data,i) => (
                  <option value={data.id} key={i}>{data.desc}</option>
                ))}
              </Form.Control>
            </td>
            <td>
              <Form.Control type="text" id="primary_price[]" name="primary_price" value={row.primary_price} placeholder="Price" onChange={this.handleInputChange.bind(this, key, false)}/>
            </td>
            <td onClick={this.removeRow.bind(key)}>
              Delete
            </td>
          </tr>

            {/* <code>
              {JSON.stringify(row.child_tr)}
            </code> */}

          {this.state.country_specific_price === 'N' && row.child_tr &&
          <Collapse in={row.child_tr[0].id ? true : !this.state.open[key] }>
            <tr className="child">
            <td colspan="8">

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    
                    <th className="col-width">Currency</th>
                    <th>Price</th>
                    <th>Offer Y/N</th>
                    <th>Offer Price</th>
                    <th>Offer %</th>
                    <th>Old Price</th>
                    <th>From Date</th>
                    <th>Upto Date</th>
                    <th onClick={this.handleChildEvent.bind(this, key)}> + </th>
                  </tr>
                </thead>
                <tbody>
                      { row.child_tr.map((row, child_key) => {
                        return(
                        <tr>
                        <td>
                          {child_key + 1}

                          <Form.Control type="hidden" id="ip_sys_id[]" value={row.id} name="price" placeholder="Price" onChange={this.handleInputChange.bind(this, key, child_key)}/>

                          
                        </td>
                        <td>
                          <Form.Control as="select" id="country_currency[]" value={row.country_currency} onChange={this.handleInputChange.bind(this, key, child_key)}>
                            <option>Select Currency</option>
                            {this.props.currency && this.props.currency.map((data,i) => (
                              <option value={data.id} key={i} >{data.desc}</option>
                            ))}
                          </Form.Control>
                        </td>
                        <td>
                          <Form.Control type="text" id="price[]" name="price" value={row.price} placeholder="Price" onChange={this.handleInputChange.bind(this, key, child_key)}/>
                        </td>
                        <td>
                          {/* <Form.Control type="text" id="offer_yn[]" name="offer_yn" value={row.offer_yn} placeholder="Offer Y/N" onChange={this.handleInputChange.bind(this, key, child_key)}/> */}
                          <Form.Check id="offer_yn[]" onChange={this.handleInputChange.bind(this, key, child_key)} checked={row.offer_yn === 'Y' ? true : false} type="checkbox" name="offer_yn" />

                        </td>
                        <td>
                          <Form.Control type="text" id="offer_price[]" name="offer_price" value={row.offer_price} placeholder="Offer Price" onChange={this.handleInputChange.bind(this, key, child_key)}/>
                        </td>
                        <td>
                          <Form.Control type="text" id="offer_pct[]" name="offer_pct" value={row.offer_pct} placeholder="Offer Pct" onChange={this.handleInputChange.bind(this, key, child_key)}/>
                        </td>
                        <td>
                          <Form.Control type="text" id="old_price[]" name="old_price" value={row.old_price} placeholder="Old Price" onChange={this.handleInputChange.bind(this, key, child_key)}/>
                        </td>
                        <td>
                          <DatePicker id="from_date[]" selected={row.from_date} className="form-control form-control-sm" name="from_date" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(key, child_key, date, 'FD')}/>
                        </td>
                        <td>
                          <DatePicker id="upto_date[]" selected={row.upto_date} className="form-control form-control-sm" name="upto_date" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(key, child_key, date, 'UD')}/>
                        </td>
                        <td onClick={this.removeChildRow.bind(this, child_key, key)}>
                          Delete
                        </td>
                      </tr>
                        )
                      })
                      }
                  
                </tbody>
              </Table>
              </td>
            </tr>
          </Collapse>
          }
      </>
      )
    });
  }

  render() {

    return (
      <>

        
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Default Currency</th>
              <th>Primary Price</th>
              <th onClick={this.handleAddEvent.bind(this)}> + </th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </Table>
      </>
    );
  }
}


export default ItemInfoProduct;


