export const messages = {
    forms: {
        description: {
            default: 'Working',
            message: 'Enter your default time entry description.'
        },
        project: 'Select your default project',
        token: 'Enter your name API Key:\n(For getting your Toggl API token you can go to https://track.toggl.com/profile and scroll to the bottom of your profile)\n',
        workspace: 'Select your default workspace'
    },
    missingConfig: {
        token: `Your Toggl API key is missing in your config. Please, set your Toggl API token with 'track set token'.

For getting your Toggl API token you can go to https://track.toggl.com/profile and scroll to the bottom of your profile.`,
        workspace: 'Your default workspace ID is missing in your config. Please, set your default workspace ID with \'track set workspace\'.',

    }
}
