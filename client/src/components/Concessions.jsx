import React, { Component } from 'react';
import $ from 'jquery';

class Concessions extends Component {

  render() {
    return (
        <div id="concessions">
          <p id="popcorn" class="concession_title">popcorn</p>
            <div class="popcorn_toggle">
                <p> Small</p>
                <p> Medium</p>
                <p> Large</p>
            </div>
          <p id="candy" class="concession_title" onClick={this.candyToggle}>candy</p>
            <div class="candy_toggle">
              <p>Sourpatch Kids</p>
              <p>Milk Duds</p>
              <p>Butterfinger</p>
              <p>Mike and Ikes</p>
              <p>M&Ms</p>
            </div>
          <p id="snacks" class="concession_title">snacks</p>
            <div class="snacks_toggle">
              <p>Pretzel</p>
              <p>Nachos</p>
              <p>Peanuts</p>
            </div>
          <p id="beverages" class="concession_title">beverages</p>
            <div class="beverages_toggle">
              <p>Kola</p>
              <p>Diet Kola</p>
              <p>Cream</p>
              <p>Cherry</p>
              <p>Gassosa</p>
            </div>
          <button>Click Me</button>
        </div>
    );
  }
}

export default Concessions;
