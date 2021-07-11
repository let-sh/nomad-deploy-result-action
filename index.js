const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

try {

  var result = fetchDeploymentResult();
  core.setOutput("result", result);
  console.log(`finshed check up deploy result: ${result}.`);
      
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
    console.log(jsonData.Status)
    if (result === "failed") {
      console.log("deployment description:", jsonData.StatusDescription);
      core.setFailed(jsonData.StatusDescription);
      return result
    }
    else if (result === "successful") {
      console.log("deployment description:", jsonData.StatusDescription);
      return result
    } else {
      var waitTill = new Date(new Date().getTime() + 4 * 1000);
      while(waitTill > new Date()){}
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