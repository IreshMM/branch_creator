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
  const repoList  = await octokit.paginate(octokit.repos.listForOrg, {
    org: process.env.ORGANIZATION!,
  });
  for (let i = 0; i < repoList.length; i++) {
    const repo = repoList[i];
    console.log(`Processing repo number: ${i + 1}`);
    await processRepo(octokit, repo);
  }
}

run();