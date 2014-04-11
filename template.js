searchProgramBookmarklet = searchProgramBookmarklet || {};
searchProgramBookmarklet.template = '' +
	'<div id="psb" style="position:fixed;top:0;right:0;background:white;font:12px/1 arial;z-index:999999;">' +
		'<style>' +
			'#psb form { padding: 10px } ' +
			'#psb_search_results { margin: 0; } ' +
			'#psb input, #psb select { height:auto;border: 2px solid #E3E3E3; background: #F5F5F5; font-size: 1.07692em; padding: 0.42857em; margin-right: .5em } ' +
			'#psb #psb_search_results input { display: none;width:80% } ' +
			'#psb label { margin-right: .5em } ' +
			'#psb li { list-style: none; margin-bottom: .5em; padding: .5em; overflow: hidden; cursor:pointer; } ' +
			'#psb li img { vertical-align: middle } #psb li input { width: 100% } ' +
			'#psb-icon-search{ background:#1A86D6;float:left;width:40px;height:45px;margin-left:-40px;padding-top:5px }' +
			'#psb-icon-search span{ position: relative;display: block;float: left;margin: .625em;width: .75em;height: .75em;background: #1A86D6;border: .25em solid #fff; margin-left: .938em; border-radius:.625em; }' +
			'#psb-icon-search span:before{ content: "";position: absolute;width: .25em;  height: .875em;  margin: .5em 0 0 -.375em;  background: #fff; transform: rotate(45deg); }' +
		'</style>' +
		'<span id="psb-icon-search"><span></span></span>' +
		'<form>' +
			'<div>' +
				'<label>Instance </label>' +
				'<select id="psb_instance">' +
					'<option>es</option>' +
					'<option>en</option>' +
					'<option>fr</option>' +
					'<option>de</option>' +
					'<option>it</option>' +
					'<option>pl</option>' +
					'<option>br</option>' +
					'<option>nl</option>' +
					'<option>zh</option>' +
					'<option>jp</option>' +
				'</select>' +
				'<select id="psb_platform_id"></select>' +
				'<label>Search term</label>' +
				'<input type="text" id="psb_search_term"/>' +
			'</div>' +
		'</form>' +
		'<ul id="psb_search_results"></ul>' +
	'</div>';
