var AppRouter = Backbone.Router.extend({

    routes: { // leto-marker-main-route-list
        'adminpanel': 'adminpanel',
        ""                      : "home",
        "about"                 : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    // leto-marker-router-functions
	adminpanel: function (id) {
		if (!this.adminpanelView) {
			this.adminpanelView = new adminpanelView();
		}
		$('#content').html(this.adminpanelView.el);
		this.headerView.selectMenuItem('home-menu');
	},

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

var templateFiles = [ // leto-marker-html-template-list
    'adminpanelView',
    'HomeView', 
    'HeaderView', 
    'AboutView',
];

utils.loadTemplate( templateFiles, function() {
    app = new AppRouter();
    Backbone.history.start();
});
