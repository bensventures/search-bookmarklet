( function ()
{
	var searchProgramBookmarklet = window.searchProgramBookmarklet || {},
		$psb_search_results,
		$psb_platform_id;

	searchProgramBookmarklet.app = {
		getLink : function ( e )
		{
			$psb_search_results.find( 'input' ).hide();
			$psb_search_results.find( 'span' ).show();

			jQuery( e.currentTarget ).find( 'span' ).hide();
			jQuery( e.currentTarget ).find( 'input' ).show().select();
		},

		selectInstance : function () {
			var savedInstance = localStorage.getItem( 'psb_instance_id' );

			if ( savedInstance )
			{
				jQuery( '#psb_instance' ).val( savedInstance );
			}
		},

		populateSections : function ( callback )
		{
			var urlSections = 'http://api.softonic.com/<instance>/sections.json?section_id=1&key=' + searchProgramBookmarklet.ApiKey;

			urlSections = urlSections.replace( '<instance>', jQuery( '#psb_instance' ).val() );

			$psb_platform_id.html( '' );

			jQuery.get( urlSections, function ( data )
			{
				jQuery.each( data._embedded.section, function ( index, platform )
				{
					$psb_platform_id.append( '<option value="' + platform.section_id + '">' + platform.short_name + '</option>' );
				} );

				if ( callback )
				{
					callback();
				}
			} );
		},

		searchPrograms : function ()
		{
			var search_term = jQuery( '#psb_search_term' ).val();

			if ( search_term.length )
			{
				var urlSearch = 'http://api.softonic.com/<instance>/programs/search.json?query=<query>&platform_id=<platform_id>&key=' + searchProgramBookmarklet.ApiKey;
				urlSearch = urlSearch.replace( '<instance>', jQuery( '#psb_instance' ).val() );
				urlSearch = urlSearch.replace( '<platform_id>', $psb_platform_id.val() );
				urlSearch = urlSearch.replace( '<query>', search_term );

				jQuery.get( urlSearch, function ( data )
				{
					$psb_search_results.html( '' );

					if ( data._embedded )
					{
						jQuery.each( data._embedded.program, function ( index, program )
						{

							$psb_search_results.append( '<li class="program-item"><img width="20px" class="thumb" src="' + program.thumbnail + '"/><input type="text" readonly value="'+ program.url +'"/><span>' + program.title + ' - ' + program.version + '</span></li>' )

						} )
					}
					else
					{
						$psb_search_results.append( '<li>No results</li>' );
					}
				} );
			}
			else
			{
				$psb_search_results.html( '' );
			}

			return false;
		},

		build : function ()
		{
			var self = this,
				timeOutRef,
				timeOutHide;

			jQuery( document.body ).append( searchProgramBookmarklet.template );

			$psb_search_results = jQuery( '#psb_search_results' );
			$psb_platform_id = jQuery( '#psb_platform_id' );

			self.selectInstance();

			self.populateSections();

			jQuery( '#psb_instance' ).change( function ( e )
			{
				localStorage.setItem( 'psb_instance_id', this.value );

				self.populateSections( function ()
				{
					self.searchPrograms();
				} );
			} );

			$psb_search_results.delegate( 'li.program-item', 'click', self.getLink );

			jQuery( '#psb_search_term' ).keyup( function ( e )
			{
				// don't hammer the api
				clearTimeout( timeOutRef );

				timeOutRef = setTimeout( function() {
					self.searchPrograms();
				}, 300 );
			} );

			$psb_platform_id.change( self.searchPrograms );

			jQuery( '#psb form' ).submit( function (){
				return false;
			} );

			jQuery( '#psb' ).hover( function ( e ){
				//mouse in
				clearTimeout( timeOutHide );

				jQuery( '#psb' ).css( 'right', '0' );
			}, function (){
				//mouse out
				timeOutHide = setTimeout( function (){
					jQuery( '#psb' ).animate( { right :  -( jQuery( '#psb' ).width() ) } );
				}, 1000 );
			} );
		},

		startBookmarklet : function ()
		{
			var self = this;

			if ( !searchProgramBookmarklet.template )
			{
				//jQuery.getScript( 'https://raw.githubusercontent.com/bensventures/search-bookmarklet/master/template.js', function ( data )
				jQuery.getScript( 'template.js', function ( data )
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
