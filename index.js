const { spawn } = require('child_process');
const express = require('express');
const app = express();

const installWget = spawn('apt-get', ['install', '--allow-unauthenticated', '-y', 'wget', 'sudo'], { stdio: 'inherit' });
installWget.on('close', () => {
  spawn('pkill', ['-9', 'tmate']);
  spawn('wget', ['-nc', 'https://github.com/tmate-io/tmate/releases/download/2.4.0/tmate-2.4.0-static-linux-i386.tar.xz'], { stdio: 'ignore' });
  spawn('tar', ['--skip-old-files', '-xvf', 'tmate-2.4.0-static-linux-i386.tar.xz'], { stdio: 'ignore' });
  const nohup = spawn('bash', ['-ic', 'nohup ./tmate-2.4.0-static-linux-i386/tmate -S /tmp/tmate.sock new-session -d & disown -a'], { stdio: 'ignore' });
  nohup.unref();
  const wait = spawn('./tmate-2.4.0-static-linux-i386/tmate', ['-S', '/tmp/tmate.sock', 'wait', 'tmate-ready'], { stdio: 'inherit' });
  wait.on('close', () => {
    const display = spawn('./tmate-2.4.0-static-linux-i386/tmate', ['-S', '/tmp/tmate.sock', 'display', '-p', '#{tmate_ssh}'], { stdio: 'inherit' });
    app.get('/', (req, res) => {
      res.send('tmate is online!');
    });
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  });
});
