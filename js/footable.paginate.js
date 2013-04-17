(function($, w, undefined) {
	if (w.footable == undefined || w.footable == null)
		throw new Error('Please check and make sure footable.js is included in the page and is loaded prior to this script.');

	var defaults = {
		paginate: true,
		increment: 10,
		navigation: '.footable-nav'
	}

	function Paginate() {
		var p = this;
		p.name = 'Footable Paginate';
		p.pages = [];
		p.currentPage = 0;
		p.init = function(ft) {
			if(ft.options.paginate == true) {
				$(ft.table).bind({
          			'footable_initialized': function(e) {
          				var $table = $(e.ft.table);
          				p.tbody = $table.find('> tbody');
          				p.navelement = $table.data('nav') || e.ft.options.navigation;
          				p.rows(ft, true);
          				p.paginate(ft);
          				p.clear(ft);
      					p.fillPage(ft, p.currentPage);
						$('.footable-sortable').bind('click', function(e){
							p.fillPage(ft, p.currentPage);
						});
      				},
      				'footable_filtered': function(e) {
      					p.paginate(ft);
      					p.clear(ft);
      					p.fillPage(ft, p.currentPage);
      				}
  				});
			}
		};

		p.paginate = function(ft){
			p.pages = [];
			p.currentPage = 0;
			var pageCount = 1;
			var rowCount = pageCount * ft.options.increment;
			var page = [];
			var lastPage = [];
			$.each(p.rows(ft), function(i, row) {
				page.push(row);
				if (i === rowCount - 1){
					p.pages.push(page);
					pageCount++;
					rowCount = pageCount * ft.options.increment;
					page = [];
				} else if (i >= p.rows(ft).length - (p.rows(ft).length % ft.options.increment)) {
					lastPage.push(row);
				}
			});
			p.pages.push(lastPage);
			p.navigate(ft);
		};

		p.rows = function(ft, init) {
			var rows = [];
			var i = 1;
			p.tbody.find('> tr').each(function() {
				if ($(this).is(":visible")) {
					if(init) $(this).attr('data-order', i);
					rows.push(this);
					i++;
				}
			});
			return rows;
		};

		p.navigate = function(ft) {
			$(p.navelement).empty();
			if (p.pages.length > 0) {
				var element = $(p.navelement);
				element.append('<li class="arrow"><a href="#prev">&laquo;</a></li>');
				$.each(p.pages, function(i, page){
					if (page.length > 0) {
						element.append('<li class="page"><a href="#">' + (i + 1) + '</a></li>');
					}
				});
				element.append('<li class="arrow"><a href="#next">&raquo;</a></li>');
			}
			$(p.navelement + ' a').bind('click', function(e) {
				e.preventDefault();
				if ($(this).attr('href') == '#prev') {
					if (p.currentPage > 0){
						p.clear(ft);
						p.fillPage(ft, p.currentPage - 1);
					}
				} else if ($(this).attr('href') == '#next') {
					if (p.currentPage < p.pages.length - 1){
						p.clear(ft);
						p.fillPage(ft, p.currentPage + 1);

					}
				} else {
					if (p.currentPage != ($(this).html() - 1)) {
						p.clear(ft);
						p.fillPage(ft, $(this).html() - 1);
					}
				}
				$(p.navelement + ' li').removeClass('current');
				$(p.navelement + ' li.page:eq(' + p.currentPage + ')').addClass('current');
			});
			$(p.navelement + ' li.page:eq(' + p.currentPage + ')').addClass('current');
		};

		p.clear = function(ft) {
			p.tbody.find('> tr').each(function() {
				$(this).hide();
			});
		};

		p.fillPage = function(ft, pageNumber) {
			p.currentPage = pageNumber;
			$.each(p.pages[pageNumber], function(i, row) {
				p.tbody.find('> tr[data-order="' + $(row).data('order') + '"]').show();
			});
		};
	};

	w.footable.plugins.register(new Paginate(), defaults);

})(jQuery, window);