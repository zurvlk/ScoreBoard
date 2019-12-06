var chartData = {
	labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
	datasets: [{
		label: 'Scores',
		borderWidth: 1,
		data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		backgroundColor: [
			'rgba(227, 134, 146, 0.8)',
			'rgba(246, 213, 128, 0.8)',
			'rgba(207, 226, 131, 0.8)',
			'rgba(129, 214, 116, 0.8)',
			'rgba(100, 201, 155, 0.8)',
			'rgba(104, 207, 195, 0.8)',
			'rgba(107, 190, 213, 0.8)',
			'rgba(139, 167, 213, 0.8)',
			'rgba(164, 169, 207, 0.8)',
			'rgba(219, 123, 177, 0.8)'
		]
	}]
};

(function () {
	var agent = window.navigator.userAgent.toLowerCase();
	var chrome = (agent.indexOf('chrome') !== -1) && (agent.indexOf('edge') === -1) && (agent.indexOf('opr') === -1);
	var firefox = (agent.indexOf('firefox') !== -1);

	if (!(chrome || firefox)) {
		alert('PC版ChromeとFirefox以外は未対応です。\nデザインが崩れる可能性があります。');
	}

	var localArr = JSON.parse(localStorage.getItem('scoreboard'));
	if (localArr != null && localArr.length === 10) chartData.datasets[0].data = localArr;

	var cWidth = 300;
	var cHeight = cWidth * (window.innerHeight * 0.65) / window.innerWidth;
	window.onload = function () {
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.canvas.width = cWidth;
		ctx.canvas.height = cHeight;
		window.bar = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				responsive: true,
				legend: {
					display: false,
				},
				title: {
					display: false,
				},
				scales: {
					xAxes: [{
						gridLines: {
							display: false,
						},
						ticks: {
							fontSize: 20,
						},
					}],
					yAxes: [{
						gridLines: {
							color: 'rgba(51, 51, 51, 0.4)',
							zeroLineColor: 'rgba(51, 51, 51, 0.4)',
							lineWidth: 1,
							zeroLineWidth: 1
						},
						ticks: {
							suggestedMax: 5,
							suggestedMin: 0,
							stepSize: 1,
							fontSize: 20,
						},
					}]
				},
			}
		});
	};
	genScoreList();
	refreshRank();
}());

function genScoreList() {
	const teamCounts = 10;
	var alphabets = Range('A', 'Z');
	for (var i = 1; i <= teamCounts; i++) {
		var insert = [
			'<div class="scores score' + i + '">',
			'<div class="team_name_outer">',
			'<div class="team_name">' + alphabets[i - 1] + '</div>',
			'</div>',
			'</div>',
		].join('');
		$('div.grid-container').append(insert);
	}

	$('div.scores').each(function (i) {
		var cls = $(this).prop('class').replace('scores ', '');
		var insert = [
			'<div class="score_outer">',
			'<div class="score" id="' + cls + '">' + chartData.datasets[0].data[i] + '</div>',
			'</div>',

			'<div class="rank_outer">',
			'<div class="rank" id="rank_' + cls + '"></div>',
			'</div>',

			'<div class="score_controller_outer">',
			'<div class="score_controller_sub" onClick="subScore(' + "'" + cls + "'" + ')"></div>',
			'<div class="score_controller_add" onClick="addScore(' + "'" + cls + "'" + ')"></div>',
			'</div>'
		].join('');
		$(this).append(insert);
	});
}

function subScore(scoreNo) {
	var currentScore = document.getElementById(scoreNo);
	var score = Number(currentScore.textContent);
	var idx = Number(scoreNo.replace('score', '')) - 1;

	if (score !== 0) {
		score--;
		document.getElementById(scoreNo).textContent = String(score);
	}

	chartData.datasets[0].data[idx] = score;
	refreshRank();
	window.bar.update();
}

function addScore(scoreNo) {
	var currentScore = document.getElementById(scoreNo);
	var score = Number(currentScore.textContent);
	var idx = Number(scoreNo.replace('score', '')) - 1;

	score++;
	document.getElementById(scoreNo).textContent = String(score);

	chartData.datasets[0].data[idx] = score;
	refreshRank();
	window.bar.update();
}

function refreshRank() {
	var scores = chartData.datasets[0].data;
	// 参照渡しの為sliceで配列を複製する
	var sorted = scores.slice(0, scores.length).sort(function (a, b) {
		return b - a;
	});

	scores.forEach((elem, idx, arr) => {
		const findRank = (element) => element === elem;
		var rank = sorted.findIndex(findRank) + 1;
		document.getElementById('rank_score' + String(idx + 1)).textContent = numeral(rank).format('0o');
	});

	localStorage.setItem('scoreboard', JSON.stringify(chartData.datasets[0].data));
}

function reset() {
	localStorage.removeItem('scoreboard');
	var initArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	chartData.datasets[0].data = initArr;

	for (var i = 0; i < 10; i++) {
		document.getElementById('score' + Number(i + 1)).textContent = chartData.datasets[0].data[i];
	}

	refreshRank();
	window.bar.update();
}


function Range(first, last) {
	var f = first.charCodeAt(0);
	var l = last.charCodeAt(0);
	var result = new Array();
	for (var i = f; i <= l; i++) {
		result.push(String.fromCodePoint(i));
	}
	return result;
}
