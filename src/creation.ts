import { Octokit } from "@octokit/rest";
import {
  ReposListForOrgResponseData,
  ReposGetCommitResponseData,
} from "@octokit/types";
import { branches } from "./config/data";

async function createBranchFromCommit(
  context: Octokit,
  repo: ReposListForOrgResponseData[0],
  branch: string,
  commit: ReposGetCommitResponseData
) {
  const payload = {
    owner: repo.owner.login,
    repo: repo.name,
    ref: `refs/heads/${branch}`,
    sha: commit.sha,
  };

  try {
    const response = await context.git.createRef(payload);

    if (response.status == 201) return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function branchExists(
  context: Octokit,
  repo: ReposListForOrgResponseData[0],
  branch: string
) {
  const payload = {
    owner: repo.owner.login,
    repo: repo.name,
    ref: `heads/${branch}`,
  };
  try {
    const response = await context.git.getRef(payload);
    if (response.status == 200) return true;
    return false;
  } catch (reason) {
    return false;
  }
}

export async function createBranches(
  context: Octokit,
  repo: ReposListForOrgResponseData[0],
  commit: ReposGetCommitResponseData
) {
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    if (!(await branchExists(context, repo, branch))) {
      if (await createBranchFromCommit(context, repo, branch, commit)) {
        console.log(`Branch ${branch} has been created for Repo ${repo.name}`);
      } else {
        console.log(`Couldn't create ${branch} for Repo ${repo.name}`);
      }
    } else {
      console.log(`Branch ${branch} already exists on Repo ${repo.name}`);
    }
  }
}
