export const sshFilesForAccounts = {
    work: 'id_rsa_work',
    pers: 'omarqazidev-git-ed25519',
};

export function createSSHConfigFile(data: string) {
    const fs = require('fs');
    const homeDir = require('os').homedir();
    backupExistingSSHConfig();
    fs.writeFileSync(`${homeDir}/.ssh/configwww`, data);
}

export function generateSSHConfig(account: string) {
    const config = `Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/${account}`;

    return config;
}

export function backupExistingSSHConfig() {
    const fs = require('fs');
    const homeDir = require('os').homedir();
    const timestamp = new Date().toISOString().split('T')[0];
    fs.copyFileSync(`${homeDir}/.ssh/config`, `${homeDir}/.ssh/config-backup-${timestamp}`);
}

export function addGitAccount() {

}
export function test() {
    const homeDir = require('os').homedir();
    console.log(homeDir);
    return homeDir;
}

// createSSHConfigFileInWindows('OmarQazi', generateSSHConfig(sshFilesForAccounts.work));
