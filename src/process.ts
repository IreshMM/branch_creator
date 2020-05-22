import { ReposListForOrgResponseData } from "@octokit/types";
import { Octokit } from "@octokit/rest";

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
    .then((masterCommit) => {
        console.log('Creating branches....');
        // TODO
        // Create the specified branches
    })
    .catch((reason) => {
      console.log(`Repo ${repo.name} is probably empty!\nSo skipping`);
    });
}
