import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { promisify } from 'util';
import { logError } from './utils';

const exec = promisify(require('child_process').exec);

export type GitAccount = {
    username: string;
    email: string;
    sshFile: string;
};


export function getGitAccounts(): GitAccount[] | null {
    try {
        const file = `${homedir()}/.ssh/vscode-git-accounts.json`;

        const data = readFileSync(file, 'utf8');
        const accounts = JSON.parse(data);

        return accounts;
    } catch (err) {
        if (err instanceof Error && err.message.includes('ENOENT')) {
            return null;
        }
        logError(err);
        return null;
    }
}

export function addGitAccount(username: string, email: string, sshFile: string): boolean {
    try {
        const file = `${homedir()}/.ssh/vscode-git-accounts.json`;

        let accounts = getGitAccounts();

        if (!accounts) {
            console.log('No git accounts found. Creating new file.');
            accounts = [];
        }

        accounts.push({ username, email, sshFile });

        writeFileSync(file, JSON.stringify(accounts));

        return true;
    } catch (err) {
        logError(err);
        return false;
    }
}

export function removeGitAccount(username: string): boolean {
    try {
        const file = `${homedir()}/.ssh/vscode-git-accounts.json`;

        const data = readFileSync(file, 'utf8');
        const accounts: GitAccount[] = JSON.parse(data);

        const updatedAccounts = accounts.filter((account) => account.username !== username);

        writeFileSync(file, JSON.stringify(updatedAccounts));

        console.log(JSON.stringify(getGitAccounts()));

        return true;
    } catch (err) {
        logError(err);
        return false;
    }
}

async function executeShellCommand(command: string): Promise<string | null> {
    try {
        const { stdout } = await exec(command);
        return stdout;
    } catch (error) {
        console.log('Error: cannot execute shell command');
        return null;
    }
}

export async function switchGitAccount1111(): Promise<{ username: string; email: string } | null> {
    const username = await executeShellCommand('git config user.name');
    const email = await executeShellCommand('git config user.email');

    if (!username || !email) {
        console.log('Error: cannot get git username or email');
        return null;
    }

    console.log(`Git Username: ${username}`);
    console.log(`Git Email: ${email}`);

    return { username, email };
}

export async function switchGitAccount(username: string, email: string): Promise<{ username: string; email: string } | null> {
    const existingUsername = await executeShellCommand('git config user.name');
    const existingEmail = await executeShellCommand('git config user.email');

    if (existingUsername === null || existingEmail === null) {
        console.log('Error: cannot get git username or email');
        return null;
    }

    console.log(`Existing Git Username: ${existingUsername}`);
    console.log(`Existing Git Email: ${existingEmail}`);

    const updatedUsername = await executeShellCommand(` git config --global --replace-all user.name "${username}"`);
    const updatedEmail = await executeShellCommand(` git config --global --replace-all user.email "${email}"`);

    if (updatedUsername === null || updatedEmail === null) {
        console.log('Error: cannot update git username or email');
        return null;
    }

    console.log(`Updated Git Username: ${username}`);
    console.log(`Updated Git Email: ${email}`);

    return { username: username, email: email };
}

