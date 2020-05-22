import { ReposListForOrgResponseData } from "@octokit/types";
import { Octokit } from "@octokit/rest";
import { createBranches } from "./creation";

export async function processRepo(
  context: Octokit,
  repo: ReposListForOrgResponseData[0]
) {
  context.repos
    .getCommit({
      owner: repo.owner.login,
      repo: repo.name,
      ref: "master",
    })
    .then((masterCommitResponse) => {
        createBranches(
            context,
            repo,
            masterCommitResponse.data
        )
    })
    .catch((reason) => {
      console.log(`Repo ${repo.name} is probably empty! skipping`);
    });
}
