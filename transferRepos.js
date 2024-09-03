const axios = require("axios");

// Replace with your details
const oldUsername = "RamisettyKarunasree-wal";
const newUsername = "KarunasreeR";
const token = "give your secretToken";

const headers = {
  Authorization: `Bearer ${token}`, // Ensure Bearer token format
  Accept: "application/vnd.github+json", // Correct Accept header
  "X-GitHub-Api-Version": "2022-11-28", // GitHub API version header
};
// Function to transfer a single repository
async function transferRepo(repoName) {
  const transferUrl = `https://api.github.com/repos/${oldUsername}/${repoName}/transfer`;

  const data = {
    new_owner: newUsername,
    new_name: repoName,
  };

  const headers = {
    Authorization: `token ${token}`, // Ensure Bearer token format
    Accept: "application/vnd.github.v3+json", // Correct Accept header
    "X-GitHub-Api-Version": "2022-11-28", // GitHub API version header
  };

  try {
    const response = await axios.post(transferUrl, data, { headers });
    if (response.status === 202) {
      console.log(`Successfully transferred ${repoName} to ${newUsername}`);
    } else {
      console.error(`Failed to transfer ${repoName}: ${response.data.message}`);
    }
  } catch (error) {
    console.error(`Error transferring ${repoName}: ${error.message}`);
  }
}

// Function to get all repositories and transfer them
async function transferAllRepos() {
  const reposUrl = `https://api.github.com/users/${oldUsername}/repos`;

  try {
    const response = await axios.get(reposUrl, { headers });
    const repos = response.data;

    for (const repo of repos) {
      await transferRepo(repo.name);
    }
  } catch (error) {
    console.error(`Error fetching repositories: ${error.message}`);
  }
}

// Function to grant admin rights to a single repository
async function addAdminRights(repoName) {
  const url = `https://api.github.com/repos/${oldUsername}/${repoName}/collaborators/${newUsername}`;

  const data = {
    permission: "admin",
  };

  try {
    const response = await axios.put(url, data, { headers });
    if (response.status === 201) {
      console.log(
        `Successfully granted admin rights for ${repoName} to ${newUsername}`
      );
    } else {
      console.error(
        `Failed to grant admin rights for ${repoName}: ${response.data.message}`
      );
    }
  } catch (error) {
    console.error(
      `Error granting admin rights for ${repoName}: ${error.message}`
    );
  }
}

// Function to get all repositories and grant admin rights
async function grantAdminRightsToAllRepos() {
  const reposUrl = `https://api.github.com/users/${oldUsername}/repos`;

  try {
    const response = await axios.get(reposUrl, { headers });
    const repos = response.data;

    for (const repo of repos) {
      await addAdminRights(repo.name);
    }
  } catch (error) {
    console.error(`Error fetching repositories: ${error.message}`);
  }
}

// Execute the transfer and then grant admin rights
async function executeTransferAndRights() {
  await grantAdminRightsToAllRepos();
  await transferAllRepos();
}

// Execute the combined process
executeTransferAndRights();
