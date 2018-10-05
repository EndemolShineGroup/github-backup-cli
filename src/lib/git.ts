import { spawn } from 'promisify-child-process';

export const cloneMirror = async (sourceRepository: string) => {
  const childProcess = spawn('git', [ 'clone', '--mirror', sourceRepository ]);

  childProcess.stderr.on('data', (data) => {
    console.error(data);
  });

  await childProcess;
};

export const pushMirror = async (destinationRepository: string) => {
  const childProcess = spawn('git', [ 'push', '--mirror', destinationRepository ]);

  childProcess.stderr.on('data', (data) => {
    console.error(data);
  });

  await childProcess;
};
