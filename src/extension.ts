import * as vscode from 'vscode';
import { createConfigFile, generateConfig } from './functions/ssh';
import { addGitAccount, removeGitAccount, getGitAccounts, switchGitAccount, GitAccount } from './functions/account';

function validateField(field: string | undefined) {
	if (field === undefined || field.trim().length === 0) {
		return false;
	}
	return true;
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "switch-git-account" is now active!');

	// const switchGitAccountCommand = vscode.commands.registerCommand('switch-git-account.switchGitAccount', () => {
	// 	const sshConfig = generateSSHConfig(sshFilesForAccounts.work);
	// 	createSSHConfigFile(sshConfig);

	// 	vscode.window.showInformationMessage('Git Account Switched');
	// });

	// const addGitAccount = vscode.commands.registerCommand('switch-git-account.addGitAccount', () => {
	// 	const x = test();
	// 	vscode.window.showInformationMessage('Git Account Added');
	// });

	// const addGitAccount = vscode.commands.registerCommand('switch-git-account.addGitAccount', () => {
	// 	const x = test();
	// 	vscode.window.showInformationMessage(`Switch Git Account: ${x}`);
	// });

	const addGitAccountCommand = vscode.commands.registerCommand('switch-git-account.addGitAccount', async () => {
		const username = await vscode.window.showInputBox({
			placeHolder: '',
			prompt: 'Enter your git username',
			ignoreFocusOut: true
		});

		const email = await vscode.window.showInputBox({
			placeHolder: '',
			prompt: 'Enter your git email',
			ignoreFocusOut: true
		});

		const sshFile = await vscode.window.showInputBox({
			placeHolder: '',
			prompt: 'Enter the name of your ssh file for this git account',
			ignoreFocusOut: true
		});

		if (!username || !email || !sshFile || username.trim().length === 0 || email.trim().length === 0 || sshFile.trim().length === 0) {
			vscode.window.showErrorMessage('Please enter all fields');
			return;
		}

		addGitAccount(username, email, sshFile);


		vscode.window.showInformationMessage(`Added Git Account: ${username}`);
	});

	const removeGitAccountCommand = vscode.commands.registerCommand('switch-git-account.removeGitAccount', async () => {
		const accounts = getGitAccounts();
		if (!accounts || accounts.length === 0) {
			vscode.window.showErrorMessage('No accounts found');
			return;
		}

		const accountsList = accounts.map((account: GitAccount) => account.username + ' - ' + account.email);

		const accountToRemove = await vscode.window.showQuickPick(accountsList, {
			title: 'Pick an account to remove',
		})

		if (!accountToRemove) {
			vscode.window.showErrorMessage('No account selected');
			return;
		}

		const username = accountToRemove.split(' - ')[0];
		removeGitAccount(username);
		vscode.window.showInformationMessage(`Removed Git Account: ${username}`);
	});

	const switchGitAccountCommand = vscode.commands.registerCommand('switch-git-account.switchGitAccount', async () => {
		const accounts = getGitAccounts();
		if (!accounts || accounts.length === 0) {
			vscode.window.showErrorMessage('No accounts found');
			return;
		}

		const accountsList = accounts.map((account: GitAccount) => account.username + ' - ' + account.email + ' - ' + account.sshFile);

		const accountToSwitchTo = await vscode.window.showQuickPick(accountsList, {
			title: 'Pick an account to switch to',
		})

		if (!accountToSwitchTo) {
			vscode.window.showErrorMessage('No account selected');
			return;
		}

		const gitUsernameEmailSshFile = accountToSwitchTo.split(' - ');
		const username = gitUsernameEmailSshFile[0];
		const email = gitUsernameEmailSshFile[1];

		const result = await switchGitAccount(username, email);

		if (!result) {
			vscode.window.showErrorMessage('Error switching git account');
			return;
		}

		const sshFile = gitUsernameEmailSshFile[2];

		const sshConfig = generateConfig(sshFile);

		const configCreated = createConfigFile(sshConfig);

		if (!configCreated) {
			vscode.window.showErrorMessage('Error creating ssh config file');
			return;
		}

		vscode.window.showInformationMessage(`Git Account Switched to ${result.username}`);
	});

	context.subscriptions.push(...[addGitAccountCommand, removeGitAccountCommand, switchGitAccountCommand]);
}

export function deactivate() { }
