const { exec } = require('child_process');
const path = require('path');

// Endpoint to sign IPA
app.post('/sign', upload.fields([{ name: 'ipa' }, { name: 'p12' }, { name: 'provision' }]), (req, res) => {
    const ipaPath = req.files.ipa[0].path;
    const p12Path = req.files.p12[0].path;
    const provisionPath = req.files.provision[0].path;
    const password = req.body.password;

    // Use dynamic app_identifier if provided, else let Fastlane extract it
    const appIdentifier = req.body.app_identifier || null;

    const fastlaneCommand = `fastlane ios sign_ipa ipa_path:${ipaPath} p12_path:${p12Path} profile_path:${provisionPath} p12_password:${password} app_identifier:${appIdentifier || ''}`;

    // Run the Fastlane command
    exec(fastlaneCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error during signing: ${stderr}`);
            return res.status(500).json({ success: false, error: stderr });
        }

        // Send download link to the client
        res.json({
            success: true,
            message: 'IPA signed successfully!',
            downloadUrl: `/downloads/signed-${path.basename(ipaPath)}`
        });
    });
});