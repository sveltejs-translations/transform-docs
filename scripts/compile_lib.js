const fetchRepoDir = require('fetch-repo-dir');
const {spawnSync} = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const { build } = require('esbuild');

const TMP_DIR = './_action_deploy';

async function clear(){
  await fs.rm(TMP_DIR,{force:true, recursive:true});
};

(async ()=>{
  await clear();

  console.log('Downloading repo sveltejs/action-deploy-docs...');
  await fetchRepoDir({src:'sveltejs/action-deploy-docs',dir: TMP_DIR});

  await patch_faq_title();
  await patch_svelte_code_hl();

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


async function patch_faq_title(){
  const file = path.join(TMP_DIR,'src','format','frontmatter.ts');
  console.log('Patching FAQ title...');
  let body = await fs.readFile(file,'utf-8');
  body = body.replace('vFile.data.frontmatter.question','(vFile.data.frontmatter.question || vFile.data.frontmatter.title)');
  await fs.writeFile(file,body);
}

async function patch_svelte_code_hl(){
  const file = path.join(TMP_DIR,'src','format','code.ts');
  console.log('Patching Svelte Code Highlighting...');
  let body = await fs.readFile(file,'utf-8');
  body = body.replace('sv = "svelte",','sv = "svelte",\nsvelte = "svelte",');
  await fs.writeFile(file,body);
}