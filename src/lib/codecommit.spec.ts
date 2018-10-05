import * as CodeCommit from './codecommit';

describe('codecommit', () => {

  describe('#createCodeCommitHost', () => {

    it('should generate a valid URL', () => {
      const region = 'us-east-1';
      expect(CodeCommit.createCodeCommitHost(region))
        .toContain(`https://git-codecommit.${region}.amazonaws.com/v1/repos/`);
    })
  });
});
