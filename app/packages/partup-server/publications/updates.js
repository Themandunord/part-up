/**
 * Children of an update
 */
var updateChildren = [
    {find: Meteor.users.findUserForUpdate, children: [
        {find: Images.findForUser}
    ]},
    {find: Images.findForUpdate},
    {find: Images.findForUpdateComments},
    {find: Files.findForUpdate},
    {find: Activities.findForUpdate},
    {find: Contributions.findForUpdate, children: [
        {find: Activities.findForContribution},
        {find: Ratings.findForContribution, children: [
            {find: Meteor.users.findForRating, children: [
                {find: Images.findForUser}
            ]}
        ]}
    ]}
];

/**
 * Publish all required data for requested update
 *
 * @param {String} updateId
 */
Meteor.publishComposite('updates.one', function(updateId) {
    check(updateId, String);

    this.unblock();

    return {
        find: function() {
            var updateCursor = Updates.find({_id: updateId}, {limit: 1});

            var update = updateCursor.fetch().pop();
            if (!update) return;

            var partup = Partups.guardedFind(this.userId, {_id: update.partup_id}, {limit:1}).fetch().pop();
            if (!partup) return;

            return updateCursor;
        },
        children: updateChildren
    };
});

/**
 * Publish all required data for updates in a part-up
 *
 * @param {String} partupId
 * @param {Object} parameters
 * @param {Number} parameters.limit
 * @param {String} parameters.filter
 * @param {String} accessToken
 */
Meteor.publishComposite('updates.from_partup', function(partupId, parameters, accessToken) {
    check(partupId, String);
    if (accessToken) check(accessToken, String);

    parameters = parameters || {};
    check(parameters, {
        limit: Match.Optional(Number),
        filter: Match.Optional(String)
    });

    this.unblock();
    var self = this;

    return {
        find: function() {
            var partup = Partups.guardedFind(self.userId, {_id: partupId}, {limit: 1}, accessToken).fetch().pop();
            if (!partup) return;

            return Updates.findForPartup(partup, parameters, self.userId);
        },
        children: updateChildren,
    };
});
