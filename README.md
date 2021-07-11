# Nomad deploy result action

This action waiting for nomad deployment result. Sucess to continue, Failed to stop.

## Inputs

| input           | required | default                 | sample                                 | description                    |
| --------------- | -------- | ----------------------- | -------------------------------------- | ------------------------------ |
| nomad-addr      | ✅       | "http://localhost:4646" | "http://localhost:4646"                | Nomad endpoint address         |
| nomad-token     | ✅       | ""                      | "F5476034-7A75-4A27-BA45-65B0F7B291B9" | Nomad token to access endpoint |
| nomad-job-name  | ✅       | ""                      | "nginx"                                | Nomad job to inspect           |
| nomad-namespace |          | "default"               | "default"                              | Nomad namespace                |

<!-- ## Outputs

## `time`

The time we greeted you. -->

## Example usage

```yml
uses: let-sh/nomad-deploy-result-action@v1
with:
  who-to-greet: "Mona the Octocat"
```
