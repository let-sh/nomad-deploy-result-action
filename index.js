const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nomadEndpoint = core.getInput('nomad-addr');
  const nomadToken = core.getInput('nomad-token');
  const nomadJobName = core.getInput('nomad-job-name');
  const nomadNamespace = core.getInput('nomad-namespace');

  var result = "";

  while (result in ["successful", "failed"]) {
    fetch(`https://${nomadEndpoint}/v1/job/${nomadJobName}/deployment?namespace=${nomadNamespace}&index=1`, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-nomad-token": nomadToken
      },
      "body": null,
      "method": "GET",
      "mode": "cors"
    })
      .then(res => res.json())
      .then((jsonData) => {
        result = jsonData.Status
        core.setOutput("result", result);
        if (result === "failed") {
          console.log(jsonData[0].Description);
          core.setFailed(jsonData[0].Description);
        }

        if (result === "successful") {
          console.log(jsonData[0].Description);
        }
      })
      .catch((err) => {
        // handle error
        console.log(err);
        core.setFailed(err);
      });
  }

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`finshed check up deploy result: ${result}. ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}