var Flickr = Npm.require('node-flickr');
var keys = {
    'api_key': process.env.FLICKR_API_KEY,
    'secret': process.env.FLICKR_SECRET_KEY
};

flickr = new Flickr(keys);

Meteor.methods({
    /**
     * Return Flickr images based on tag relevancy
     *
     * @param {string[]} tags
     * @param {number} count Number of results to return
     * @param {string[]} fallbackTags Tags
     */
    'partups.services.flickr.search': function(tags, count, fallbackTags) {
        this.unblock();

        if (!tags || !tags.length || !tags[0] || !tags[0].length) {
            var error = 'No tags given';
            Log.error(error);
            throw new Meteor.Error(400, error);
        }

        if (!flickr.apiKey) {
            var error = 'Error while getting photos from Flickr: No API Key defined';
            Log.error(error);
            throw new Meteor.Error(400, error);
        }

        // Set default values
        count = count || 5;
        fallbackTags = fallbackTags || ['nature'];

        var lookupTags = Meteor.wrapAsync(function(tags, count, callback) {
            var searchByTags = function(tags, count, photos) {
                var searchableTags = tags.join(' ');

                flickr.get('photos.search', {
                    'text': encodeURIComponent(searchableTags), // Search for text instead of tags (huge difference)
                    'extras': 'url_l', // Only search for large images
                    'per_page': count * 5, // Get more results then needed because we will be filtering them
                    'sort': 'relevance',
                    'license': [9, 4], // CC0 & Attribution License
                    'content_type': 1 // Photos only
                }, function(result, error) {
                    if (error) {
                        Log.error(error);
                        throw new Meteor.Error(400, 'Error while getting photos from Flickr: ' + error);
                    }

                    result.photos.photo.forEach(function(photo) {
                        if (!photo.url_l || (photo.height_l < photo.width_l)) return; // Only landscape photos
                        photos.push({
                            'imageUrl': photo.url_l,
                            'authorUrl': 'https://www.flickr.com/people/' + photo.owner
                        });
                    });

                    // We don't want all photos to be from 1 Flickr user/album
                    photos = lodash.unique(photos, function(item, key, a) {
                        return item.authorUrl;
                    });

                    if (photos.length < count) {
                        tags.pop();

                        if (tags.length == 0) {
                            // Fallback to provided default tags
                            return searchByTags(fallbackTags, count, photos);
                        }

                        return searchByTags(tags, count, photos);
                    }

                    return callback(null, photos.slice(0, count));
                });
            };

            searchByTags(tags, count, []);
        });

        return lookupTags(tags, count);
    }
});
