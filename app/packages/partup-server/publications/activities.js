/**
 * Publish all activities in a partup
 *
 *
 * @param {String} partupId
 * @param {String} accessToken
 */
Meteor.publishComposite('activities.from_partup', function(partupId, accessToken) {
    check(partupId, String);
    if (accessToken) check(accessToken, String);

    this.unblock();

    return {
        find: function() {
            var partup = Partups.guardedFind(this.userId, {_id: partupId}, {limit: 1}, accessToken).fetch().pop();
            if (!partup) return;

            return Activities.findForPartup(partup);
        },
        children: [
            {find: Updates.findForActivity},
            {find: Contributions.findForActivity, children: [
                {
                    find: Meteor.users.findForContribution, children: [
                        {find: Images.findForUser}
                    ]
                },
                {find: Ratings.findForContribution, children: [
                    {find: Meteor.users.findForRating, children: [
                        {find: Images.findForUser}
                    ]},
                ]}
            ]},
            { find: Images.findForActivity },
            { find: Files.findForActivity },

        ]
    };
});

