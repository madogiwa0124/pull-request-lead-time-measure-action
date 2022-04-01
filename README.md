# Pull Request lead time measure action

GitHub Action to measure the time to close the last 100 pull requests.

## Inputs

## `base-branch`.

**REQUIRED** Name of the base branch.

## `repo-type`.

Default is `private`.

## `percentile`.

**REQUIRED** The percentile of the measurement to output. Default is 50.

## `repo-token`

**REQUIRED** github personal access token.

## Output

## `lead-time`.

Time (hour) from creation to close of the Pull Request.

```sh
The lead time was 0.30944444444444447 hour.
```

## example

```yml
- name: run pull-request-lead-time-measure-action
  uses: madogiwa0124/pull-request-lead-time-measure-action
  id: pull-request-lead-time-measure-action
  with:
    base-branch: main
    repo-type: private
    percentile: 50
    repo-token: ${{ secrets.MY_GITHUB_TOKEN }}
- name: Get the lead time
  run: echo "The lead-time was ${{ steps.pull-request-lead-time-measure-action.outputs.lead-time }} hour."
```
