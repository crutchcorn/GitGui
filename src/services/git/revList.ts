/**
 * This is a hacky awful implementation of:
 * `git rev-list --count main ^asdf`
 *
 * It's meant to report the difference between two branches (one remote)
 * so that we can easily report "needs to push" and "needs to pull"
 *
 *
 * This is so unacceptably slow OML
 */
import git from 'isomorphic-git/index.umd.min.js';
import {fs} from '@constants';

interface GetDiffNumberProps {
  logList: any[];
  path: string;
  parentOid: string;
}

const getDiffNumber = async ({
  logList,
  path,
  parentOid,
}: GetDiffNumberProps) => {
  let diffNum = 0;
  for (const commit of logList) {
    const isDec = await git.isDescendent({
      fs,
      dir: path,
      oid: parentOid,
      ancestor: commit.oid,
      depth: -1,
    });
    if (isDec) {
      // Don't go further down the log tree
      break;
    }
    diffNum++;
  }

  return diffNum;
};

interface RevListProps {
  dir: string;
  branchName1: string;
  branchName2: string;
}

export const revList = async ({
  dir,
  branchName1,
  branchName2,
}: RevListProps) => {
  console.log('I AM RUNNING');
  const [branch1Log, branch2Log] = await Promise.all([
    git.log({
      fs,
      dir,
      ref: branchName1,
    }),
    git.log({
      fs,
      dir,
      ref: branchName2,
    }),
  ]);

  console.log('LOGS', branch1Log, branch2Log);

  const [branch1Diff, branch2Diff] = await Promise.all([
    getDiffNumber({
      path: dir,
      logList: branch2Log,
      parentOid: branch1Log[0].oid,
    }),
    getDiffNumber({
      path: dir,
      logList: branch1Log,
      parentOid: branch2Log[0].oid,
    }),
  ]);

  console.log('DIFFS', branch1Diff, branch2Diff);

  return {
    // What was in "branch 2" but not in branch 1
    branch1Diff,
    // What was in "branch 1" but not in branch 2
    branch2Diff,
  };
};