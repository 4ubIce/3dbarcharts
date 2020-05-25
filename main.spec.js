require.config({
  baseUrl: './script', 
  paths: {
      'jasmine': ['../lib/jasmine-3.5.0/jasmine'],
      'jasmine-html': ['../lib/jasmine-3.5.0/jasmine-html'],
      'jasmine-boot': ['../lib/jasmine-3.5.0/boot']
  },
  // shim: makes external libraries compatible with requirejs (AMD)
  shim: {
    'jasmine-html': {
      deps : ['jasmine']
    },
    'jasmine-boot': {
      deps : ['jasmine', 'jasmine-html']
    }
  }
});

require(['jasmine-boot'], function () {
  require(['../spec/spec'], function(){
    window.onload();
  })
});