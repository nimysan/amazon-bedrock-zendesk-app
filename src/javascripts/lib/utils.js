const TICKET_URL = "/api/v2/tickets/";
const INTENT_FIELD_ID = 9704553495439; //可能需要后期配置修改

export const findUserIntent = (fields) => {
  const fields_array = fields.ticket_fields;

  const userIntent = fields_array.find((obj) => obj.id == INTENT_FIELD_ID);
  // debugger
  let filed_options = userIntent.custom_field_options;
  return filed_options;
};

const intent_description = `
备注：各级指标分别展示正面、负面提及次数及占比（根据情感分析判别正面、负面），同一条评论里面同一标签的情感正、负向标记去重计算，分别最多只计算一条；										
一级指标	二级指标	二级指标 (En)	三级指标	三级指标-20240401	描述	评论举例-正向	评论举例-负向	描述-en	评论举例-正向-en	评论举例-负向-en
服务咨询	产品信息	Product Info	促销活动	Product Promotion	客户向客服了解特定促销活动的细节、优惠条件及参与方式			Customers inquire about the details, conditions, and participation methods of specific promotional activities.		
			产品推荐	Product Recommendation	根据客户的需求、偏好或历史购买行为，向客户提出可能感兴趣或适合其需求的产品或相关服务。			Based on the customer's needs, preferences, or historical purchase behavior, suggest products or related services that may interest or suit them.		
			产品适配	Product Compatibility	产品是否能与特定的设备（电冰箱、风扇）等、系统或需求兼容或匹配，确保顾客能够顺利使用产品。			Inquire about the total amount (including taxes) required to purchase a product.		
			产品价格	Product Pricing	客服需要支付以获得产品的金额（含税）			Inquire about the product's interface type and compatibility issues with other device interfaces.		
			产品插口	Produc Ports	产品的插口类型以及产品插口与其他设备接口的兼容问题			Inquire about the maximum output power the product can provide during normal operation.		
			产品输出功率	Product Output Power	产品在正常运行时能够提供的最大输出功率			Inquire about the product's dimensions.		
			产品尺寸重量	Product Weight & Dimensions	产品的尺寸和重量			Inquire about the product's weight.		
			产品循环寿命	Product Battery Cycle Life	产品电池在在正常使用条件下的预期使用寿命。			Inquire about the expected lifespan of the product's battery under normal usage conditions.		
			产品电池容量	Product Battery Capacity	电池的容量大小			Inquire about the battery's capacity.		
			产品充电时长	Product Charging Time	产品的电池从完全放电状态充满所需的时间			Inquire about the time required for the product's battery to fully charge from a completely discharged state.		
			新品上市	New Product Launch	新品上市时间、上市或新上市产品的特性、优势及可用性咨询			Inquire about new product launch times, features, advantages, and availability.		
			申请样品	Product Sample Request	申请产品样品的程序和条件			Apply for product samples, including the procedure and conditions.		
			邀评活动	Invitation Review Event 	邀评活动			Inquire about invitation-to-review activities.		
	订单与付款	Orders	申请折扣	Discount	申请可用的折扣和优惠政策			Apply for available discounts and promotional policies.		
			订单购买	How to buy	客户向客服了解如何购买商品			Customers inquire about how to purchase products.		
			付款	Payment	支付选项、支付等相关问题咨询			Inquire about payment options and related issues.		
			价格变动	Price Adjustment	价格调整信息和调整后的价格引发的咨询			Inquire about price adjustment information and the resulting prices.		
			票据申请	Apply for Document	申请发票或收据以及相关要求。			Apply for an invoice or receipt and related requirements.		
			订单修改	Modify Order	修改已提交订单的内容。			Modify the contents of an already submitted order.		
			取消订单	Cancel Order	咨询如何取消订单及相关的政策和条件。			Inquire about how to cancel an order and related policies and conditions.		
	帐号	Account	会员注册	Member Registration	如何创建新账户/会员			How to create a new account/membership.		
			积分使用	Points Redemption	有关积分的获取及使用咨询和问题反馈			Inquiries about earning and using points, and feedback on issues.		
			登录帐号	Login to Account	登录问题，如忘记密码或无法登陆			Login issues, such as forgotten passwords or inability to log in.		
			重置密码	Reset Password	密码重置问题，			Issues with password resetting.		
			更改帐号	Change Account	更改账户信息，如邮箱地址和联系信息等信息			Change account information, such as email addresses and contact information.		
			删除帐号	Delete Account	说明如何永久删除/注销账户及其数据			Explain how to permanently delete/cancel an account and its data.		
	产品使用	Product Usage	产品拆箱	Product Unboxing	产品拆包/拆箱问题			How to unbox a product.		
			安装配置	Installation	产品初次设置配置、以及安装指导			How to set up a product for the first time, including installation guidance.		
			充电方式	Charging Method	产品正确的充电方法和注意事项			How to properly charge a product and related precautions.		
			连接方式	Connection Method	产品连接到其他设备的步骤和技巧			How to connect the product to other devices, including steps and tips.		
			输出方式	Output Method	产品的输出选项如何最适配于			How to charge other devices.		
			存储方式	Storage Method	关于产品的物理存储建议			How to properly store the product.		
			节能模式	Energy Saving Mode	产品的节能或低功耗模式以延长电池寿命			How to enable the product's energy-saving or low-power mode.		
			配件使用	Accessory Usage	使用和维护产品配件			How to properly use and maintain the product's accessories.		
			产品使用	Product Usage	所有其他与产品使用相关的咨询			How to use the product.		
			APP使用	APP Usage	如何下载、安装和使用APP应用程序			How to download, install, and use APP applications.		
	服务体验	Service	退货退款	Returns and Refunds	客户因产品不符合预期或其他原因而向商家申请将已购买的商品退回，并要求退款			Customers apply for a refund from the merchant due to the product not meeting expectations or other reasons, requesting to return the purchased goods.		
			退换货	Exchanges	客户因产品不符合预期或其他原因而向商家申请将已购买的商品退回，并要求更换同类商品			Customers apply for an exchange of the same type of goods from the merchant due to the product not meeting expectations or other reasons, requesting to return the purchased goods.		
			寄修	Repair Services	客户提出寄修申请，将出现故障或需要维修的产品寄到维修点，以便进行修理或维护。			Customers submit repair requests to send the faulty or needed maintenance product to the repair center for repair or maintenance.		
			补发货	Reshipment	因产品配件缺失或损坏时提供补发服务，在客户订单中出现遗漏或商品损坏等情况后，重新发出相应的商品以补偿或替换。			Provide re-shipment service for missing or damaged product accessories, re-sending the corresponding goods to compensate or replace in cases of omissions or damage in the customer's order.		
			以旧换新	Trade-In Program	以旧换新业务受理、客户将旧有的产品寄回，同时支付差价，以获得新产品的购买行为。			Acceptance of trade-in services, where customers send back old products, pay the difference, and purchase new products.		
			回收服务	Recycling Services	客户申请产品报废回收业务			Customer application for product scrap recycling service.		
			质保延保	Warranty	关产品质量保证和延长保修服务的信息			Information about product quality assurance and extended warranty services.		
			客服解决问题能力	Service problem-solving skills	客服人员处理和解决客户问题的能力，如：问题识别与解决能力以及专业知识水平。			The ability of customer service personnel to handle and solve customer issues, such as problem identification and solving capabilities, and professional knowledge level.		
			客服服务态度	Service Attitude	客服人员在与客户交流和处理问题时的态度			The attitude of customer service personnel when communicating and dealing with issues.		
			客服服务效率	Service Efficiency	客服在处理客户问题或需求时所展现的快速响应、高效处理			The quick response and efficient handling demonstrated by customer service when dealing with customer issues or needs.		
	产品故障	product failure	开关机	Power On/Off	产品开启或关闭时遇到的问题					
			充电	Charging	产品在充电过程中遇到的问题					
			放电	Power Supply	产品在放电过程中遇到的问题					
			外壳	Shell	产品外壳相关的损伤或缺陷					
			光充	Photonic Charging	产品在光充过程中遇到的问题					
			容量	Capacity	诊断产品电池容量问题					
			故障码	Error Code	产品显示故障代码					
			显示屏	Display Screen	产品显示屏问题，如不显示、显示错误等					
			高温	Overheating	产品过热时的应对措施、安全指南和解决方案					
			噪音	Noise	诊断和解决产品异常噪声问题					
			入液	Liquid Ingress	产品遭受液体侵害后的紧急措施					
			把手	Handle	产品把手或手柄部分的问题					
			轮子	Wheels	产品轮子或滚轮故障的解决方案					
			配件	Accessory	诊断和解决与产品配件相关的问题					
			APP	APP	解决产品相关应用程序的技术问题					
	物流	Logistics	配送区域	Delivery Area	商家或物流公司覆盖的送货范围，包括能够提供配送服务的地理区域或范围。			The delivery range covered by the merchant or logistics company, including the geographical area or range where delivery services are provided.		
			配送时效	Delivery Time	从订单确认到客户收到货物的时间间隔，反映了配送服务的快速度和效率。			The time interval from order confirmation to the customer receiving the goods, reflecting the speed and efficiency of the delivery service.		
			配送状态	Delivery Status	订单在配送过程中所处的具体阶段或情况，例如已接单、配货中、运输中、派送中、已签收等。			The specific stage or situation of the order during the delivery process, such as order accepted, in allocation, in transit, being delivered, and signed for.		
			配送方式	Delivery Method	商家或物流公司提供的不同送货方式			Different delivery methods provided by the merchant or logistics company.		
			配送质量	Delivery Quality	配送过程中所提供的服务质量，主要包括包裹完整性、包装是否完好、运输过程中是否损坏等方面			The service quality provided during the delivery process, mainly including package integrity, whether the packaging is intact, and whether there is damage during transportation.		
			物流费用	Logistics Cost	商品从供应商或商家处到达客户手中所产生的物流费用。			The logistics cost generated from the supplier or merchant to the customer.		
			物流修改	Logistics Modification	物流信息变更是指产品在运输过程中，收件人或发件人提供的关键信息发生变化，如地址、电话号码等。			Logistics information change refers to the change in key information provided by the recipient or sender during the transportation process, such as address, phone number, etc.		
公司	公司	Company	关于我们	About Us	公司的历史、使命、价值观、社会责任及其他相关信息			The company's history, mission, values, social responsibility, and other relevant information.		
			就业机会	Career Opportunities	职位空缺、就业申请、简历投递方式等			Job vacancies, application for employment, and resume submission methods.		
			商城	Store	在线商城/店铺介绍、优势和分布等信息			Introduction to the online mall/shop, advantages, and distribution.		
			批发	Wholesale	向有批量购买(渠道)需求的客户提供相关的批发政策和联系方式			Provide related wholesale policies and contact information to customers with bulk purchasing (channel) needs.		
			营销合作	Marketing Cooperation	有关公司的营销合作咨询、询问营销活动及如何与之合作			Inquiries about the company's marketing cooperation, marketing activities, and how to cooperate.		
			支持	Support Info	服务和技术支持的详细信息，包括联系方式和服务时间			Detailed information on service and technical support, including contact information and service hours.		
运营	页面体验	web page	产品详情页面	Product Details Page	产品参数/接续方式/使用方法等信息错误;关键信息缺少					
			产品知识页面	Product Knowledge Page	信息内容存在错误或与其他宣传相矛盾					
			Jackery广告	Jackery Advertisement	价格，产品型号，折扣力度等错误					
其他	其他	Others	虚假网站	Fake Sites	虚假网站识别与受理			Identification and handling of fake websites.		
`;

