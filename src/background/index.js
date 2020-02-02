/** ****************************************************************************
 *                                 HOT RELOAD                                   *
 *******************************************************************************/
const filesInDirectory = dir =>
    new Promise(resolve =>
        dir.createReader().readEntries(entries =>
            Promise.all(
                entries
                    .filter(e => e.name[0] !== ".")
                    .map(e =>
                        e.isDirectory
                            ? filesInDirectory(e)
                            : new Promise(resolve => e.file(resolve))
                    )
            )
                .then(files => [].concat(...files))
                .then(resolve)
        )
    );

const timestampForFilesInDirectory = dir =>
    filesInDirectory(dir).then(files =>
        files.map(f => f.name + f.lastModifiedDate).join()
    );

const reload = () => {
    whale.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]) {
            whale.tabs.reload(tabs[0].id);
        }
        whale.runtime.reload();
    });
};

const watchChanges = (dir, lastTimestamp) => {
    timestampForFilesInDirectory(dir).then(timestamp => {
        if (!lastTimestamp || lastTimestamp === timestamp) {
            setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
        } else {
            reload();
        }
    });
};

whale.management.getSelf(self => {
    if (self.installType === "development") {
        whale.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
    }
});

/** ****************************************************************************/

// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
    console.log(details);
});
