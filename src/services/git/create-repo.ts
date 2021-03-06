import {Repo} from '@entities';
import {getRepoNameFromPath} from '@utils';
import {logService} from '../debug';
import {Platform} from 'react-native';
import {currentBranch} from './current-branch';

const iOS = Platform.OS === 'ios';

export const createNewRepo = async (path: string, name?: string) => {
  logService && console.log('service - createNewRepo');
  const newRepo = new Repo();
  const currentBranchName = await currentBranch({path});

  if (!currentBranchName) {
    throw 'This path is not a git repository';
  }
  newRepo.currentBranchName = currentBranchName;

  const repoName = name || getRepoNameFromPath(path);

  newRepo.name = repoName;
  // iOS needs this workaround - see also the
  newRepo.path = iOS ? repoName : path;
  newRepo.lastUpdated = new Date(Date.now());
  await newRepo.save();
  return newRepo;
};
