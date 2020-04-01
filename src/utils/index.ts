export const getRepoNameFromPath = (path: string) => {
  /**
   * This regex is overkill but should get `test` in all of these examples:
   *
   * /here/path/test.git
   * /here/path/test
   * /test
   * /test.git
   * test
   * test.git
   */
  const [_, repoName] = /(?:.*\/|^)(.*?)(?:\.git)?$/.exec(path) || [];
  return repoName;
};

export const getRepoNameFromUri = (path: string) => {
  /**
   * This regex is overkill but should get `test` in all of these examples:
   *
   * https://github.com/unicorn-utterances/unicorn-utterances.git
   * https://github.com/unicorn-utterances/unicorn-utterances
   */
  const [_, repoName] = /(?:.*\/|^)(.*?)(?:\.git)?$/.exec(path) || [];
  return repoName;
};

