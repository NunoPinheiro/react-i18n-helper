# react-i18n-helper

The main goal of this project is to provide dynamic client side locale change. This lib allows you to translate your page in the browser, and listens to locale change events to force a re-render of your components.

New locale contents are also automatically fetched on demand, you do not need all users to fetch all languages.

# Using
Instal the library:

`npm install --save react-i18n-helper`

All the functions refered on this readme can be imported by using the expression:

`import {<functionName>} from "react-i18n-helper";`
## Configuration

To start the lib you need some basic configurations though the function `setupI18NConfiguration`. This function receives a single object with the following fields:
  - serverPath : Path to fetch the messages during server side rendering. (Optional)

  - clientPath : Path to fetch the messages on client side trigger

  - localeFallback : Locale to be used when another selected locale is not found (Optional)

  - initialState : The initial state to be used, is an object with locale (the current locale) and the data. This field is not mandatory, but filling it will allow you to avoid an extra GET operation to fetch the locale during the first page display.

## Fetching the initial data
If you are using javascript on the server side, there is a `readServerData` which based on the configuration will fetch the data for a provided locale. You should inject the result in you page.

If you are using another language on the server side you may need to create your own helper functions to fetch this initial data (is just reading a json file).

## Translating
To translate just call the `i18n` function. To ensure that your classes are re-rendered when the user requests a locale change, add the `i18nEventsListenerMixin` to your react component.

## Triggering Locale Change
When you want to change the locale, just trigger the `changeLocale` function which receives as argument the target locale. The new locale contents will be automatically from the server.

# Example
Please check the current example in the "examples" folder of this repository. If you want to run it, just call `npm start` in the root folder and access `localhost:8080` in your browser.
