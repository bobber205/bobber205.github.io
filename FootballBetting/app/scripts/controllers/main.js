'use strict';

var randomnumber = Math.floor(Math.random() * 11)

window.randomIndex = function() {
	var result = Math.floor(Math.random() * 9);
	return result;
}

angular.module('footballBettingApp').controller('MainCtrl', function($scope, $timeout) {

	//0 18
	//1 8.9%
	//2 3%
	//3 14%
	//4 17%
	//5 4%
	//6 10%
	//7 17%
	//8 6.1%
	//9 7.5%
	window.randomFootballResult = function() {
		var result;
		var rand = Math.random();
		rand = rand * 100;

		if (rand >= 0 && rand <= 18) return 0;
		if (rand > 18 && rand <= 26.9) return 1;
		if (rand > 26.9 && rand <= 29.9) return 2;
		if (rand > 29.9 && rand <= 43.9) return 3;
		if (rand > 43.9 && rand <= 60.9) return 4;
		if (rand > 60.9 && rand <= 64.9) return 5;
		if (rand > 64.9 && rand <= 74.9) return 6;
		if (rand > 74.9 && rand <= 90) return 7;
		if (rand > 90 && rand <= 96) return 8;
		if (rand > 96 && rand <= 100) return 9;
		throw new Error("oh no! " + rand);
	}


	function performBet() {
		var broncoResult = randomFootballResult();
		var hawkResult = randomFootballResult();

	}



	function doAlg(maxIterations, strategy) {
		var wins = 0;
		console.log("h", hawkScores, "b", broncoScores);

		for (var i = 0; i < maxIterations; i++) {
			var didGetBronco = false;
			var didGetHawks = false;

			var rows = strategy();
			var broncoScores = rows.broncoRow;
			var hawkScores = rows.hawkRow;
			// console.log(broncoScores, hawkScores);

			var broncoResult = randomFootballResult();
			var hawkResult = randomFootballResult();
			// console.log(broncoResult, hawkResult);

			_.each(broncoScores, function(score) {
				if (score == broncoResult) didGetBronco = true;
			});

			_.each(hawkScores, function(score) {
				if (score == hawkResult) didGetHawks = true;
			});
			console.log(didGetHawks, didGetBronco);
			if (didGetHawks && didGetBronco) {
				wins++;
				// console.warn("WIN");
			}
		}
		return wins;
	}


	function strategyOne(maxIterations) {
		var wins = doAlg(maxIterations, function() {
			var one = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle();
			var two = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle();

			var broncoIndex = window.randomIndex();

			var oneFinal = [];
			var twoFinal = [];

			oneFinal.push(one[broncoIndex]);


			return {
				broncoRow: oneFinal,
				hawkRow: two.splice(0, 5)
			}
		});
		// console.log("wins!", wins);
		// console.log("strat one won: " + (wins / maxIterations) * 100, " % of the time");
		return wins / maxIterations;
	}

	function strategyTwo(maxIterations) {
		var wins = doAlg(maxIterations, function() {
			var one = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle();
			one = one.splice(0, 5);
			var two = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle();

			var oneFinal = [];
			var twoFinal = [];
			oneFinal = one;
			_.each(oneFinal, function(num, index) {
				twoFinal.push(two[one.indexOf(num)])
			});
			return {
				broncoRow: oneFinal,
				hawkRow: twoFinal
			}
		});
		// console.log("wins!", wins);
		// console.log("strat two won: " + (wins / maxIterations) * 100, " % of the time");
		return wins / maxIterations;
	}
	$scope.doneBets = false;
	$scope.status = "No Result Yet...";
	$scope.doBets = function() {
		var max = 2000;
		$scope.status = "Running sim...";
		$scope.maxIterations = max;
		$timeout(function() {
			$scope.oneResult = (strategyOne(max) * 100); //about 5%
			$scope.twoResult = (strategyTwo(max) * 100); //about 25%
			$scope.doneBets = true;
		}, 1);
	}

});