/**
 * https://developer.zendesk.com/documentation/apps/app-developer-guide/making-api-requests-from-a-zendesk-app/#using-secure-settings
 * 
 * When the app makes the request() call, the browser's dev tools only display the setting placeholder. The Zendesk proxy server inserts the setting's value outside of the browser.
 * 
 */
const client = ZAFClient.init();
requestSecure = false

function showModal() {
  debugger;
  $("#exampleModal").modal("show");
}

function closeModal() {
  $("#exampleModal").modal("hide");
}

function callAITransalte(inputText, prompt, callback) {
  inputData = {
    input: prompt + ">>>:" + inputText,
  };
  const options = {
    url: "https://ai.plaza.red/chat",
    type: "POST",
    headers: { Authorization: "Basic {{setting.apiToken}}" },
    secure: requestSecure, // very important
    contentType: "application/json",
    data: JSON.stringify(inputData),
  };
  showModal();
  client.request(options).then((response) => {
    console.log(response);
    closeModal();
    callback(response.result.content[0].text);
  });
}
function callAI(inputText, callback) {
  // debugger
  inputData = {
    input: inputText,
    market: "Japan",
  };
  //   showModal()
  const options = {
    url: "http://ai.plaza.red/suggest",
    type: "POST",
    headers: { 
        Authorization: "Basic {{setting.apiToken}}" 
    },
    secure: requestSecure, // very important
    contentType: "application/json",
    data: JSON.stringify(inputData),
  };
  showModal();
  client.request(options).then((response) => {
    // console.log(response);
    closeModal();
    callback(response.result.text);
    // aiSuggestionContent.textContent = response.result.text;
  });
}

function replyWithSuggestion() {
  client
    .invoke("ticket.comment.appendText", $("#aiSuggestionContent").val())
    .then(function () {
      console.log("text has been appended");
    });
}

async function aiSuggest() {
  const ticketInfo = await client.get(["ticket.description", "ticket.subject"]);
  console.log(ticketInfo);
  const aiInputTextArea = document.getElementById("aiInput");
  const text =
    "subject " +
    ticketInfo["ticket.subject"] +
    "content " +
    ticketInfo["ticket.description"];
  aiInputTextArea.textContent = text;
}

aiSuggest();

function registerBtnEvents() {
  $("#contentTranslatedButton").click(function () {
    callAITransalte(
      $("#aiInput").val(),
      "请翻译以下内容到中文, 不要添加任何其他提示. ",
      function (content) {
        $("#questionTranslated").val(content);
      }
    );
  });

  $("#contentTranslatedEnglishButton").click(function () {
    callAITransalte(
      $("#aiInput").val(),
      "please translate below content to English",
      function (content) {
        $("#questionTranslated").val(content);
      }
    );
  });

  $("#aiSuggestButton").click(function () {
    callAI($("#aiInput").val(), function (content) {
      $("#aiSuggestionContent").val(content);
    });
  });

  $("#aiSuggestToChineseButton").click(function () {
    callAITransalte(
      $("#aiSuggestionContent").val(),
      "请翻译以下内容到中文, 不要添加任何其他提示. ",
      function (content) {
        $("#aiSuggesntContentTranslated").val(content);
      }
    );
  });

  $("#aiSuggestToEnglishButton").click(function () {
    callAITransalte(
      $("#aiSuggestionContent").val(),
      "please translate below content to English",
      function (content) {
        $("#aiSuggesntContentTranslated").val(content);
      }
    );
  });

  //register reply btn
  $("#replyButton").click(function () {
    replyWithSuggestion();
  });
}

registerBtnEvents();
