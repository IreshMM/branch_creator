import { Octokit } from "@octokit/rest";
import { ReposListForOrgResponseData } from "@octokit/types";
import { branches, protection } from "./config/data";

export async function setProtections(
  context: Octokit,
  repo: ReposListForOrgResponseData[0]
) {
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    await setProtectionForBranch(context, repo, branch);
  }
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

    if (response.status == 200) {
      console.log(
        `Branch protection for branch ${branch} on Repo ${repo.name} created!`
      );
      return true;
    }
    return false;
  } catch (error) {
    console.log(
      `Couldn't create the protection for branch ${branch} on Repo ${repo.name}`
    );
  }
}
