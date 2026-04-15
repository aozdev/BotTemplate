const fs = require("fs");
const path = require("path");

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code !== "ESRCH";
  }
}

function acquireProcessLock(rootDir, fileName = ".bot.lock") {
  const lockPath = path.join(rootDir, fileName);
  const currentPid = `${process.pid}\n`;

  try {
    fs.writeFileSync(lockPath, currentPid, { flag: "wx" });
    return lockPath;
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }

    const existingPid = Number.parseInt(fs.readFileSync(lockPath, "utf8"), 10);

    if (isProcessRunning(existingPid)) {
      const lockError = new Error(
        `Another bot instance is already running (PID ${existingPid}). Stop it before starting a new one.`
      );
      lockError.code = "ELOCKED";
      throw lockError;
    }

    fs.writeFileSync(lockPath, currentPid);
    return lockPath;
  }
}

function releaseProcessLock(lockPath) {
  try {
    if (!lockPath || !fs.existsSync(lockPath)) {
      return;
    }

    const ownerPid = Number.parseInt(fs.readFileSync(lockPath, "utf8"), 10);

    if (ownerPid === process.pid) {
      fs.unlinkSync(lockPath);
    }
  } catch (error) {
    console.warn(`[Startup] Failed to release lock: ${error.message}`);
  }
}

module.exports = {
  acquireProcessLock,
  releaseProcessLock
};
