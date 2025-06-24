// https://developers.brevo.com/reference/createcontact#code-examples
const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

export const createAccount = email => {
  try {
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.ContactsApi();
    let createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = email;
    createContact.listIds = [6]

    apiInstance.createContact(createContact).then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });
  } catch (error) {
    console.log(error)
  }
}

export const getTemplate = async (id) => {
  try {
    const template = await fetch(`https://api.brevo.com/v3/smtp/templates/${id}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .catch(error => console.error("Fetch error:", error));

    return template;
  } catch (error) {
    console.log(error)
  }
}