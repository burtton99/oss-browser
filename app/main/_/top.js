

angular.module('web')
  .controller('topCtrl', ['$scope', '$rootScope','$uibModal', '$location', '$timeout','Dialog','Auth', 'AuthInfo','upgradeSvs','safeApply',
    function ($scope, $rootScope, $modal, $location, $timeout,Dialog,Auth, AuthInfo, upgradeSvs, safeApply) {

      var fs = require('fs');

      angular.extend($scope, {
        logout: logout,
        showReleaseNotes: showReleaseNotes,
        showFavList: showFavList,
        showAbout: showAbout,
        upgradeInfo: {
          isLastVersion: true
        }
      });

      $rootScope.app = {};

      angular.extend($rootScope.app, Global.app);

      //$scope.aid = AuthInfo.get().id;
      $scope.authInfo = AuthInfo.get();

      init();
      function init(){ 
        $scope.isLoading=true;
        upgradeSvs.load(function(info){
          $scope.isLoading=false;

          angular.extend($scope.upgradeInfo, info); 

          safeApply($scope);
        });
      }


      $rootScope.showSettings = function(){
        $modal.open({
          templateUrl: 'main/modals/settings.html',
          controller: 'settingsCtrl'
        });
      };


      function logout() {
        Dialog.confirm('退出','确定要退出?', function(b){
          if(b){
            Auth.logout().then(function () {
              $location.url('/login');
            });
          }
        },1);
      }

      function showReleaseNotes(){
        var converter = new showdown.Converter();
        var text = fs.readFileSync('./release-notes.md');
        text = text + '';
        var html = converter.makeHtml(text);
        Dialog.alert('Release Notes', html);
      }

      function showFavList(){
        $modal.open({
          templateUrl: 'main/modals/fav-list.html',
          controller: 'favListCtrl',
          size: 'lg'
        });
      }

      function showAbout(){
        $modal.open({
          templateUrl: 'main/modals/about.html',
          controller: 'aboutCtrl', 
          size: 'sm'
        });
      }
    }])
;