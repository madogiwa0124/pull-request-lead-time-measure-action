const core = require("@actions/core");
const github = require("@actions/github");

// NOTE: configure parameters
const repoOwner = github.context.repo.owner;
const repoName = github.context.repo.repo;
const repoType = core.getInput("repo-type");
const percentile = core.getInput("percentile");
const baseBranch = core.getInput("base-branch");
const token = core.getInput("repo-token");

// NOTE: initialize OktoKit
const octokit = github.getOctokit(token);

// main
const dateHourDiff = (before, after) => (after - before) / 1000 / 60 / 60;
const getPulls = async () => {
  return await octokit.request(
    "GET /repos/{owner}/{repo}/pulls?state=closed&per_page=100&sort=created&direction=desc&base={base}",
    {
      owner: repoOwner,
      repo: repoName,
      type: repoType,
      base: baseBranch,
    }
  );
};

try {
  (async () => {
    const res = await getPulls();
    const result = res.data.map((pr) => {
      return {
        number: pr.number,
        title: pr.title,
        created_at: pr.created_at,
        merged_at: pr.merged_at,
        closed_at: pr.closed_at,
        duration_hour: dateHourDiff(
          new Date(pr.created_at),
          new Date(pr.closed_at)
        ),
      };
    });
    const durations = result.map((r) => r.duration_hour).sort((a, b) => a - b);
    const percentile_index = Math.floor(
      durations.length * (percentile / 100.0)
    );
    core.setOutput("lead-time", durations[percentile_index]);
  })();
} catch (error) {
  core.setFailed(error.message);
}
