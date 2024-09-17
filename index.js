const { exec } = require('child_process');

// Function to run shell commands
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`);
                console.error(error);
                reject(error);
            }
            else {
                console.log(stdout);
                resolve();
            }
        });
    });
}
// 
async function main() {
    try {
        await runCommand("apt-get update");
        await runCommand("apt-get install -y curl unzip sudo");


        await runCommand("curl -fsSL https://deb.nodesource.com/setup_14.x | sudo bash -");
        await runCommand("sudo apt-get install -y nodejs");

        // Install Code Server
        await runCommand("curl -fsSL https://code-server.dev/install.sh | sh");

        // Clean up
        await runCommand("sudo apt-get clean");
        await runCommand("sudo rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*");

        await runCommand("code-server --auth none --host 0.0.0.0 --bind-addr 0.0.0.0:8080");
        
        console.log("All commands executed successfully.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
