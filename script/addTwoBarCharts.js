﻿'use strict';
requirejs(['ThreeDBarChart'], function(ThreeDBarChart) {

                let file;
                
                file = './data/data1.json';
                const bar1 = new ThreeDBarChart(document.querySelector('.barChart1'), {ledge: 0.2, animationSpeed: -0.05, text: {size: 28, width: 0.4}}, file);
                               
                file = './data/data2.json';
                const bar2 = new ThreeDBarChart(document.querySelector('.barChart2'), {axisTicksCount: 7, ledge: 0.2, text: {color: '#0000f0'}}, file);                
});
