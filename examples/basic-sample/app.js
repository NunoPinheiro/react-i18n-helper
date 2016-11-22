import React from "react";
import ReactDOM from 'react-dom';
import {changeLocale, i18nEventsListenerMixin, setupI18NConfiguration, i18n } from "../../lib/react-i18n-helper";

var I18NSelectionComponent = React.createClass({
  render: function() {
    return (
      <div>
        <button onClick={() => changeLocale("pt-PT")}>pt-PT</button>
        <button onClick={() => changeLocale("en-GB")}>en-GB</button>
        <button onClick={() => changeLocale("fr-FR")}>fr-FR (Will falback to en-GB)</button>
      </div>
    );
  }
});

var App = React.createClass({
  mixins : [i18nEventsListenerMixin],
  getInitialState : function(){
    //The initial data should be injected on the page
    var initialData = {"HelloWorld" : "Hello, World!"};
    setupI18NConfiguration({clientPath : "/examples/basic-sample/i18n", fallBackLocale : "en-GB", initialState : {"locale" : "en-GB", data : initialData}});
    return {};
  },
  render : function(){
    return (<div>
              <I18NSelectionComponent />
              {i18n("HelloWorld")}
            </div>);
  }
});

ReactDOM.render( <App />, document.getElementById('container'));
