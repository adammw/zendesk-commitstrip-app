(function() {

  return {
    defaultState: 'loading',

    requests: {
      randomComic: {
        url: 'http://www.commitstrip.com/en/feed/?orderby=rand',
        dataType: 'xml',
        cache: false
      }
    },

    events: {
      'app.created': 'renderNextComic',
      'click button[data-role="reload-comic"]': 'renderNextComic'
    },

    comics: [],

    loadComics: function() {
      var $ = this.$;
      this.ajax('randomComic').done(function(data) {
        var rssItems = this.makeArray($(data).find('item'));
        this.comics = rssItems.map(function(item) {
          return {
            title: $(item).find('title').text(),
            content: $(item).find('encoded').text(),
            link: $(item).find('link').text()
          };
        });
        this.renderNextComic();
      }.bind(this));
    },

    renderNextComic: function() {
      var comic = this.comics.shift();
      if (!comic) {
        this.switchTo('loading');
        this.loadComics();
        return;
      }
      this.switchTo('comic', comic);
      this.$('.content img').wrap('<a href="' + comic.link + '" target="_blank"></a>');
    },

    makeArray: function(arr) {
      // Workaround for lack of $.makeArray
      // Ref: https://github.com/zendesk/zendesk_app_framework/pull/198
      
      var class2type = {}, toString = {}.toString, push = [].push;
      "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
      });

      var jQuery = {
        isWindow: function() {
          return false;
        },
        type: function(obj) {
          if ( obj === null ) {
            return obj + "";
          }
          // Support: Android < 4.0, iOS < 6 (functionish RegExp)
          return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call(obj) ] || "object" :
            typeof obj;
        },
        isArraylike: function(obj) {
          var length = obj.length,
              type = jQuery.type( obj );

          if ( type === "function" || jQuery.isWindow( obj ) ) {
            return false;
          }

          if ( obj.nodeType === 1 && length ) {
            return true;
          }

          return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
        },
        merge: function(first, second) {
          var len = +second.length,
              j = 0,
              i = first.length;

          for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
          }

          first.length = i;

          return first;
        },
        makeArray: function(arr) {
          var ret = [];

          if ( arr !== null ) {
            if ( jQuery.isArraylike( Object(arr) ) ) {
              jQuery.merge( ret,
                typeof arr === "string" ?
                [ arr ] : arr
              );
            } else {
              push.call( ret, arr );
            }
          }

          return ret;
        }
      };

      return jQuery.makeArray(arr);
    }
  };

}());
