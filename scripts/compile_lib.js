const fetchRepoDir = require('fetch-repo-dir');
const {spawnSync} = require('child_process');
const fs = require('fs/promises');
const { build } = require('esbuild');

const TMP_DIR = './_action_deploy';

async function clear(){
  await fs.rm(TMP_DIR,{force:true, recursive:true});
};

(async ()=>{
  await clear();

  console.log('Downloading repo sveltejs/action-deploy-docs...');
  await fetchRepoDir({src:'sveltejs/action-deploy-docs',dir: TMP_DIR});

  console.log('Installing dependencies...');
  spawnSync('npm',['install'],{
    cwd: TMP_DIR,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
    detached: true
  });

  console.log('Building lib module...');
  await build({
    entryPoints: ['./lib.ts'],
    format: "cjs",
    outfile: 'lib/transform.js',
    minify: true,
    platform: 'node',
    sourcemap: true,
    bundle: true,
  });

  await clear();

  console.log("Done! Don't to run 'npm version patch' and push the commit to update package version in the repo!");
})();
