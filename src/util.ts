import { Octokit } from "@octokit/rest";
import {
  ReposListForOrgResponseData,
  ReposGetCommitResponseData,
} from "@octokit/types";

export async function createBranchFromCommit(
  context: Octokit,
  repo: ReposListForOrgResponseData[0],
  branch: string,
  commit: ReposGetCommitResponseData
) {
  const payload = {
    owner: repo.owner.login,
    repo: repo.name,
    ref: `refs/heads/${branch}`,
    sha: commit.sha
  };

  const response  = await context.git.createRef(payload);

  if(response.status == 201) return true;
  return false;
}
