const TICKET_URL = "/api/v2/tickets/";
const INTENT_FIELD_ID = 9704553495439; //可能需要后期配置修改

export const findUserIntent = (fields) => {
    const fields_array = fields.ticket_fields;

    const userIntent = fields_array.find((obj) => obj.id == INTENT_FIELD_ID);
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

const chat_with_bedrock = async (client,clientSetup,prompt) => {
    const inputData = {
        input: prompt,
    };
    // beforeCallback();
    const options = {
        url: clientSetup.url+"/api/bedrock/chat",
        type: "POST",
        headers: { Authorization: "Basic " + clientSetup.token },
        secure: clientSetup.secure, // very important
        contentType: "application/json",
        data: JSON.stringify(inputData),
    };

    let response = await client.request(options);
    return response.result.content[0]["text"];
};

export const setUserIntentToTicket = async (
    client,
    ticket_id,
    field_id,
    value_array
) => {
    let input_data = {
        ticket: {
            custom_fields: [
                {
                    id: field_id || INTENT_FIELD_ID, //9704553495439,
                    value: value_array, // ["account_points_redemption", "account_reset_password","product_info_product_recommendation"]
                },
            ],
        },
    };

    let test = await client.get("ticketFields:custom_field_9704553495439");
    console.log(test);
    const options = {
        url: TICKET_URL + ticket_id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(input_data),
    };
    await client.request(options).then((response) => {
        console.log("Update successfully");
        console.log("--- > " + JSON.stringify(response));
    });
    //   await client.set("ticket.customField:fieldName", value);
};

export const tag_intent_for_ticket = async (client, ticket_id, userIntentList, ticketContent, clientSetup) => {
    //make prompt 
    
    let prompt = build_intent_promot(userIntentList, ticketContent);
    debugger
    let user_intent = await chat_with_bedrock(client,clientSetup,prompt);
    debugger
    // intent_suggests = await chat_with_bedrock();
    //call bedrock to give value
    let intents = user_intent;//How to get intents
    //set value to ticket
    await setUserIntentToTicket(client, ticket_id, INTENT_FIELD_ID, intents)
}