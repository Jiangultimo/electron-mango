module.exports = {
    packagerConfig: {
        ignore:'src|public|main|config|.vscode'
    },
    makers: [
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'linux']
        },
        // {
        //     name: '@electron-forge/maker-dmg',
        //     platforms: ['darwin', 'linux']
        // }
    ]
}