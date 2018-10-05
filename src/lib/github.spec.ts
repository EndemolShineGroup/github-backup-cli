import * as GitHub from './github';

describe('github', () => {

  describe('#createGitHubHost', () => {

    it('should generate a valid URL', () => {
      const organization = 'EndemolShineGroup';
      expect(GitHub.createGitHubHost(organization))
        .toContain(`https://github.com/${organization}/`);
    })
  });
});
