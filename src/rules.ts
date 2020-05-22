import { Octokit } from "@octokit/rest";
import { ReposListForOrgResponseData } from "@octokit/types";
import { branches, protection } from "./config/data";

export async function setProtections(
  context: Octokit,
  repo: ReposListForOrgResponseData[0]
) {
  branches.forEach(async (branch) => {
    await setProtectionForBranch(context, repo, branch);
  });
}

async function setProtectionForBranch(
  context: Octokit,
  repo: ReposListForOrgResponseData[0],
  branch: string
) {
  try {
    const response = await context.repos.updateBranchProtection({
      ...{
        owner: repo.owner.login,
        repo: repo.name,
        branch,
      },
      ...protection,
    });

    if (response.status == 200) return true;
    return false;
  } catch (error) {
    console.log(
      `Couldn't create the protection for branch ${branch} on Repo ${repo.name}`
    );
  }
}
