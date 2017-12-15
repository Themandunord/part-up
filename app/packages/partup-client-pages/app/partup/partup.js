Template.app_partup.onCreated(function () {
    const template = this;

    template.network = new ReactiveVar(undefined);
    template.partup = new ReactiveVar(undefined, (oldVal, newVal) => {
        template.network.set(newVal ? Networks.findOne(newVal.network_id) : undefined);
        if (newVal) {
            // this throws an error on chrome about a subscription
            // It's very important to keep this in order for the updates to keep working
            if (typeof newVal._id === 'string') {
                Partup.client.updates.firstUnseenUpdate(newVal._id).set();
            }
        }
        template.loading.partup.set(false);
    });

    template.loading = {
        partup: new ReactiveVar(true),
    };

    const sidebarCookie = Cookies.get('partup_sidebar_expanded');
    const sidebarState =
        sidebarCookie !== undefined
            ? sidebarCookie.toBool()
            : !Partup.client.isMobile.isTabletOrMobile();

    template.sidebarExpanded = new ReactiveVar(sidebarState, (oldVal, newVal) => {
        Cookies.set('partup_sidebar_expanded', newVal, { expires: Infinity });
    });

    window.addEventListener('orientationchange', () => {
        if (screen.width < screen.height) {
            template.sidebarExpanded.set(false);
        } else {
            template.sidebarExpanded.set(true);
        }
    });

    template.autorun(function () {
        const partupId = Template.currentData().partupId;
        const accessToken = Session.get('partup_access_token');

        Meteor.subscribe('partups.one', partupId, accessToken, {
            onReady() {
                const partup = Partups.findOne(partupId);
                if (partup) {
                    if (!partup.isViewableByUser(Meteor.userId(), Session.get('partup_access_token'))) {
                        return Router.pageNotFound('partup-closed');
                    }
                    return template.partup.set(partup);
                }
                
                return Router.pageNotFound('partup');
            },
        });
    });

    template.subscribe('updates.from_partup', template.data.partupId);
    template.subscribe('board.for_partup_id', template.data.partupId);
    template.subscribe('activities.from_partup', template.data.partupId);
});

Template.app_partup.helpers({
    network() {
        return Template.instance().network.get();
    },
    partup() {
        return Template.instance().partup.get();
    },
    partupLoaded() {
        return !Template.instance().loading.partup.get();
    },
    sidebarExpanded() {
        return Template.instance().sidebarExpanded.get();
    },
    scrollHorizontal() {
        return Router.current().route.getName() === 'partup-activities' && (Template.instance().partup.get() && Template.instance().partup.get().board_view);
    },
});

Template.app_partup.events({
    'click [data-toggle-sidebar]': (event, templateInstance) => {
        event.preventDefault();
        templateInstance.sidebarExpanded.set(!templateInstance.sidebarExpanded.curValue);
    },
});
