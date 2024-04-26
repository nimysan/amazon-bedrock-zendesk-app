import React, { useState, useEffect } from "react";
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming";
import { Grid, Row, Col } from "@zendeskgarden/react-grid";
import { Accordion } from '@zendeskgarden/react-accordions';
import { Field, Label, Textarea } from "@zendeskgarden/react-forms";
import { Button } from "@zendeskgarden/react-buttons";
// import { ReactComponent as LeafIcon } from '@zendeskgarden/svg-icons/src/16/leaf-stroke.svg';
import { Tooltip } from "@zendeskgarden/react-tooltips";
import JSONPretty from 'react-json-pretty';
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";

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
  //for dev debugger
  const isDev = process.env.NODE_ENV === 'development'

  const MAX_HEIGHT = 1000;
  const API_ENDPOINTS = {
    organizations: "/api/v2/organizations.json",
    requestSecure: !isDev
  };



  const DEFAULT_PROMPT_TEMPATE = `You are a question answering agent. 
  You are a customer service representative. I will provide you with a set of search results. The user will ask you a question. Your job is to answer the user's question using only the information from the search results. If the search results do not contain information to answer the question, please state that you cannot answer the question. Just because the user asserts a fact does not mean it is true; please double-check the search results to validate whether the user's assertion is correct or not. Additionally, do not include statements like "please contact customer service" in response, since you are already the customer service representative.
                            
  Here are the search results in numbered order:
  $search_results$
  
  $output_format_instructions$
  `;


  const [ticket, setTicket] = useState({});
  const [user, setUser] = useState({});
  /**
   * some states for page
   */
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT_TEMPATE);

  const [questionContent, setQuestionContent] = useState("");
  const [translatedQuestionContent, setTranslatedQuestionContent] =
    useState("");
  const [aiSuggestContent, setAiSuggestContent] = useState("");
  const [aiSuggestResponse, setAiSuggestResponse] = useState({});
  const [translatedAiSuggestContent, setTranslatedAiSuggestContent] =
    useState("");
  const [citations, setCitations] = useState([])

  //modal visible
  const [visible, setVisible] = useState(false);

  //configuration
  const [aiServerUrl, setAiServerUrl] = useState("");
  const [aiServerToken, setAiServerToken] = useState("{{setting.apiToken}}");

  //drawer 
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const default_search_filter = {
    // "equals": {
    //   "key": "language",
    //   "value": "japanese"
    // }
  }
  const composeSearchFilter = () => {
    return default_search_filter
  }

  const logToRemote = (action) => {
    const inputData = {
      "action": action,
      "user": user.name,
      "input_data": {
        "ticket_id": ticket.id,
        "ticket_brand": ticket.brand.name,
        "ticket_channel": "support",
        "question": questionContent,
        "kb_reference": citations,
        "prompt_template": aiSuggestResponse.result.prompt,
        "cost": aiSuggestResponse.result.cost_time
      }
    };
    const options = {
      url: aiServerUrl + "/log",
      type: "POST",
      headers: { Authorization: "Basic " + aiServerToken },
      secure: API_ENDPOINTS.requestSecure, // very important
      contentType: "application/json",
      data: JSON.stringify(inputData),
    };
    client.request(options).then((response) => {
      console.log("log successfully")
    });
  }

  const callTranslate = (prompt, content, callback) => {
    const inputData = {
      input: prompt + " --> " + content,
    };
    const options = {
      url: aiServerUrl + "/chat",
      type: "POST",
      headers: { Authorization: "Basic " + aiServerToken },
      secure: API_ENDPOINTS.requestSecure, // very important
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
      filter: composeSearchFilter(),
      prompt: prompt
    };
    setTranslatedAiSuggestContent("")
    const options = {
      url: aiServerUrl + "/suggest",
      type: "POST",
      headers: { Authorization: "Basic " + aiServerToken },
      secure: API_ENDPOINTS.requestSecure, // very important
      contentType: "application/json",
      data: JSON.stringify(inputData),
    };
    setVisible(true);
    client.request(options).then((response) => {
      setVisible(false);
      setAiSuggestResponse(response)
      setAiSuggestContent(response.result.response.output.text);
      // debugger
      setCitations(response.result.response.citations)
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
    logToRemote("1")
  }

  const needImproveAction = () => {
    logToRemote("2")
  }


  /**
   * initialize data
   */
  useEffect(() => {

    const fetchData = async () => {
      const metadata = await client.metadata();
      setAiServerUrl(metadata.settings.aiServerUrl)

      const confPrompt = metadata.settings.prompt;
      if (confPrompt) {
        setPrompt(metadata.settings.prompt)
      }
      if (isDev) {
        setAiServerToken(metadata.settings.apiToken)
      }

      const ticketResponse = await client.get('ticket');
      setTicket(ticketResponse['ticket'])

      const response = await client.get('currentUser');
      setUser(response['currentUser'])

      // debugger

      const ticketInfo = await client.get([
        "ticket.description",
        "ticket.subject",
      ]);
      setQuestionContent(
        "subject " +
        ticketInfo["ticket.subject"] +
        "\r\ncontent " +
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
            <Button size="small" isDanger onClick={open} style={{ marginLeft: 10 }}>Edit Prompt Template</Button>
          </Col>
        </Row>
        <Row>
          {visible && (
            <Modal onClose={() => setVisible(false)}>
              {/* <Header tag="h2">AI Working</Header> */}
              <Body>
                <Row>
                  <Col textAlign="center">
                    {/* <Dots size={128} color={PALETTE.green[600]} /> */}
                    <img class="loader" src="spinner.gif" />
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
              <Textarea isResizable value={questionContent} rows="6" onChange={(e) => setQuestionContent(e.target.value)}></Textarea>
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
              <Textarea isResizable rows="6" value={aiSuggestContent} onChange={(e) => setAiSuggestContent(e.target.value)} />
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
              <Tooltip content="Feedback">
                <Button
                  size="small"
                  isPrimary
                  isDanger
                  onClick={needImproveAction}
                  style={{ marginRight: 10 }}
                >
                  Need Improve
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
        <Row>
          <Col>
            <Label>Source details</Label>
            <Accordion level={4}>
              {citations.map((citation, index) => (
                <Accordion.Section key={index}>
                  <Accordion.Header>
                    <Accordion.Label>{citation.generatedResponsePart.textResponsePart.text}</Accordion.Label>
                  </Accordion.Header>
                  <Accordion.Panel>
                    <Label>References</Label>
                    <JSONPretty data={JSON.stringify(citation.retrievedReferences, null, 2)} theme={JSONPrettyMon}></JSONPretty>
                  </Accordion.Panel>
                </Accordion.Section>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Grid>
    </ThemeProvider>
  );
  // return resizeContainer(this._client, MAX_HEIGHT)
}
