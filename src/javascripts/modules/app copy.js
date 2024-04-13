/**
 *  Amazon Bedrock for Zendesk app
 **/
import React, { Component } from 'react';
import { render } from 'react-dom'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { UnorderedList } from '@zendeskgarden/react-typography'
import { Field, Label, Textarea } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';
// import { ReactComponent as LeafIcon } from '@zendeskgarden/svg-icons/src/16/leaf-stroke.svg';
import { Tooltip } from '@zendeskgarden/react-tooltips';

import I18n from '../../javascripts/lib/i18n'
import { resizeContainer, escapeSpecialChars as escape } from '../../javascripts/lib/helpers'

const MAX_HEIGHT = 1000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json',
  ai: 'http://ai.plaza.red',
  apiToken: "YWRtaW46cGFzc3dvcmQxMjM="
}

//is it need to secure settings
const requestSecure = false;

if (requestSecure) {
  API_ENDPOINTS.apiToken = "{{setting.apiToken}}"
}

const DEFAULT_PROMPT_TEMPATE = `You are a question answering agent. I will provide you with a set of search results. The user will provide you with a question. Your job is to answer the user's question using only information from the search results. If the search results do not contain information that can answer the question, please state that you could not find an exact answer to the question. Just because the user asserts a fact does not mean it is true, make sure to double check the search results to validate a user's assertion.

Here are the search results in numbered order:
$search_results$

$output_format_instructions$
          `



class App {
  constructor(client, _appData) {
    // super();
    // debugger
    this._client = client
    console.log(React.version)
    // debugger
    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
  }



  /**
   * Initialize module, render main template
   */
  async init() {
    this.state = {
      quesitonContent: "",
      translatedQuestionContent: "translated",
      aiSuggestContent: "",
      cnAIContent: "",
      enAIContent: "",
      prompt: ""
    };

    const currentUser = (await this._client.get('currentUser')).currentUser

    I18n.loadTranslations(currentUser.locale)

    const organizationsResponse = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    const organizations = organizationsResponse ? organizationsResponse.organizations : []

    const ticketInfo = await this._client.get(["ticket.description", "ticket.subject"]);
    this.state.quesitonContent =
      "subject " +
      ticketInfo["ticket.subject"] +
      "content " +
      ticketInfo["ticket.description"];


    const apiTranslate = async (prompt, inputText) => {
      const inputData = {
        input: prompt + ">>>:" + inputText,
      };
      const options = {
        url: API_ENDPOINTS.ai + "/chat",
        type: "POST",
        headers: { Authorization: "Basic " + API_ENDPOINTS.apiToken },
        secure: requestSecure, // very important
        contentType: "application/json",
        data: JSON.stringify(inputData),
      };
      const response = await this._client.request(options)
      return response
    }

    const appContainer = document.querySelector('.main')



    const callAISuggest = () => {
      console.log("questionText is --->" + this.state.quesitonContent)
      debugger
    }
    // const xxxx = this;
    // console.log(xxxx.setState)
    // debugger
    const translateContentToCN = async () => {
      // debugger
      const response = await apiTranslate("please translate below content in Chinese(简体中文), the content is: ", this.state.quesitonContent)
      this.state = {
        translatedQuestionContent: "123123123"
      }
      // this.setState((prevState) => {return {page: prevState.page + 1});
      // this.setState({
      //   translatedQuestionContent: "GeeksForGeeks welcomes you !!",
      // });
      // // this.setState(() => {
      //   return {
      //     translatedQuestionContent: response.result.content[0].text
      //   };
      // });
      // this.state.translatedQuestionContent = response.result.content[0].text + " -- translated";
    }


    const questionChangeHandler = (e) => {
      this.state.quesitonContent = e.target.value
    };

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <Grid>
          <Row>
            <Col data-test-id='sample-app-description'>
              Amazon Bedrock with Claude 3 for AI Suggestion
              <Field>
                <Label>Your Prompt for AI</Label>
                <Textarea isResizable value={DEFAULT_PROMPT_TEMPATE} onChange={questionChangeHandler}>
                </Textarea>
              </Field>
            </Col>
          </Row>
          <Row>
            <Col>
              <Field>
                <Label>Ticket Content</Label>
                <Textarea isResizable value={this.state.quesitonContent}></Textarea>
              </Field>
              <Field>
                <Tooltip content="Primary leaf">
                  <Button size="small" isDanger onClick={callAISuggest}>AI Suggest</Button>
                </Tooltip>
                <Tooltip content="Primary leaf">
                  <Button size="small" onClick={translateContentToCN}>翻译为中文</Button>
                </Tooltip>
                <Tooltip content="Primary leaf">
                  <Button size="small">To English</Button>
                </Tooltip>
              </Field>

            </Col>
            <Col>
              <Field>
                <Label>Tranlsated</Label>
                <Textarea isResizable value={this.state} />
                <Textarea isResizable value={this.state.translatedQuestionContent} />
              </Field>
            </Col>
          </Row>
          <Row>
            <Col>
              <Field>
                <Label>AI Suggest</Label>
                <Textarea isResizable />
              </Field>
              <Field>
                <Tooltip content="Primary leaf">
                  <Button size="small" isPrimary isDanger>Use it</Button>
                </Tooltip>
                <Tooltip content="Primary leaf">
                  <Button size="small">翻译为中文</Button>
                </Tooltip>
                <Tooltip content="Primary leaf">
                  <Button size="small">To English</Button>
                </Tooltip>
              </Field>
            </Col>
            <Col>
              <Field>
                <Label>Tranlsated</Label>
                <Textarea isResizable />
              </Field>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>{I18n.t('default.organizations')}:</span>
              <UnorderedList data-test-id='organizations'>
                {organizations.map(organization => (
                  <UnorderedList.Item key={`organization-${organization.id}`} data-test-id={`organization-${organization.id}`}>
                    {escape(organization.name)}
                  </UnorderedList.Item>
                ))}
              </UnorderedList>
            </Col>
          </Row>
        </Grid>
      </ThemeProvider>,
      appContainer
    )
    return resizeContainer(this._client, MAX_HEIGHT)
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError(error) {
    console.log('An error is handled here: ', error.message)
  }
}

export default App
