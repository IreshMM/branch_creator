import { Octokit } from "@octokit/rest";
import { processRepo } from "./process";
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.TOKEN,
  userAgent: "branch_creator",
  timeZone: "Asia/Colombo",
  previews: ['luke-cage']
});

async function run() {
  const { data: repoList } = await octokit.repos.listForOrg({
    org: process.env.ORGANIZATION!,
  });
  for (let i = 0; i < repoList.length; i++) {
    const repo = repoList[i];
    await processRepo(octokit, repo);
  }
}

run();