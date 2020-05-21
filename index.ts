import { Octokit } from "@octokit/rest";
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.TOKEN,
  userAgent: "branch_creator",
  timeZone: "Asia/Colombo",
});

async function run() {
  const { data: repoList } = await octokit.repos.listForOrg({
    org: process.env.ORGANIZATION!,
  });
  

}

run();