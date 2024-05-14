const FIELD_URL = "/api/v2/ticket_fields.json";
const TICKET_URL = "/api/v2/tickets/";
const TICKET_FIELD_UPDATE = "/api/v2/ticket_fields/"
// const TICKET_URL = "/api/v2/tickets.json?";

export const findUserIntent = (fields) => {
  const fields_array = fields.ticket_fields;

  const userIntent = fields_array.find((obj) => obj.id == 9704553495439);
  // debugger
  let filed_options = userIntent.custom_field_options;
  return filed_options;
};

export const build_intent_promot = (options, content) => {
  return (
    `你是一个客服服务人员, 请根据用途内容去做用户意图识别. 意图类标参考以下JSON定义` +
    JSON.stringify(options) +
    "--- 客户咨询的内容为 ---" +
    content +
    "请按照给定的意图列表, 输出意图, 给出一个完整的JSON对象."
  );
};

export const set_user_intent = async (client, intentId) => {
  let input_data = {
    ticket: {
      custom_fields: [
        {
            "id": 9704553495439,
            "value": ["account_points_redemption", "account_reset_password","product_info_product_recommendation"]
        }
      ],
      status: "solved",
    },
  };


  

  let sample = {
    ticket: {
      comment: { body: "Thanks for choosing Acme Jet Motors.", public: true },
      custom_status_id: 321,
      status: "solved",
    },
  };

  let test = await client.get("ticketFields:custom_field_9704553495439");
  console.log(test);
  //   debugger;

  // await client.set('ticketFields:custom_field_9704553495439','product_info_product_compatibility')
  // let a_test =  await client.get('ticketFields:custom_field_9704553495439')
  // console.log(a_test)
  // debugger
  const options = {
    url: TICKET_URL + "2866",
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(input_data),
  };
  await client.request(options).then((response) => {
    console.log("hello successfully");
    console.log("--- > " + JSON.stringify(response));
  });
  //   await client.set("ticket.customField:fieldName", value);
};
