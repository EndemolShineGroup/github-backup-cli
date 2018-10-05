import { spawn } from 'promisify-child-process';

export const createCodeCommitHost = (region: string) => {
  return `https://git-codecommit.${region}.amazonaws.com/v1/repos/`;
};

export const setupCredentialHelper = async () => {
  const childProcess = spawn('git', [
    'config',
    '--global',
    'credential.helper',
    "'!aws codecommit credential-helper $@'",
  ]);

  childProcess.stderr.on('data', (data) => {
    console.error(data);
  });

  await childProcess;

  const childProcessTwo = spawn('git', [
    'config',
    '--global',
    'credential.UseHttpPath',
    'true',
  ]);

  await childProcessTwo;
};
