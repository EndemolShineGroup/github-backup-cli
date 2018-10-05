import 'isomorphic-fetch';

export const createGitHubHost = (userOrOrganization: string) => {
  return `https://github.com/${userOrOrganization}/`;
};

export const makeGitHubApiRequest = (endpoint: string, token: string) => {
  return fetch(`https://api.github.com/${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
};

export const getUserRepos = (userName: string, token: string) => {
  return makeGitHubApiRequest(`users/${userName}/repos`, token);
};

export const getOrganizationRepos = (orgName: string, token: string) => {
  return makeGitHubApiRequest(`orgs/${orgName}/repos`, token);
};
