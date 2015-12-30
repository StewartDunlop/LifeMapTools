'use strict';

/**
 * Created by stewartdunlop on 23/12/2015.
 */

angular.module('lifemaps')
    .directive('jksPanel', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                paneldata: '='
            },
            // The panel holds the positioning and size controls
            template: '<div class="panel" style="left: {{paneldata.xpos}}px;top: {{paneldata.ypos}}px; width:{{paneldata.width}}px; height:{{paneldata.height}}px"><div panelaccordionheading></div><div panelaccordionbody></div></div>',
            controller: function($scope, $element, $attrs)  {
                this.collapseBody = function() {
                    if ($scope.paneldata.showbody === true) {
                        $scope.paneldata.showbody = false;
                        $scope.paneldata.expanded_height = $scope.paneldata.height;
                        $scope.paneldata.height = 24;
                        if ($scope.paneldata.resizable) {
                            $element.resizable( "option", "disabled", true );
                        }
                    } else {
                        $scope.paneldata.showbody = true;
                        $scope.paneldata.height = $scope.paneldata.expanded_height;
                        if ($scope.paneldata.resizable) {
                            $element.resizable( "option", "disabled", false );
                        }
                    }
                    $scope.$apply();
                };
                if ($scope.paneldata.resizable) {
                    $element.resizable();
                }
                $element.on('resize', function (evt, ui) {
                    $scope.$apply(function() {
                        $scope.paneldata.width = ui.size.width;
                        $scope.paneldata.height = ui.size.height;
                        $scope.paneldata.expanded_height = ui.size.height;
                    });
                });
                var xConst = $scope.paneldata.xpos;
                var yConst = $scope.paneldata.ypos;
                this.updatePanelPosn = function(xVal, yVal) {
                    $scope.paneldata.moving = 'moving';
                    $scope.paneldata.xpos = Number(xConst + xVal);
                    $scope.paneldata.ypos = Number(yConst+yVal);
                    $scope.$apply();
                };
            }
        };
    });

// Creates a draggable handle that leaves the rest of the panel free
angular.module('lifemaps')
    .directive('panelaccordionheading', ['$document', function($document) {
        return {
            restrict: 'EA',
            // All the data is on the top level dir - require this to get data and funcs
            require: '^jksPanel',
            // The panel holds the positioning and size controls
            // Add conditional code for whether draggable is on or off
            link: function(scope, element, attr, parentCtrl) {
                // Generate html
                var templateString = '<div id="divheading" class="headingbackground"><span id="panelhdg" class="panelheading">'+scope.paneldata.information+'</span>';
                if (scope.paneldata.accordion) {
                    if (scope.paneldata.showbody === true) {
                        templateString = templateString + '<span id="accordionctrl" class="accordianctrl glyphicon glyphicon-menu-down"></span>';
                    } else {
                        templateString = templateString + '<span id="accordionctrl" class="accordianctrl glyphicon glyphicon-menu-right"></span>';
                    }
                }
                templateString = templateString + '</div>';
                element.html(templateString);
                if (scope.paneldata.draggable) {
                    element.css('cursor', 'move');
                }
                // on click - should only work for icon
                element.on('click', function() {
                    if (scope.paneldata.accordion && scope.paneldata.moving === '') {
                        parentCtrl.collapseBody();
                    }
                    scope.paneldata.moving = '';
                });
                // Draggable code start
                var startX = 0, startY = 0, x = 0, y = 0;
                element.on('mousedown', function(event) {
                    if (scope.paneldata.draggable) {
                        // Prevent default dragging of selected content
                        event.preventDefault();
                        // Work out where your cursor is in respect of the panel when you first click
                        startX = event.pageX - x;
                        startY = event.pageY - y;
                        // Attach handlers
                        $document.on('mousemove', mousemove);
                        $document.on('mouseup', mouseup);
                    }
                });
                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    // Send the coords up to the parent so the Panel moves with the Heading
                    parentCtrl.updatePanelPosn(x,y);
                }
                function mouseup() {
                    // Disconnect the handlers
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    // Save the position

                }
                // Draggable code end
            }
        };
    }]);


// Creates a draggable handle that leaves the rest of the panel free
angular.module('lifemaps')
    .directive('panelaccordionbody', ['$document', function($document) {
        return {
            restrict: 'EA',
            // All the data is on the top level dir - require this to get data and funcs
            require: '^jksPanel',
            // The panel holds the positioning and size controls
            // Add conditional code for whether draggable is on or off
            //templateUrl: 'panelbody.html',
            template:'<div class="panelBody" ng-show="paneldata.showbody">\
            <div>\
            <span ng-click="addItem(additemdata)" class="additem glyphicon glyphicon-plus"></span>\
            <input type="text" ng-model="additemdata">\
            </div>\
            <div ng-repeat="item in paneldata.data.items">\
            <span ng-click="focusOnItem(item)" ng-show="itemInFocusId !== item.id" >{{item.itemdata}}</span>\
            <span ng-show="itemInFocusId === item.id" ><input type="text" ng-model="item.itemdata">\
            <span ng-click="done()" class="additem glyphicon glyphicon-ok"></span>\
            <span ng-click="removeItem(item)" class="additem glyphicon glyphicon-remove"></span>\
            </span>\
            </div>\
            </div>',
            link: function(scope, element, attr, parentCtrl) {
                var templateString = '<div ng-show="paneldata.showbody">';
                templateString += '<div><span ng-click="addItem(additemdata)" class="additem glyphicon glyphicon-plus"></span><input type="text" ng-model="additemdata"></div>';
                templateString += '<div ng-repeat="item in paneldata.data.items">';
                templateString += '<span ng-click="focusOnItem(item)" ng-show="itemInFocusId !== item.id" >{{item.itemdata}}</span>';
                templateString += '<span ng-show="itemInFocusId === item.id" ><input type="text" ng-model="item.itemdata">';
                templateString += '<span ng-click="done()" class="additem glyphicon glyphicon-ok"></span>';
                templateString += '<span ng-click="removeItem(item)" class="additem glyphicon glyphicon-remove"></span>';
                templateString += '</span>';
                templateString += '</div></div>';

                scope.addItem = function(additemdata) {
                    var newObj = {id:'new_id_'+scope.paneldata.data.length+1, itemdata:additemdata};
                    scope.paneldata.data.items.push(newObj);
                    scope.additemdata = '';
                };
                scope.focusOnItem = function(item) {
                    scope.itemInFocusId = item.id;
                };
                scope.done = function() {
                    scope.itemInFocusId = undefined;
                };
                scope.removeItem = function(item) {
                    var removed = false;
                    for (var i=0; i<scope.paneldata.data.length && !removed; i++) {
                        if (scope.paneldata.data[i].id === item.id) {
                            scope.paneldata.data.splice(i,1);
                            removed = true;
                        }
                    }
                };
                //},
                //controller: function($scope, $element, $attrs)  {

            }
        };
    }]);

