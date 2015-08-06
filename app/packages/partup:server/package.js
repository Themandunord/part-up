Package.describe({
    name: 'partup:server',
    version: '0.0.1',
    summary: '',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use('check');

    api.use([
        'accounts-base',
        'stevezhu:lodash',
        'cfs:standard-packages',
        'cfs:graphicsmagick',
        'email',
        'http',
        'iron:router',
        'mongo',
        'partup:lib',
        'percolate:synced-cron',
        'reywood:publish-composite',
        'service-configuration',
        'splendido:accounts-meld',
        'percolate:migrations',
        'tap:i18n'
    ], ['server']);

    api.addFiles([
        'private/emails/InviteUser.html',
        'private/emails/InviteUserToActivity.en.html',
        'private/emails/InviteUserToActivity.nl.html',
        'private/emails/InviteUserToNetwork.en.html',
        'private/emails/InviteUserToNetwork.nl.html',
        'private/emails/UserMentionedInPartup.en.html',
        'private/emails/UserMentionedInPartup.nl.html'
    ], ['server'], {isAsset: true});

    api.addFiles([
        'logger.js',
        'namespace.js',
        'bootstrap.js',
        'accounts.js',
        'helpers/collection.js',
        'event.js',
        'collection_hooks.js',
        'factories/updates_factory.js',
        'services/notifications_service.js',
        'services/system_messages_service.js',
        'services/images_service.js',
        'services/google_service.js',
        'services/matching_service.js',
        'services/slugify_service.js',
        'services/participation_calculator_service.js',
        'services/partup_progress_calculator_service.js',
        'migrations.js',
        'event_handlers/any_handler.js',
        'event_handlers/partups/partups_handler.js',
        'event_handlers/partups/partups_supporters_handler.js',
        'event_handlers/partups/partups_uppers_handler.js',
        'event_handlers/partups/partups_invited_handler.js',
        'event_handlers/partups/partups_name_changed_handler.js',
        'event_handlers/partups/partups_description_changed_handler.js',
        'event_handlers/partups/partups_budget_changed_handler.js',
        'event_handlers/partups/partups_location_changed_handler.js',
        'event_handlers/partups/partups_tags_changed_handler.js',
        'event_handlers/partups/partups_end_date_changed_handler.js',
        'event_handlers/partups/partups_image_changed_handler.js',
        'event_handlers/users/users_settings_handler.js',
        'event_handlers/activities/activities_handler.js',
        'event_handlers/contributions/contributions_handler.js',
        'event_handlers/ratings/ratings_handler.js',
        'event_handlers/updates/updates_handler.js',
        'event_handlers/updates/updates_comments_handler.js',
        'event_handlers/updates/updates_messages_handler.js',
        'event_handlers/networks/networks_handler.js',
        'fixtures/users.js',
        'fixtures/partups.js',
        'fixtures/updates.js',
        'fixtures/activities.js',
        'fixtures/contributions.js',
        'fixtures/ratings.js',
        'fixtures/tags.js',
        'fixtures/notifications.js',
        'fixtures/networks.js',
        'fixtures/invites.js',
        'fixtures/images.js',
        'publications/activities.js',
        'publications/partups.js',
        'publications/images.js',
        'publications/updates.js',
        'publications/users.js',
        'publications/networks.js',
        'methods/updates/updates_comments_methods.js',
        'methods/updates/updates_messages_methods.js',
        'methods/activities/activities_methods.js',
        'methods/contributions/contributions_methods.js',
        'methods/ratings/ratings_methods.js',
        'methods/partups/partups_methods.js',
        'methods/partups/partups_analytics_methods.js',
        'methods/partups/partups_supporters_methods.js',
        'methods/users/users_methods.js',
        'methods/services/flickr_methods.js',
        'methods/services/splashbase_methods.js',
        'methods/services/google_methods.js',
        'methods/settings/settings_methods.js',
        'methods/images/images_methods.js',
        'methods/networks/networks_methods.js',
        'methods/tags/tags_methods.js',
        'methods/notifications/notifications_methods.js',
        'cron/reset_clicks_per_hour.js',
        'cron/calculate_partup_participation_score_for_users.js',
        'cron/calculate_partup_progress_score_for_partups.js',
        'cron/send_ratings_reminder_notification.js',
        'package-tap.i18n',
        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], ['server']);

    api.addFiles([
        'methods/latencycompensation.js',
    ], ['client']);

    api.export('Log', ['server']);
});

Npm.depends({
    'eventemitter2': '0.4.14',
    'colors': '1.0.3',
    'deeper': '1.0.2',
    'winston': '0.9.0',
    'pluralize': '1.1.2',
    'node-flickr': '0.0.3',
    'slug': '0.9.1',
    'debug': '2.2.0'
});
