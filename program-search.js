( function ()
{
	var searchProgramBookmarklet = window.searchProgramBookmarklet || {},
		$psb_search_results,
		$psb_platform_id;

	searchProgramBookmarklet.app = {

		toggleLink : function ()
		{
			$psb_search_results.find( 'input' ).hide();
			$psb_search_results.find( '.toggleLink' ).show();

			$( this ).prev().toggle().select();
			$( this ).toggle();
		},

		getProgramInfo : function ()
		{
			var articleSearch = 'http://api.softonic.com/<instance>/programs/<program_id>/articles.json?key=' + searchProgramBookmarklet.ApiKey,
				parentItem = this.parentNode.parentNode.parentNode,
				$editorial = $( parentItem ).find( '.result-editorial' ),
				$editorialResults = $editorial.find( 'ul' );

			articleSearch = articleSearch.replace( '<instance>', jQuery( '#psb_instance' ).val() );
			articleSearch = articleSearch.replace( '<program_id>', parentItem.getAttribute( 'data-program-id' ) );

			if( !$editorial.is( ':visible' ) )
			{
				jQuery.get( articleSearch, function ( data )
				{
					if ( data.count > 0 )
					{
						jQuery.each( data._embedded.article, function ( index, article )
						{
							$editorialResults.append( '<li class="article-item">' +
															'<input type="text" readonly value="'+ article.url +'"/>' +
															'<span class="toggleLink">' + article.title + '</span>' +
															'<div class="buttons editorial-buttons"><span class="get-link"></span></div>' +
														'</li>' )
						} );
					}
					else
					{
						$editorialResults.append( '<li class="article-item">No related articles</li>' );
					}

					$editorial.show();
				} );
			}
			else
			{
				$editorial.hide();
				$editorialResults.html( '' );
			}
		},

		selectInstance : function () {
			var savedInstance = localStorage.getItem( 'psb_instance_id' );

			if ( savedInstance )
			{
				jQuery( '#psb_instance' ).val( savedInstance );
			}
		},

		/**
		 * Create the options in the select for categories
		 * @param callback
		 */
		populateSections : function ( callback )
		{
			var urlSections = 'http://api.softonic.com/<instance>/sections.json?section_id=1&key=' + searchProgramBookmarklet.ApiKey,
				savedPlatform = localStorage.getItem( 'psb_platform_id' );

			urlSections = urlSections.replace( '<instance>', jQuery( '#psb_instance' ).val() );

			$psb_platform_id.html( '' );

			jQuery.get( urlSections, function ( data )
			{
				jQuery.each( data._embedded.section, function ( index, platform )
				{
					$psb_platform_id.append( '<option value="' + platform.section_id + '">' + platform.short_name + '</option>' );
				} );

				if ( savedPlatform )
				{
					$psb_platform_id.val( savedPlatform );
				}

				if ( callback )
				{
					callback();
				}
			} );
		},

		/**
		 * Start the search of a program through the API
		 * @returns {boolean}
		 */
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

							$psb_search_results.append( '<li class="program-item" data-program-id="'+ program.program_id +'">' +
															'<div>' +
																'<img width="35px" class="thumb" src="' + program.thumbnail + '"/>' +
																'<input type="text" readonly value="'+ program.url +'"/>' +
																'<span class="toggleLink">' + program.title + ' - ' + program.version + '</span>' +
																'<div class="buttons"><span class="get-link"></span><span class="handle">+</span></div>' +
															'</div>' +
															'<div class="result-editorial" >' +
																'<h4>Related articles</h4>' +
																'<ul></ul>' +
															'</div>' +
														'</li>' )
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

		/**
		 * Add all the event on the dom elements
		 */
		attachEvents : function ()
		{
			var self = this,
				timeOutRef,
				timeOutHide;

			$psb_search_results.delegate( 'li.program-item .handle', 'click', self.getProgramInfo );
			$psb_search_results.delegate( '.toggleLink', 'click', self.toggleLink );
			// make it look like we are calling from the togglelink element
			$psb_search_results.delegate( '.get-link', 'click', function ()
			{
				self.toggleLink.call( $( this.parentNode.parentNode ).find( '.toggleLink' )[0] );
			} );

			$psb_platform_id.change( function (){
				localStorage.setItem( 'psb_platform_id', this.value );
				self.searchPrograms()
			});

			jQuery( '#psb_instance' ).change( function ()
			{
				localStorage.setItem( 'psb_instance_id', this.value );

				self.populateSections( function ()
				{
					self.searchPrograms();
				} );
			} );

			jQuery( '#psb_search_term' ).keyup( function ()
			{
				// don't hammer the api
				clearTimeout( timeOutRef );

				timeOutRef = setTimeout( function() {
					self.searchPrograms();
				}, 300 );
			} );

			jQuery( '#psb form' ).submit( function (){
				return false;
			} );

			// Show / Hide the container
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

		build : function ()
		{
			jQuery( document.body ).append( searchProgramBookmarklet.template );

			$psb_search_results = jQuery( '#psb_search_results' );
			$psb_platform_id = jQuery( '#psb_platform_id' );

			this.selectInstance();

			this.populateSections();

			this.attachEvents();
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
