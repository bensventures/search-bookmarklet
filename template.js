searchProgramBookmarklet = searchProgramBookmarklet || {};
searchProgramBookmarklet.template = '<div id="psb" style="position:fixed;top:0;right:0;padding:10px;background:white;font:12px/1 arial;z-index:999999;"> <style>#psb input, #psb select { border: 2px solid #E3E3E3; background: #F5F5F5; font-size: 1.07692em; padding: 0.42857em; margin-right: .5em } #psb label { margin-right: .5em } #psb li { list-style: none; margin-bottom: .5em; padding: .5em; overflow: hidden } #psb li img { vertical-align: middle } #psb li input { width: 100% } </style> <form> <div> <label>Instance </label> <select id="instance"> <option>es</option> <option>en</option> <option>fr</option> <option>de</option> <option>it</option> <option>pl</option> <option>br</option> <option>nl</option> <option>zh</option> <option>jp</option> </select> <select id="platform_id"></select> <label>Search term</label> <input type="text" id="search_term"/> </div> </form> <ul id="search_results"></ul> </div>';
