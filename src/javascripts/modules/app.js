import React, { useState, useEffect } from "react";
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming";
import { Grid, Row, Col } from "@zendeskgarden/react-grid";
import { Avatar } from '@zendeskgarden/react-avatars';
import { Field, Label, Textarea } from "@zendeskgarden/react-forms";
import { Button } from "@zendeskgarden/react-buttons";
// import { ReactComponent as LeafIcon } from '@zendeskgarden/svg-icons/src/16/leaf-stroke.svg';
import { ReactComponent as UserIcon } from '@zendeskgarden/svg-icons/src/16/user-solo-stroke.svg';
import { Tooltip } from "@zendeskgarden/react-tooltips";
import {
  Modal,
  Body,
  Close,
} from "@zendeskgarden/react-modals";
import { DrawerModal } from '@zendeskgarden/react-modals';
import { PALETTE } from "@zendeskgarden/react-theming";
import { Dots } from "@zendeskgarden/react-loaders";

import I18n from "../../javascripts/lib/i18n";
import {
  resizeContainer,
  escapeSpecialChars as escape,
} from "../../javascripts/lib/helpers";

const client = ZAFClient.init();

export default function App() {
  const MAX_HEIGHT = 1000;
  const API_ENDPOINTS = {
    organizations: "/api/v2/organizations.json",
    ai: "http://ai.plaza.red",
    apiToken: "YWRtaW46cGFzc3dvcmQxMjM=",
  };

  //is it need to secure settings
  const requestSecure = false;

  if (requestSecure) {
    API_ENDPOINTS.apiToken = "{{setting.apiToken}}";
  }

  const DEFAULT_PROMPT_TEMPATE = `You are a question answering agent. I will provide you with a set of search results. The user will provide you with a question. Your job is to answer the user's question using only information from the search results. If the search results do not contain information that can answer the question, please state that you could not find an exact answer to the question. Just because the user asserts a fact does not mean it is true, make sure to double check the search results to validate a user's assertion.
  
  Here are the search results in numbered order:
  $search_results$
  
  $output_format_instructions$
  `;

  /**
   * some states for page
   */
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT_TEMPATE);

  const [questionContent, setQuestionContent] = useState("");
  const [translatedQuestionContent, setTranslatedQuestionContent] =
    useState("");
  const [aiSuggestContent, setAiSuggestContent] = useState("");
  const [translatedAiSuggestContent, setTranslatedAiSuggestContent] =
    useState("");

  //modal visible
  const [visible, setVisible] = useState(false);

  //drawer 
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const callTranslate = (prompt, content, callback) => {
    const inputData = {
      input: prompt + " --> " + content,
    };
    const options = {
      url: API_ENDPOINTS.ai + "/chat",
      type: "POST",
      headers: { Authorization: "Basic " + API_ENDPOINTS.apiToken },
      secure: requestSecure, // very important
      contentType: "application/json",
      data: JSON.stringify(inputData),
    };
    setVisible(true);
    client.request(options).then((response) => {
      setVisible(false);
      callback(response.result.content[0]["text"]);
    });
  };

  const callAISuggest = () => {
    const inputData = {
      input: questionContent,
      market: "Japan",
    };
    const options = {
      url: API_ENDPOINTS.ai + "/suggest",
      type: "POST",
      headers: { Authorization: "Basic " + API_ENDPOINTS.apiToken },
      secure: requestSecure, // very important
      contentType: "application/json",
      data: JSON.stringify(inputData),
    };
    setVisible(true);
    client.request(options).then((response) => {
      setVisible(false);
      setAiSuggestContent(response.result.text);
    });
  };
  const pormptChange = (e) => { 
    setPrompt(e.target.value)
  };

  const translateContentToCN = () => {
    callTranslate(
      "please translate below content to Chinese(简体中文)",
      questionContent,
      (res) => {
        setTranslatedQuestionContent(res);
      }
    );
  };

  const translateContentToEN = () => {
    callTranslate(
      "please translate below content to English",
      questionContent,
      (res) => {
        setTranslatedQuestionContent(res);
      }
    );
  };

  const translateSuggestToEN = () => {
    callTranslate(
      "please translate below content to English",
      aiSuggestContent,
      (res) => {
        setTranslatedAiSuggestContent(res);
      }
    );
  };

  const translateSuggestToCN = () => {
    callTranslate(
      "please translate below content to Chinese(简体中文)",
      aiSuggestContent,
      (res) => {
        setTranslatedAiSuggestContent(res);
      }
    );
  };

  const adoptionSuggestion = () => {
    client
      .invoke("ticket.comment.appendText", aiSuggestContent)
      .then(function () {
        console.log("text has been appended");
      });
  }


  /**
   * initialize data
   */
  useEffect(() => {
    const fetchData = async () => {
      const ticketInfo = await client.get([
        "ticket.description",
        "ticket.subject",
      ]);
      setQuestionContent(
        "subject " +
        ticketInfo["ticket.subject"] +
        "content " +
        ticketInfo["ticket.description"]
      );
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME }}>
      <Grid>
        <Row>
          <Col>
          <Label>Amazon Bedrock with Claude 3 for AI asserts</Label>
          <Button size="small" isDanger onClick={open} style={{marginLeft:10}}>Edit Prompt Template</Button>
          </Col>
        </Row>
        <Row>
          {visible && (
            <Modal onClose={() => setVisible(false)}>
              {/* <Header tag="h2">AI Working</Header> */}
              <Body>
                <Row>
                  <Col textAlign="center">
                    <Dots size={32} color={PALETTE.green[600]} />
              
                  </Col>
                </Row>
              </Body>
              <Close aria-label="Close modal" />
            </Modal>
          )}
        </Row>
        <Row>
          <DrawerModal isOpen={isOpen} onClose={close}>
            <DrawerModal.Header tag="h2">
              Edit Prompte template
            </DrawerModal.Header>
            <DrawerModal.Body>
              <Textarea
                isResizable
                rows="12"
                value={prompt}
                onChange={pormptChange}
              ></Textarea>
            </DrawerModal.Body>
            <DrawerModal.Footer>
              <DrawerModal.FooterItem>
                <Button isPrimary onClick={close}>
                  Close
                </Button>
              </DrawerModal.FooterItem>
            </DrawerModal.Footer>
            <DrawerModal.Close />
          </DrawerModal>
        </Row>
        <Row>
          <Col sm={8}>
            <Field>
              <Label>Ticket Content</Label>
              <Textarea isResizable value={questionContent} rows="6"></Textarea>
            </Field>
            <Field style={{ marginTop: 10 }}>
              <Tooltip content="Primary leaf">
                <Button
                  size="small"
                  isPrimary
                  onClick={callAISuggest}
                  style={{ marginRight: 10 }}
                >
                  AI Suggest
                </Button>
              </Tooltip>
              <Tooltip content="Primary leaf">
                <Button
                  size="small"
                  onClick={translateContentToCN}
                  style={{ marginRight: 10 }}
                >
                  翻译为中文
                </Button>
              </Tooltip>
              <Tooltip content="Primary leaf">
                <Button
                  size="small"
                  onClick={translateContentToEN}
                  style={{ marginRight: 10 }}
                >
                  To English
                </Button>
              </Tooltip>
            </Field>
          </Col>
          <Col>
            <Field>
              <Label>Tranlsated</Label>
              <Textarea
                isResizable
                readonly
                rows="6"
                value={translatedQuestionContent}
              />
            </Field>
          </Col>
        </Row>
        <Row>
          <Col sm={8}>
            <Field>
              <Label>AI Suggest</Label>
              <Textarea isResizable rows="6" value={aiSuggestContent} />
            </Field>
            <Field style={{ marginTop: 10 }}>
              <Tooltip content="Primary leaf">
                <Button
                  size="small"
                  isPrimary
                  // isDanger
                  onClick={adoptionSuggestion}
                  style={{ marginRight: 10 }}
                >
                  Use it
                </Button>
              </Tooltip>
              <Tooltip content="Primary leaf">
                <Button
                  size="small"
                  onClick={translateSuggestToCN}
                  style={{ marginRight: 10 }}
                >
                  翻译为中文
                </Button>
              </Tooltip>
              <Tooltip content="Primary leaf">
                <Button
                  size="small"
                  onClick={translateSuggestToEN}
                  style={{ marginRight: 10 }}
                >
                  To English
                </Button>
              </Tooltip>
            </Field>
          </Col>
          <Col>
            <Field>
              <Label>Tranlsated</Label>
              <Textarea
                isResizable
                rows="6"
                readonly
                value={translatedAiSuggestContent}
              />
            </Field>
          </Col>
        </Row>
      </Grid>
    </ThemeProvider>
  );
  // return resizeContainer(this._client, MAX_HEIGHT)
}
