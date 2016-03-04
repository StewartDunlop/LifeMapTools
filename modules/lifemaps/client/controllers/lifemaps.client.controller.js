'use strict';

// Lifemaps controller
angular.module('lifemaps').controller('LifemapsController', ['$scope', '$stateParams', '$location',
    'Authentication', 'Lifemaps', 'Restservice',
    function ($scope, $stateParams, $location, Authentication, Lifemaps, Restservice) {
        $scope.authentication = Authentication;

        var defYPos = 200;
        var defXPos = 200;
        var defWidth = 200;
        var defHeight = 200;


//**********************  jksPanel data ***************************************************************
        // Create ChangeNote panel
        $scope.demo = {
            // Initial conditions
            id: 'createCNPanel',
            panelleft: 100,
            paneltop: 120,
            width: 700,
            minHeight: 25,
            expandedHeight: 300,
            // height is used internally by the directive
            heading: 'Create New Change Note',
            accordion: false,
            draggable: true,
            resizable: false,
            isVisibleFlag: true,
            isClosable: false,
            showBody: true,
            message: {},
            type : 'list', // update/create
            // Overrides
            isVisible: function(){
                return ($scope.showCreateChangeNote || $scope.showEditChangeNote);
            },
            charWidth:12,
            getTemplateUrl: function () {
                return '../templates/jksPanel.directive.template.list.html';
            },
            // Recalculates the height of panel based on whats being displayed
            recalc: function() {
                // Move the start of this to the core
                var panel = document.getElementById(this.id+'_panel');
                var headerHeight = 0;
                var header = document.getElementById(this.id+'_panelAccordionHeading');
                if (header) {
                    headerHeight = header.offsetHeight;
                }
                var messageHeight = 0;
                var message = document.getElementById(this.id+'_panelMessage');
                if (message) {
                    messageHeight = message.offsetHeight;
                }

                var body = document.getElementById(this.id+'_changeNoteForm');
                var bodyHeight  = 0;
                if (body) {
                    bodyHeight = body.offsetHeight;
                }
                var newHeight = headerHeight + messageHeight + bodyHeight + 20;  // For the Add Char div
                panel.style.height = newHeight+'px';
            },
            // Move this to the core
            addNewItem : function(item) {
                var newChangeNote = new Changenote ({
                    scriptId: $stateParams.scriptId,
                    Character: cnote.selectedCharacter._id,
                    senses: cnote.selectedSense,
                    importance: cnote.selectedImportance,
                    storyPosition: cnote.selectedStoryPosition,
                    type: 'changenote'
                });
                angular.extend(newChangeNote, cnote);
                console.log('addNewChangeNote '+JSON.stringify(newChangeNote));
                // Save the new ChangeNote
                newChangeNote.$save(function(response) {
                    Restservice.one('changenotes', newChangeNote._id).get().then(function(cn) {
                        // Restangularise the new ChangeNote
                        newChangeNote = cn; //Character is populated
                        if (newChangeNote.sceneheadingId) {
                            updateSceneHeadingWithNewCN(cn);
                        }
                        if(newChangeNote.chronoChunkId) {
                            // console.log('update chronoheading with new cn '+newChangeNote.chronoChunkId);
                            updateChronoHeadingWithNewCN(newChangeNote, $scope.datashare.getChronoHeadingFromId(newChangeNote.chronoChunkId));
                        }
                        // This will need revising..
                        clearChangeNote($scope.changenoteCreatePanel.changenote);
                        $scope.changenotePanel.recalc();
                    });
                });
                $scope.datashare.displayChangeNoteRightClickMenu = false;
                $scope.showCreateChangeNote = false;
            }
        };

//*********************************************************************************************************************************

        // Create new Lifemap
        $scope.addMap = function () {
            $scope.error = null;
            console.log('Add a map');
            // Create new Lifemap object
            var information = {
                title : 'New Title'
            };
            var lifemap = new Lifemaps({
                information : information,
                xpos : defYPos,
                ypos : defXPos,
                width : defWidth,
                height : defHeight,
                expanded_height : defHeight,
                showbody : true,
                accordion : true,
                draggable : true,
                resizable : true,
                type : 'list'
            });

            // Get Restangularised lifemap back
            lifemap.$save(function (lifemap) {
                Restservice.one('lifemaps', lifemap._id).get().then(function(lm) {
                    $scope.lifemaps.push(lm);
                });
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Lifemap
        $scope.remove = function (lifemap) {
            if (lifemap) {
                lifemap.$remove();

                for (var i in $scope.lifemaps) {
                    if ($scope.lifemaps[i] === lifemap) {
                        $scope.lifemaps.splice(i, 1);
                    }
                }
            } else {
                $scope.lifemap.$remove(function () {
                    $location.path('lifemaps');
                });
            }
        };

        // Update existing Lifemap
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'lifemapForm');

                return false;
            }

            var lifemap = $scope.lifemap;

            lifemap.$update(function () {
                $location.path('lifemaps/' + lifemap._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Lifemaps
        $scope.findAll = function () {
            Restservice.all('lifemapsForUser').getList({userId: $scope.authentication.user._id}).then(
                function(lifemapsForUser) {
                    $scope.lifemaps = lifemapsForUser;
                }
            );
        };

        // Find existing Lifemap
        $scope.findOne = function () {
            $scope.lifemap = Lifemaps.get({
                lifemapId: $stateParams.lifemapId
            });
        };

    }
]);
