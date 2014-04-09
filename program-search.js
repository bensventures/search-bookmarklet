( function ()
{
	var searchProgramBookmarklet = window.searchProgramBookmarklet || {};

	searchProgramBookmarklet.app = {
		getLink : function ( e )
		{
			var selectedUrl = e.currentTarget.getAttribute( 'data-url' ),
				$input = jQuery( '<input type="text" value="' + selectedUrl + '"/>' );

			jQuery( e.currentTarget ).html( $input );
			$input.select();
		},

		populateSections : function ( callback )
		{
			var urlSections = 'http://api.softonic.com/<instance>/sections.json?section_id=1&key=' + searchProgramBookmarklet.ApiKey;

			urlSections = urlSections.replace( '<instance>', jQuery( '#instance' ).val() );

			jQuery( '#platform_id' ).html( '' );

			jQuery.get( urlSections, function ( data )
			{
				jQuery.each( data._embedded.section, function ( index, platform )
				{
					jQuery( '#platform_id' ).append( '<option value="' + platform.section_id + '">' + platform.short_name + '</option>' );
				} );

				if ( callback )
				{
					callback();
				}
			} );
		},

		searchPrograms : function ( e )
		{
			var search_term = jQuery( '#search_term' ).val();

			if ( search_term.length )
			{
				var urlSearch = 'http://api.softonic.com/<instance>/programs/search.json?query=<query>&platform_id=<platform_id>&key=' + searchProgramBookmarklet.ApiKey;
				urlSearch = urlSearch.replace( '<instance>', jQuery( '#instance' ).val() );
				urlSearch = urlSearch.replace( '<platform_id>', jQuery( '#platform_id' ).val() );
				urlSearch = urlSearch.replace( '<query>', search_term );

				jQuery.get( urlSearch, function ( data )
				{
					jQuery( '#search_results' ).html( '' );

					if( data._embedded )
					{
						jQuery.each( data._embedded.program, function ( index, program )
						{

							jQuery( '#search_results' ).append( '<li class="program-item" data-url="' + program.url + '"><img width="20px" class="thumb" src="' + program.thumbnail + '"/>' + program.title + ' - ' + program.version + '</li>' )

						} )
					}
					else
					{
						jQuery( '#search_results' ).append( '<li>No results</li>' );
					}
				} );
			}
			else
			{
				jQuery( '#search_results' ).html( '' );
			}

			return false;
		},

		build : function ()
		{
			var self = this;

			jQuery( document.body ).append( searchProgramBookmarklet.template );

			self.populateSections();

			jQuery( '#instance' ).change( function ( e )
			{
				self.populateSections( function ()
				{
					self.searchPrograms( e );
				} );
			} );

			jQuery( '#search_results' ).delegate( 'li.program-item', 'click', self.getLink );

			jQuery( '#search_term' ).keyup( self.searchPrograms );
			jQuery( '#platform_id' ).change( self.searchPrograms );
		},

		startBookmarklet : function ()
		{
			var self = this;

			if ( !searchProgramBookmarklet.template )
			{
				jQuery.getScript( 'https://raw.githubusercontent.com/bensventures/search-bookmarklet/master/template.js', function ( data )
				{
					self.build();
				} );
			}
			else
			{
				self.build();
			}
		}
	}
}() );
