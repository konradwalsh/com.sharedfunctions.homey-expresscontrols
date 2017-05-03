'use strict';
const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');
const util = require('util');

let oldTemp = -100; // to compare with new temp   in trigger
let newTemp = -100;  // measured temp 


// http://www.cd-jackson.com/zwave_device_uploads/355/9-Multisensor-6-V1-07.pdf

module.exports = new ZwaveDriver (path.basename(__dirname), {


    init: (devices_data, callback) => {


      
       
        util.log('this is init driver');





       CommandClass.COMMAND_CLASS_CONFIGURATION.CONFIGURATION_GET( {'Parameter Number': 7}, null );



            //    CommandClass.COMMAND_CLASS_CONFIGURATION.CONFIGURATION_GET({ 'Parameter Number': 3 })


                //    command_class = 'COMMAND_CLASS_CONFIGURATION',
                //        command_get = 'CONFIGURATION_GET',
                //            command_get_parser = () => ({
                //                'Parameter Number': 3
                //            }),
                //                command_report = 'CONFIGURATION_REPORT'
            },

            capabilities: {

                measure_battery: {
                    command_class: 'COMMAND_CLASS_BATTERY',
                    command_get: 'BATTERY_GET',
                    command_report: 'BATTERY_REPORT',
                    command_report_parser: report => {
                        if (report['Battery Level'] === "battery low warning") return 1;

                        return report['Battery Level (Raw)'][0];
                    },
                    'pollInterval': "poll_interval",
                       'getOnWakeUp': true,
                },

                alarm_motion: {

                    //#region sensor multilevel
                    // 'multiChannelNodeId': 1,
                    // 'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
                    //'command_get': 'SENSOR_MULTILEVEL_GET',
                    // 'command_report': 'SENSOR_MULTILEVEL_REPORT',
                    // 'command_report_parser': function (report) {
                    //     return report['Sensor Value (Parsed)'];
                    // },

                    //#endregion 

                    //#region  basic

//#region  sensor binary


                    //'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
                    //'command_get': 'SENSOR_BINARY_GET',
                    //'command_report': 'SENSOR_BINARY_REPORT',
                    //'command_report_parser': report => {
                    //report['Sensor Value'] === 'detected an event'

                    //return report['Sensor Value'] === 'detected an event'

                    //},



//#endregion


 //#region  basic
                    command_class: 'COMMAND_CLASS_BASIC',
                    command_report: 'BASIC_SET',
                    command_report_parser: report => {
                    report['Value'] > 0

                  return  (report['Value'] > 0)
                    },


 //#endregion




                 'pollInterval': "poll_interval",
                  'getOnWakeUp': true,

                  
            },




                measure_temperature: {

                    //#region tryout 1
                    //command_class: 'COMMAND_CLASS_SENSOR_MULTILEVEL',
                    //command_get_parser: () => {
                    //    return {
                    //        'Sensor Type': 'Temperature (version 1)',
                    //        'Properties1': {
                    //            'Scale': 0
                    //        }
                    //    }
                    //},

                    //command_report: 'SENSOR_MULTILEVEL_REPORT',
                    //command_report_parser: report => {
                    //    if (report['Sensor Type'] === 'Temperature (version 1)')
                    //        return report['Sensor Value (Parsed)'];

                    //    return null;
                    //},

                    //#endregion

                    //#region tryout 2




                    //'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
                    //'command_get': 'SENSOR_MULTILEVEL_GET',
                    //'command_get_parser': () => {
                    //    return {
                    //        'Sensor Type': 'Temperature (version 1)',
                    //        'Properties1': {
                    //            'Scale': 0
                    //        }
                    //    };
                    //},


                    //'command_report': 'SENSOR_MULTILEVEL_REPORT',
                    //'command_report_parser': report => {
                    //    if (report['Sensor Type'] === 'Temperature (version 1)' &&
                    //        report.hasOwnProperty("Level") &&
                    //        report.Level.hasOwnProperty("Scale") &&
                    //        report.Level.Scale === 0)
                    //        return report['Sensor Value (Parsed)'];

                    //#endregion

                    //#region  sensor 1-4 

                    //'command_report': 'SENSOR_MULTILEVEL_REPORT',
                    //'command_report_parser': report => {
                    //    if (report['Sensor Type'] === 'Temperature (version 1')   //)
                    //        return report['Sensor Value (Parsed)'];

                    //    return null;
                    //   },

                    //#endregion

                    //#region version 5 - 10

                

                    'multiChannelNodeId': 3,
                    'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
                    'command_get': 'SENSOR_MULTILEVEL_GET',
                    'command_get_parser': () => {
                        return {
                            'Sensor Type': 'Temperature (version 1)',
                            'Properties1': {
                                'Scale': 1
                            }
                        };
                    },


                    'command_report': 'SENSOR_MULTILEVEL_REPORT',
                    'command_report_parser': (report, node) => {

                        let  celsiusTemp 

                        if (report['Sensor Type'] === 'Temperature (version 1)' &&
                            report.hasOwnProperty("Level") &&
                            report.Level.hasOwnProperty("Scale") &&
                            report.Level.Scale === 1)

                          //util.log('  node 1  ', util.inspect(node, false, null));
                            util.log('  node 1 state ', util.inspect(node.state, false, null));
                            util.log('  node 1 dd ', util.inspect(node.device_data, false, null));
                          

                            if (node &&
                                node.hasOwnProperty('state'))
                            //    &&
                            //    node.state.hasOwnProperty('measure_temperature')) //&& node.state['measure_temperature'] !== (report['Sensor Value (Parsed)'] - 32) / 1.8)

                            {

                                util.log('  node 2 ', util.inspect(node.state, false, null));

                                 celsiusTemp  = Number(((report['Sensor Value (Parsed)'] - 32) / 1.8).toFixed(1))

                             //   celsiusTemp = parseFloat(celsiusTemp);

                                util.log('celsiustemp  ', celsiusTemp)

                                const token = {
                                    "temp": (report['Sensor Value (Parsed)']-32) /1.8
                                };

                                util.log('oldTemp', oldTemp);

                                newTemp = celsiusTemp

                                if ( oldTemp != -100) {

                                    const consecutiveTemps = { 'oldTemp': oldTemp, 'newTemp': newTemp }


                                    Homey.manager('flow').triggerDevice('hms100_lower', null , consecutiveTemps, node.device_data, function (err, result) {
                                        if (err) return Homey.error(err);



                                    });

                                }
                            }

                            oldTemp = celsiusTemp;
                          
                            return celsiusTemp  //(report['Sensor Value (Parsed)'] - 32) / 1.8   return report['Sensor Value (Parsed)'];

                    },
                    //#endregion

                    //#region basic
                    //'command_class': 'COMMAND_CLASS_BASIC',
                    //  'command_report': 'BASIC_SET',
                    //  'command_report_parser': report => report['Value'] === 255,

                    //#endregion

                    //#region binary
                    //     command_class  : 'COMMAND_CLASS_SENSOR_BINARY',
                    //     command_get : 'SENSOR_BINARY_GET',
                    //     command_report : 'SENSOR_BINARY_REPORT',
                    //     command_report_parser : report => report['Sensor Value'] === 'detected an event'
                    //,

                    //#endregion



                    'getOnWakeUp': true,


                    	'pollInterval': "poll_interval"

                },   // end temp



                measure_luminance_percentage:

                {

                    //#region binary


                    //[{
                    //    command_class: 'COMMAND_CLASS_SENSOR_BINARY',
                    //    command_get: 'SENSOR_BINARY_GET',
                    //    command_report: 'SENSOR_BINARY_REPORT',
                    //    command_report_parser: report => report['Sensor Value'] === 'detected an event'
                    //},

                    //{
                    //    'command_class': 'COMMAND_CLASS_BASIC',
                    //    'command_report': 'BASIC_SET',
                    //    'command_report_parser': report => report['Value'] === 255
                    //}],


                    //#endregion



                    //  CommandClass.COMMAND_CLASS_CONFIGURATION.CONFIGURATION_GET({ 'Parameter Number': 7 }, null);


                    // version 5 - 10
                    'multiChannelNodeId': 2,
                    'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
                    'command_get': 'SENSOR_MULTILEVEL_GET',
                    'command_get_parser': () => {
                        return {
                            'Sensor Type': 'Luminance (version 1)',
                            'Properties1': {
                                'Scale': 0
                            }
                        };
                    },

                    // version 5 - 10

                    'command_report': 'SENSOR_MULTILEVEL_REPORT',
                    'command_report_parser': report => {
                        if (report['Sensor Type'] === 'Luminance (version 1)' &&
                            report.hasOwnProperty("Level") &&
                            report.Level.hasOwnProperty("Scale") &&
                            report.Level.Scale === 0)
                            return report['Sensor Value (Parsed)'];


                    },

             
               






                    'getOnWakeUp': true,

                    'pollInterval': "poll_interval"

                }  // end luminance

            },

            //  http://www.pepper1.net/zwavedb/device/21
            //  http://www.expresscontrols.com/pdf/EZMotion+OwnerManual.pdf has more settings

            settings : {                       // snsitivity default - 56  range 0 -- 1   0 255  -56 255-56 199
                1: {
                    index: 1,
                    size: 1
                },
                2: {
                    index: 2,                 // on time  range  0 -- 1
                    size: 1
                },
                3: {                          //led  off = 0 or 1       r -1 = on 
                    index: 3,
                    size: 1
                },
                4: {                         // light treshold between 0 and 100 %  
                    index: 4,
                    size: 1,
                    'signed': false
                },
                5: {                          // stay awake 0 => No   1, -1 => Yes
                    index: 5,                //The WakeUpTime can be configured from 0.1 to 25.0 hours in 6 minute (tenths of an hour) increments. 
                    size: 1
                },
               6: {                         // value send with basic set on command 
                    index: 6,
                    size: 1
                },
               7: {                         // TempAdj
                    index: 7,
                    size: 1,
                    'signed': true
               },
              8: {                         // set reporting cpability Bit 0=Temperature Bit 1= LuminanceBit 2= Battery level
                   index: 8,                //  0= off 1 = 1 7 is all on
                   size: 1
               }
            }









})  // driver

