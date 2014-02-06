'use strict';

angular.module('amazonS3TestApp')
    .controller('MainCtrl', ["$scope", "S3Service", "$modal",
        function($scope, S3Service, $modal) {
            var files = S3Service.getAllFileObjects();

            files.then(function(objects) {
                //what objects are there???
                $scope.status = "Done";
                console.log("File List:", objects);
                $scope.fileList = objects;
            });

            $scope.status = "Loading...";

            $scope.viewImage = function(imageObject) {
                console.log("viewing...", imageObject, $modal);
                $modal.open({
                    templateUrl: 'views/view.html',
                    controller: "ViewController",
                    resolve: {
                        items: function() {
                            return imageObject;
                        }
                    }
                });
            };

            $scope.$watch("files", function(file) {
                console.log("Files----", arguments);
                if (!file) return;
                console.log(file);
                $scope.status = "Uploading...";
                $scope.hidden = true;
                S3Service.uploadFile(file[0]).then(function() {
                    $scope.status = "Uploaded. Reloading...";
                    S3Service.getAllFileObjects().then(function(objects) {
                        $scope.hidden = false;
                        $scope.fileList = objects;
                        $scope.status = "Done";
                    })
                });
            })
        }
    ])
    .controller('ViewController', ["$scope", "items", "$timeout",
        function($scope, items, $timeout) {
            $scope.name = items.name;
            $scope.url = items.url;
        }
    ]).directive('filelistBind', ["$timeout",
        function($timeout) {
            return function(scope, elm, attrs) {
                elm.bind('change', function(evt) {
                    $timeout(function() {
                        scope[attrs.name] = evt.target.files;
                    });
                });
            };
        }
    ]);