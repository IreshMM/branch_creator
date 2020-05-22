import { ReposListForOrgResponseData } from "@octokit/types";
import { Octokit } from "@octokit/rest";
import { createBranches } from "./creation";
import { setProtections } from "./rules";

export async function processRepo(
  context: Octokit,
  repo: ReposListForOrgResponseData[0]
) {
  try {
    const { data: masterCommit } = await context.repos.getCommit({
      owner: repo.owner.login,
      repo: repo.name,
      ref: "master",
    });
    await createBranches(context, repo, masterCommit);
    await setProtections(context, repo);
  } catch (error) {
    console.log(`Repo ${repo.name} is probably empty! skipping`);
  }

  console.log(`Repo "${repo.name}" processed!\n`);
}