Homey.manager('flow').on('trigger.hms100_lower', function (callback, args, state) {


    util.log('state', state)  // input from event input  in this case the temp that is red
    util.log('args', args)  // input from trigger card

    util.log('args.temperature2  ', args.temperature2)
    util.log('args.temperature2 type of ', typeof args.temperature2)

    // todo if arg is changed they can both be to small
    if (state.oldTemp >= args.temperature2 && state.newTemp < args.temperature2) {
        callback(null, true);  // if true flow runs of false flow doesnt run
    } else { callback(null, false);}




    //if (node &&
    //    node.hasOwnProperty('state') &&
    //    node.state.hasOwnProperty('measure_temperature')) {
    //    callback(null, node.state['measure_temperature']);
    //}

})












    //Homey.manager('flow').trigger('Received_X10_command', tokens, state, function (err, result) {
    //    if (err) return Homey.error(err);
    //});


//Homey.manager('flow').on('condition.FGBS-001_i1', (callback, args) => {
//    const node = module.exports.nodes[args.device.token];

//    if (node &&
//        node.hasOwnProperty('state') &&
//        node.state.hasOwnProperty('alarm_generic.contact1')) {
//        callback(null, node.state['alarm_generic.contact1']);
//    }
//});
    

//module.exports.on('initNode', token => {
//    const node = module.exports.nodes[token];
//    util.log('parameter1  ',  node)
//    if (node) {
//        setTimeout(function () {
//           util.log('parameter2')
               
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': 7 }, null);
//        }, 5000); 
//        }
//    }
//);


//module.exports.on('initNode', token => {
//    const node = module.exports.nodes[token];
//    if (node) {
//        if (node.instance.CommandClass.COMMAND_CLASS_WAKE_UP) {
//            node.instance.CommandClass.COMMAND_CLASS_WAKE_UP.on('report', (command, report) => {

//                if (command.name === 'WAKE_UP_NOTIFICATION') {
//                    util.log('parameter1  ')
//                    node.instance.CommandClass['COMMAND_CLASS_BATTERY'].BATTERY_GET({});
//                    node.instance.CommandClass['COMMAND_CLASS_WAKE_UP'].WAKE_UP_INTERVAL_GET({});
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([0]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([1]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([2]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([3]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([4]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([5]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([6]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([7]) }, null);
//                    node.instance.CommandClass['COMMAND_CLASS_CONFIGURATION'].CONFIGURATION_GET({ 'Parameter Number': new Buffer([8]) }, null);
//                }
//            });
//        }
//    }
//});

