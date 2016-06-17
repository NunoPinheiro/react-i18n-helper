import { createStore } from 'redux';
import Polyglot from 'node-polyglot';
import $ from 'jquery';

var polyglot = new Polyglot();

var i18nReducer = function(state, event){
  return {"locale" : event.locale};
};

var i18nStore = createStore(i18nReducer, {locale : ""});

var i18nFileFetchConfiguration = {serverPath : "", clientPath : "", localeFallback : "en-GB", initialState : {locale : "en-GB", data : {}}};

var i18nEventsListenerMixin = {
  componentDidMount : function(){
    this.i18nUnsubscribe = i18nStore.subscribe(this.reRenderOnI18NEvent.bind(this));
  },
  componentWillUnmount : function(){
    this.i18nUnsubscribe();
  },
  reRenderOnI18NEvent : function(){
    this.forceUpdate();
  }
};

var i18n = function(key){
  return polyglot.t(key);
};

/**
** The path variable is required since the method my be called before the configuration of the appliation
** For instance to inject the data on a client page
**/
function readServerData(locale, path){
  if(!path){
    path = i18nFileFetchConfiguration.serverPath;
  }
  //HACK: we are calling require with "fs" as a variable to avoid erros when starting the samples
  var fsKey = "fs";
  var fs = require(fsKey);
  var serverFile = path.serverPath + "/" +  locale + ".json";
  return JSON.parse(fs.readFileSync(serverFile, 'utf8'));
}

function changeLocale(locale){
  if(i18nStore.getState().locale == locale){
    //ignore locale for the current locale
    return;
  }

  if (typeof window === 'undefined') {
    //serverSideChange
    try{
      var messages = readServerData(locale);
      polyglot.replace(messages);
      i18nStore.dispatch({type : "locale-change", locale : locale});
    }
    catch(e){
      if(e.code == "ENOENT"){
        //No file found, falling back to fallBackLocale
        changeLocale(i18nFileFetchConfiguration.fallBackLocale);
      }
    }
  }else{
    //client side change
    //Using jquery for simplicity, it must be present on the window scope
    var clientFile = i18nFileFetchConfiguration.clientPath + "/" +  locale + ".json";
    $.getJSON(clientFile).done(function(messages){
      polyglot.replace(messages);
      i18nStore.dispatch({type : "locale-change", locale : locale});
    }).fail(function(jqxhr, textStatus, error ){
      if(error == "Not Found"){
        //fall back to default locale
        changeLocale(i18nFileFetchConfiguration.fallBackLocale);
      }
    });
  }
}

/**
 ** Configuration of the module
 ** serverPath : Path to fetch the messages during server side rendering.
 ** clientPath : Path to fetch the messages on client side trigger
 ** localeFallback : Locale to be used when another selected locale is not found
 ** initialState : The initial state to be used, is an object with locale (the current locale) and the data
 **/
var setupI18NConfiguration = function(configuration){
  if(configuration.serverPath && typeof window === "undefined"){
    //Resolve the local path
    var callsite = require('callsite');
    var callerFileName = callsite()[1].getFileName();
    var path = require("path");
    configuration.serverPath = path.resolve(path.dirname(callerFileName), configuration.serverPath);
  }
  if(configuration.initialState){
    polyglot.replace(configuration.initialState.data);
    i18nStore.dispatch({type : "locale-change", locale : configuration.initialState.locale});
  }
  i18nFileFetchConfiguration = configuration;
};

module.exports.i18nEventsListenerMixin = i18nEventsListenerMixin;
module.exports.changeLocale = changeLocale;
module.exports.setupI18NConfiguration = setupI18NConfiguration;
module.exports.i18n = i18n;
module.exports.readServerData = readServerData;
