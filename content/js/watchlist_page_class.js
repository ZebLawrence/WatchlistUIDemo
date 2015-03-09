$(function(){ 

	watchlistUI = {};

	watchlistUI.init = function (){
		this.cacheElements();
		this.writeTextInApps();		
		this.bindEvents();

		console.log('init class');

	};

	var currentFilterOn = 'nothing';

	watchlistUI.cacheElements = function() {
		var _self = this;
		this.$container = $('.container');
		this.$apps = $('.app');
		this.$allButtons = $('.filters button');
		this.filterButtons = $('button.filter');
		this.sorterButtons = $('button.sorter');
		console.log('cache elements');
		this.packeryOptions = {
			itemSelector: '.app',
			columnWidth: 280,
			gutter: 10,
			rowHeight: 280
			//stamp: ".pinned",
		}

		this.dragOptions = {
			opacity: .7,
			zIndex: 1000,
			// drag: function( event, ui ) {
			// 	_self.$container.packery();
			// },
			// stop: function( event, ui ) {
			// 	_self.$container.packery();
			// }
		}

		this.isotopeOptions = {
			itemSelector: '.app',
			layoutMode: 'masonry',
			getSortData: {
				name: '[data-name]',
				category: '[data-category]',
				thing: '[data-thing]',
				number: '[data-number] parseFloat',
			},
			masonry: {
				columnWidth: 280,
				gutter: 10,
				rowHeight: 280
			}
		}
	};
	watchlistUI.bindEvents = function() {
		var _self = this;
		//init packery
		this.$container.packery(_self.packeryOptions);
		// init dragable and tell packery it is dragable.
		this.$apps.draggable(_self.dragOptions);
		//tell packery about the dragable parts
		this.$container.packery('bindUIDraggableEvents', _self.$apps);
		//init isotope
		this.$container.isotope(_self.isotopeOptions);
		//bind drag complete function to renumber apps
		this.$container.packery( 'on', 'dragItemPositioned', function( pckryInstance, draggedItem ) {

			var items = pckryInstance.items;
			$(items).each(function(index,item){
				var newIndex = index + 1;
				var app = item.element;
				//set new
				$(app).attr('data-number',newIndex);
				var $numberElement = $(app).find('.number');
				$numberElement.text('At position: ' + newIndex)
			});
			//tell isotope to make a new sort dictionary
			_self.$container.isotope('updateSortData');
		});

		this.$container.on('click', function(e){
			e.stopPropagation();
			console.log('the container has been clicked');
			console.log(this);
		});

		this.$apps.on('click', function(e){
			//e.stopPropagation();
			console.log('This app has been clicked');
			console.log(this);
		});

		this.filterButtons.on( 'click', function() {
			var filterOn = $( this ).data('filteron');
			var filterType = $( this ).data('filter');
			//set global current filter on
			//_self.currentFilterOn = filterOn;
			// use filterFn if matches value
			//filterOn = _self.filterFunctions[ filterType ];
			_self.$container.isotope({ filter: filterOn });
			_self.updateButtonState(this);
		});

		this.sorterButtons.on('click', function(){
			var direction = $(this).data('direction') === "ASC";
			var sortValue = $(this).data('sortby');
			_self.$container.isotope({ sortBy: sortValue, sortAscending:direction });
			_self.updateButtonState(this);
		});
	};

	watchlistUI.updateButtonState = function(button){	
		var $button = $(button);
		var others = $button.siblings('button');
		others.removeClass('active');
		if ($button.hasClass('active')) {
			$button.removeClass('active');
		}
		else{
			$button.addClass('active');
		};
	};

	watchlistUI.filterFunctions = {
		typeFilter: function(){
			var itemType = $(this).data('category');
			var filterOnThis = currentFilterOn;
			console.log('trying to filter by type');
			console.log('Filter for: ' + filterOnThis);
			console.log('The elements found value: ' + itemType);
			console.log(this);
			//return filterOnThis === itemType;
		},
		colorFilter: function(filterOnThis){
			var itemType = $(this).data('thing');
			console.log('trying to filter by color');
			console.log(this);
			//return filterOnThis === itemType;
		}
	}

	watchlistUI.sortFunctions = {
		numberSorter: function(){
			console.log('trying to sort by color');
			console.log(this);
		}
	}

	watchlistUI.writeTextInApps = function (){
		var _self = this;
		this.$apps.each(function(index,app){
			var $app = $(app);
			var name = $app.data('name');
			var category = $app.data('category');
			var thing = $app.data('thing');
			var number = $app.data('number');

			$app.addClass(category).addClass(thing).addClass(number);
			var header = $('<h1 class="name">'+ name + '</h1>');
			var categorySpan = $('<h3 class="category">' + category + '</h3>');
			var thingSpan = $('<h3 class="thing">' + thing + '</h3>');
			var numberSpan = $('<h3 class="number">At position: ' + number + '</h3>');

			$app.append(header);
			$app.append(categorySpan);
			$app.append(thingSpan);
			$app.append(numberSpan);
		});
	};


	watchlistUI.init();
	watchlistUI.$container.packery();
});