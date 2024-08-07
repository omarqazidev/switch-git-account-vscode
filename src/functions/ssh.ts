import { copyFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { logError } from './utils';

export function generateConfig(file: string) {
    const config = `Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/${file}`;

    return config;
}

function backupExistingSSHConfig() {
    try {
        const timestamp = new Date().toISOString().split('T')[0];
        copyFileSync(`${homedir()}/.ssh/config`, `${homedir()}/.ssh/config-backup-${timestamp}`);
    } catch (err) {
        if (err instanceof Error && err.message.includes('ENOENT')) {
            return null;
        }
        logError(err);
        return null;
    }
}

// type returnVal = 'file-doesnt-exist' | 'file-copied' | null;

// function saveDefaultSSHConfig(): returnVal {
//     try {
//         copyFileSync(`${homedir()}/.ssh/config`, `${homedir()}/sga-ssh/default`);
//         return 'file-copied';
//     } catch (err) {
//         if (err instanceof Error && err.message.includes('ENOENT')) {
//             return 'file-doesnt-exist';
//         }
//         logError(err);
//         return null;
//     }
// }

export function createConfigFile(data: string) {
    try {
        backupExistingSSHConfig();
        writeFileSync(`${homedir()}/.ssh/config`, data);
        return true;
    } catch (err) {
        logError(err);
        return null;
    }
}
