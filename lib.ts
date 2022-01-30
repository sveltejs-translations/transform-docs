import {get_docs} from './_action_deploy/src/fs/get_content';
import {transform as transform_docs} from './_action_deploy/src/transform/docs';

export async function transform(files,project="transformed_docs"){
  const docs = await get_docs(project,'',files);
  const api = await transform_docs(docs[0][1],docs[0][0]);
  return api;
}