export const build_intent_promot = (options, content) => {
  return (
    `你是一个客服服务人员, 请根据用户提交的内容去做用户意图识别. 
        用户内容包含subject和content. 请以content为主要判别意图依据.
        意外, 永远只输出一个最匹配的意图.
        请从以下json数据中挑选匹配的意图.` +
    JSON.stringify(options) +
    "每个意图的详细说明请参考 " +
    intent_description +
    "-------- 客户咨询的内容为 ------" +
    content +
    `请按照给定的意图列表, 输出意图, 给出一个完整的JSON对象. 
    输出格式为json,另外, 请确保输出的json是格式正确的, 包括有些json转义设置, 确保输出的json能够被解析. 格式如下:
        {
            "reason":"xxx",
            "intent": - 此处为intent对象
        }`
  );
};

const chat_with_bedrock = async (client, clientSetup, prompt) => {
  const inputData = {
    input: prompt,
  };
  // beforeCallback();
  const options = {
    url: clientSetup.url + "/api/bedrock/chat",
    type: "POST",
    headers: { Authorization: "Basic " + clientSetup.token },
    secure: clientSetup.secure, // very important
    contentType: "application/json",
    data: JSON.stringify(inputData),
  };

  let response = await client.request(options);
  debugger
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

  const options = {
    url: TICKET_URL + ticket_id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(input_data),
  };
  debugger
  response = await client.request(options);
  debugger
  console.log("--- > " + JSON.stringify(response));
};

