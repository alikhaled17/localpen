import { Pen, User } from '../models';
import { Files, getDescriptionFile, getFilesFromConfig } from './utils';

export const exportGithubGist = async (config: Pen, { user }: { user: User }) => {
  if (!user) return;
  const files = getFiles(config, user);
  const response = await saveGist(config, user, files);
  const gistInfo = await response.json();

  if (gistInfo.id) {
    const description = getDescriptionFile(config, user, gistInfo.html_url);
    await saveGist(config, user, description, gistInfo.id); // update gist description with link to project
    window.open('https://gist.github.com/' + gistInfo.id);
  }
};

const getFiles = (config: Pen, user?: User) => {
  const descriptionFile = getDescriptionFile(config, user);
  const contentFiles = getFilesFromConfig(config);

  return {
    ...descriptionFile,
    ...contentFiles,
  };
};

const saveGist = (config: Pen, user: User, files: Files, gistId?: string) => {
  const body = {
    accept: 'application/vnd.github.v3+json',
    description: config.title,
    files,
    public: true,
  };
  let url = 'https://api.github.com/gists';
  if (gistId) {
    url += '/' + gistId;
  }
  return fetch(url, {
    method: gistId ? 'PATCH' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'token ' + user.token,
    },
    body: JSON.stringify(body),
  });
};
