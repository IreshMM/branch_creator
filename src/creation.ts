import { Octokit } from "@octokit/rest";
import {
  ReposListForOrgResponseData,
  ReposGetCommitResponseData,
} from "@octokit/types";
import fs from "fs";

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
  fs.readFile("branches.json", (err, data) => {
    if (err) {
      console.log("Please check if branches.json file exists!");
      throw err;
    }
    const branchData = JSON.parse(data.toString());

    branchData.branches.forEach(async (branch: any) => {
      if (!(await branchExists(context, repo, branch.name))) {
        if (await createBranchFromCommit(context, repo, branch.name, commit)) {
          console.log(
            `Branch ${branch.name} has been created for Repo ${repo.name}`
          );
        } else {
          console.log(`Couldn't create ${branch.name} for Repo ${repo.name}`);
        }
      } else {
        console.log(
          `Branch ${branch.name} already exists on Repo ${repo.name}`
        );
      }
    });
  });
}
