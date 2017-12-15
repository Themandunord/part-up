import _, { concat, get } from 'lodash';
import { Random } from 'meteor/random';

/**
 * Files are entities stored under each object that contains one or more files
 *
 * @namespace Files
 * @memberOf Collection
 */
Files = new Meteor.Collection('cfs.files.filerecord'); // Collection name is for backwards compatibility

/**
 * Find files for an update
 *
 * @memberOf Files
 * @param {Update} update
 * @return {Mongo.Cursor}
 */
Files.findForUpdate = function(update) {
    const files = concat(update.type_data.files, update.type_data.documents) || [];
    return Files.find({ _id: { $in: files } });
};

Files.findForActivity = function (activity) {
    const { documents = [] } = get(activity, 'files');
    return Files.find({ _id: { $in: documents } });
};

Files.getForUpdate = function (updateId) {
    return new Promise((resolve, reject) => {
        let files = [];

        const update = Updates.findOne(updateId);
        if (update && update.type_data) {
            const fileIds = update.type_data.documents;

            if (fileIds) {
                files = Files.find({ _id: { $in: fileIds } });
                if (!files) {
                    reject();
                }
            }
        }

        resolve(files);
    });
};

Files.get = (ids) => {
    ids = Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
        if (ids) {
            const files = Files.find({ _id: { $in: ids } });
            resolve(files);
        } else {
            reject();
        }
    });
};
