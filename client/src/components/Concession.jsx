import React, { Component } from 'react';

class Concession extends Component {
  constructor () {
  super()
  this.state = {
    hiddenPopcorn: true,
    popcornQuantity: 0,
    hiddenCandy: true,
    candyQuantity: 0,
    hiddenSnacks: true,
    snacksQuantity: 0,
    hiddenBeverages: true,
    beveragesQuantity: 0
  }
}

togglePopcorn () {
  this.setState({
    hiddenPopcorn: !this.state.hiddenPopcorn
  })
}

toggleCandy () {
  this.setState({
    hiddenCandy: !this.state.hiddenCandy
  })
}
toggleSnacks () {
  this.setState({
    hiddenSnacks: !this.state.hiddenSnacks
  })
}

toggleBeverages () {
  this.setState({
    hiddenBeverages: !this.state.hiddenBeverages
  })
}

  render() {
    return (
    <div>
      <div>
        <p className="concession_title" onClick={this.togglePopcorn.bind(this)} >
          Popcorn
        </p>
        {!this.state.hiddenPopcorn && <Popcorn />}
      </div>
      <div>
        <p className="concession_title" onClick={this.toggleCandy.bind(this)} >
          Candy
        </p>
        {!this.state.hiddenCandy && <Candy />}
      </div>
      <div>
        <p className="concession_title" onClick={this.toggleSnacks.bind(this)} >
          Snacks
        </p>
        {!this.state.hiddenSnacks && <Snacks />}
      </div>
      <div>
        <p className="concession_title" onClick={this.toggleBeverages.bind(this)} >
          Beverages
        </p>
        {!this.state.hiddenBeverages && <Beverages />}
      </div>
    </div>
    );
  }
}

const Popcorn = () => (
  <div className="popcorn_toggle">
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Popcorn (Small)</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Popcorn (Medium)</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Popcorn (Large)</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
  </div>
)

const Candy = () => (
  <div className="candy_toggle">
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Sourpatch Kids</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Sourpatch Kids</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Milk Duds</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> Butterfinger</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item"> M&Ms</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
  </div>
)

const Snacks = () => (
  <div className="snacks_toggle">
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item">Pretzel</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item">Nachos</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item">Peanuts</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
  </div>
)

const Beverages = () => (
  <div className="beverages_toggle">
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item">Soft Drink (Small)</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item">Soft Drink (Medium)</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
    <div className="row item_row">
      <p className="col-md-3 col-sm-3 col-lg-3 concession_item">Soft Drink (Large)</p>
      <p className="col-md-2 col-sm-2 col-lg-2 sub_tit">Qty:</p>
      <input className="col-md-2 col-sm-2 col-lg-2"></input>
    </div>
  </div>
)

export default Concession;
