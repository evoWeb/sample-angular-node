/* global angular */
var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function ($scope, $resource, $timeout) {

	/**
	 * requests and processes tweet data
	 */
	function getTweets(paging) {

		var params = {
			action: 'search',
			parameter: $scope.parameter
		};

		if ($scope.maxId) {
			params.max_id = $scope.maxId;
		}

		// create Tweet data resource
		$scope.tweets = $resource('/tweets/:action/:parameter', params);

		// GET request using the resource
		$scope.tweets.query({}, function (res) {

			if (paging === false) {
				$scope.tweetsResult = [];
			}

			$scope.tweetsResult = $scope.tweetsResult.concat(res);
console.log($scope.tweetsResult);
			// for paging - https://dev.twitter.com/docs/working-with-timelines
			$scope.maxId = res[res.length - 1].id;

			// render tweets with widgets.js
			$timeout(function () {
				getTweets(paging);
			}, 300000);
		});
	}

	/**
	 * bound to @user input form
	 */
	$scope.getTweets = function () {
		$scope.maxId = undefined;
		getTweets();
	};

	/**
	 * bound to 'Get More Tweets' button
	 */
	$scope.getMoreTweets = function () {
		getTweets(true);
	};

	/**
	 * init controller and set defaults
	 */
	function init() {
		// set a default username value
		$scope.parameter = "#t3crr17";

		// empty tweet model
		$scope.tweetsResult = [];

		$scope.getTweets(false);
	}

	init();
});
