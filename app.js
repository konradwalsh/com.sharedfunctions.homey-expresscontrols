"use strict";
const fs = require('fs');
const path = require('path');
const util = require('util');
const convert = require('./lib/baseConverter').jan.ConvertBase;
const helpFunctions = require('./lib/helpFunctions.js').jan;
const libClass = require('./lib/libClass.js');
const EventEmitter = require('events').EventEmitter;
const Log = require('homey-log').Log;
const ZwaveDriver = require('homey-zwavedriver');

const counter = 0;
const counter2 = 0;

class App {

    constructor() {

        this.lib = new libClass();
        this.lib.log = this.lib.log.bind(this);
        this.debug = true;//  to set debug on or off 
        this.lib.log(` ${this.constructor.name}  is this. `, util.inspect(this));
        this.homeyDevices = [];
        this.devicesData = [];
        this.app = ''
        this.jil = ""

        this.init = () => {
            this.lib.log('this is zwave.app', util.inspect(this.homeyDevices, false, null))
         
        } // end init
    } // end constructor  
    // create a generic driver 
}  // end class

module.exports = new App();
