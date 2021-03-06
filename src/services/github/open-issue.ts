import {Linking} from 'react-native';
import {getFileContents} from './get-file-contents';
import {createIssueWithAPI} from '@services/github/create-issue-with-api';
import {FullError} from '@types';

export async function openGitHubIssue(err: FullError) {
  const bugReport = await getFileContents(
    '.github/ISSUE_TEMPLATE/bug_report.md',
  );

  const body = bugReport
    .replace(
      '{{Put the simple error code here}}',
      `**${err.explainMessage}**: ${err.errorMessage}`,
    )
    .replace('{{Put the stack trace here}}', err.callStack);

  const issueEditURL = await createIssueWithAPI(body);

  return await Linking.openURL(issueEditURL);
}
