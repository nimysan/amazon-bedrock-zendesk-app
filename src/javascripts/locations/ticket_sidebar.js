// need to import basic garden css styles
import "@zendeskgarden/css-bedrock";

import App from "../modules/app";
// import { createRoot } from 'react-dom/client';
import { render } from "react-dom";
import React, { StrictMode } from "react";
/* global ZAFClient */
const client = ZAFClient.init();
import { resizeContainer, escapeSpecialChars as escape } from '../../javascripts/lib/helpers'

// import { render } from 'react-dom';
// import React, { Component } from 'react';

client.on("app.registered", function (appData) {
  // debugger
  // return new App(client, appData)
  // const root = createRoot(document.getElementById('main'));
  const domNode = document.getElementById("main");
  render(<App/>, domNode);
  resizeContainer(client, 3000)
});
