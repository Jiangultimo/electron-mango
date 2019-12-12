module.exports = {
    packagerConfig: {
        ignore:'src|public|main|config|.vscode'
    },
    makers: [
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'linux']
        },
    ]
}