/**
 * 
 * @param {*} options 
 * @param {*} content 
 * @returns json
 * ```json
 * {
    "reason": "根据给定的问题内容'ラーコードF1が頻繁に発生します'(产品频繁出现F1错误代码),我判断该问题属于'product failure::Error Code'(产品故障::错误代码)意图类别。",
    "intent": {
        "id": 9704553492111,
        "name": "product failure::Error Code",
        "raw_name": "product failure::Error Code",
        "value": "product_failure_error_code",
        "default": false
    }
}
 * ```
 */
const parse_claude3_intent = (output) => {
  console.log("=============");
  console.log(output);
  let json = JSON.parse(output);
  let intent = json.intent;
  let reason = json.reason;
  return {
    reason: reason,
    intent: intent,
  };
};

export const tag_intent_for_ticket = async (
  client,
  ticket_id,
  userIntentList,
  ticketContent,
  clientSetup
) => {
  //make prompt

  let prompt = build_intent_promot(userIntentList, ticketContent);
  console.log(prompt);
  let user_intent = await chat_with_bedrock(client, clientSetup, prompt);
  let intents = parse_claude3_intent(user_intent);
  //set value to ticket
  return intents;
  await setUserIntentToTicket(client, ticket_id, INTENT_FIELD_ID, intents)
};
