import { Random } from 'meteor/random';
import {
    flatMap,
} from 'lodash';

Meteor.methods({
    'files.insert'(file) {
        check(file, Partup.schemas.entities.file);
        this.unblock();

        if (Meteor.user()) {
            if (!file._id) {
                file._id = Random.id();
            }
            Files.insert(file);
            return {
                _id: file._id,
            };
        }
        throw new Meteor.Error(401, 'unauthorized');
    },
    'files.remove'(id) {
        check(id, String);
        this.unblock();

        if (Meteor.user()) {
            Partup.server.services.files.remove(id);
            return {
                _id: id,
            };
        }
        throw new Meteor.Error(401, 'unauthorized');
    },
    'files.remove_many'(ids) {
        check(ids, String);
        this.unblock();

        if (Meteor.user()) {
            _.each(ids, id => Partup.server.services.files.remove(id));
            return {
                _ids: ids,
            };
        }
        throw new Meteor.Error(401, 'unauthorized');
    },
    'files.get'(...ids) {
        ids = flatMap(ids);

        check(ids, [String]);
        this.unblock();

        if (Meteor.user()) {
            const cursor = Files.find({ _id: { $in: ids } });
            return cursor.fetch();
        }
        throw new Meteor.Error(401, 'unauthorized');
    }
});
