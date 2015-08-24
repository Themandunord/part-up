var SeoRouter = Picker.filter(function(request, response) {
    // TODO: Add more checks to see if we should render a snippet

    var botAgents = [
        /^facebookexternalhit/i, // Facebook
        /^linkedinbot/i, // LinkedIn
        /^twitterbot/i, // Twitter
        /^slackbot-linkexpanding/i // Slack
    ];

    var userAgent = request.headers['user-agent'];
    var botIsUsed = false;

    botAgents.forEach(function(botAgent) {
        if (botAgent.test(userAgent)) botIsUsed = true;
    });

    var escapedFragmentIsUsed = /_escaped_fragment_/.test(request.url);

    return escapedFragmentIsUsed || botIsUsed;
});

SeoRouter.route('/partups/:slug', function(params, request, response) {
    var slug = params.slug;
    var partupId = slug.split('-').pop();
    var partup = Partups.findOne(partupId);

    if (!partup) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(partup.image);

    SSR.compileTemplate('seo_partup', Assets.getText('private/templates/partup.html'));

    Template.seo_partup.helpers({
        getPartupUrl: function() {
            return Meteor.absoluteUrl() + 'partups/' + partup.slug;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/logo.png';

            var url = image.url().substr(1);

            return Meteor.absoluteUrl() + encodeURIComponent(url).replace(/%2F/g, '/');
        }
    });

    var html = SSR.render('seo_partup', partup);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});

SeoRouter.route('/:slug', function(params, request, response) {
    var slug = params.slug;
    var network = Networks.findOne({slug: slug});

    if (!network) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(network.image);

    SSR.compileTemplate('seo_network', Assets.getText('private/templates/network.html'));

    Template.seo_network.helpers({
        getNetworkUrl: function() {
            return Meteor.absoluteUrl() + network.slug;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/logo.png';

            var url = image.url().substr(1);

            return Meteor.absoluteUrl() + encodeURIComponent(url).replace(/%2F/g, '/');
        }
    });

    var html = SSR.render('seo_network', network);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});
