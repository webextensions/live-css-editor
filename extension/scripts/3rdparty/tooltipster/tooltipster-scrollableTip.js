/**
 * tooltipster-scrollableTip v1.0.0
 * https://github.com/louisameline/tooltipster-scrollableTip/
 * Developed by Louis Ameline
 * MIT license
 */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module unless amdModuleId is set
		define(['tooltipster'], function ($) {
			return (factory($));
		});
	}
	else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('tooltipster'));
	}
	else {
		factory(jQuery);
	}
}(this, function($) {
	
	$.tooltipster._plugin({
		name: 'laa.scrollableTip',
		instance: {
			__init: function(instance) {
				
				var self = this;
				
				// list of instance variables
				
				self.__instance = instance;
				self.__maxSize;
				self.__namespace = 'tooltipster-scrollableTip-'+ Math.round(Math.random()*1000000);
				
				// prevent the tests on the document to save time
				self.__instance._on('positionTest.'+ self.__namespace, function(event) {
					if (event.container == 'document') {
						event.takeTest(false);
					}
				});
				
				// select the scenario that will give a maximum area to the tooltip
				self.__instance._on('positionTested.'+ self.__namespace, function(event) {
					
					var whole = false;
					
					$.each(event.results, function(i, result) {
						
						// if the tooltip completely fits on screen on one of the
						// sides, there is nothing to do
						if (result.whole) {
							whole = true;
							return false;
						}
					});
					
					if (!whole) {
						
						var maxSizes = [],
							biggestArea,
							index;
						
						// find out on which side the tooltip would have the biggest area after we
						// restrain its size to the size of the viewport
						$.each(event.results, function(i, result) {
							
							// the available height may be greater than the viewport height if the
							// origin is off screen at the top or bottom
							maxSizes[i] = {
								height: Math.min(
									event.helper.geo.available.window[result.side].height - result.distance.vertical,
									event.helper.geo.window.size.height
								),
								width: Math.min(
									event.helper.geo.available.window[result.side].width - result.distance.horizontal,
									event.helper.geo.window.size.width
								)
							};
							
							// this dismisses natural size scenarios where the tooltip is too big
							// (the constrained scenario for that side will used instead), but not the
							// natural size scenarios where it's narrower than the available space (in
							// that cases there is no constrained test for that side because it wasn't
							// needed)
							if (result.size.width <= maxSizes[i].width) {
								
								var height = Math.min(result.size.height, maxSizes[i].height),
									width = Math.min(result.size.width, maxSizes[i].width),
									area = height * width;
								
								// if 2 areas are equal, the first one is preferred (came first because
								// it had a higher priority at the time of measuring)
								if (!biggestArea || area > biggestArea) {
									biggestArea = area;
									index = i;
								}
							}
						});
						
						// leave only the wanted scenario
						event.edit([event.results[index]]);
						
						// save for the position event listener
						self.__maxSize = maxSizes[index];
					}
					else {
						self.__maxSize = null;
					}
				});
				
				// restrain the size
				self.__instance._on('position.'+ self.__namespace, function(event) {
					
					var pos = event.position;
					
					// in case there already was a listener.
					// Note: we don't need to unbind at closing time, sideTip already
					// clears the tooltip
					$(event.tooltip).off('.'+ self.__namespace);
					
					if (self.__maxSize) {
						
						if (	pos.size.height > self.__maxSize.height
							&&	pos.side !== 'bottom'
						) {
							pos.coord.top = 0;
						}
						if (	pos.size.width > self.__maxSize.width
							&&	pos.side !== 'right'
						) {
							pos.coord.left = 0;
						}
						
						pos.size.height = Math.min(pos.size.height, self.__maxSize.height);
						pos.size.width = Math.min(pos.size.width, self.__maxSize.width);
						
						event.edit(pos);
						
						if (!self.__instance.option('interactive')) {
							
							// we have to make the tooltip interactive ourselves. Touch events will
							// emulate mouse events, we don't really care for the difference at this
							// point (unless somebody comes up with a good use case)
							$(event.tooltip)
								.css('pointer-events', 'auto')
								.on('mouseenter.'+ self.__namespace, function(event) {
									self.__instance._trigger({
										dismissable: false,
										type: 'dismissable'
									});
								})
								.on('mouseleave.'+ self.__namespace, function(event) {
									self.__instance._trigger({
										// we don't bother to differentiate mouse and touch, so we'll just
										// use the touch delay which is longer by default
										delay: self.__instance.option('delayTouch')[1],
										dismissable: true,
										event: event,
										type: 'dismissable'
									});
								});
						}
					}
					else {
						
						// in case we had previously made it interactive
						if (!self.__instance.option('interactive')) {
							$(event.tooltip).css('pointer-events', '');
						}
					}
				});
			},
			
			/**
			 * Method used in case we need to unplug the scrollableTip plugin
			 */
			__destroy: function() {
				this.__instance._off('.'+ this.__namespace);
			}
		}
	});
	
	return $;
}));
