const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
let round = 1;

try {
  fetchDeploymentResult();
} catch (error) {
  core.setFailed(error.message);
}

function fetchDeploymentResult() {
  const nomadEndpoint = core.getInput('nomad-addr');
  const nomadToken = core.getInput('nomad-token');
  const nomadJobName = core.getInput('nomad-job-name');
  const nomadNamespace = core.getInput('nomad-namespace');

  fetch(`${nomadEndpoint}/v1/job/${nomadJobName}/deployment?namespace=${nomadNamespace}&index=1`, {
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

    if (result === "failed") {
      console.log("deployment description:", jsonData.StatusDescription);
      core.setFailed(jsonData.StatusDescription);
      return result
    }
    else if (result === "successful") {
      core.setOutput("result", result);
      console.log("deployment description:", jsonData.StatusDescription);
      console.log(`finshed check up deploy result: ${result}.`);

      return result
    } else {
      var waitTill = new Date(new Date().getTime() + 4 * 1000);
      while (waitTill > new Date()) { }
      
      console.log(jsonData.Status, ", round:", round)
      // add round counter
      round += 1

      fetchDeploymentResult()
    }
  })
  .catch((err) => {
    // handle error
    console.log(err);
    core.setFailed(err);
    throw err;
  });
}