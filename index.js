const pos = ({x, y}) => "abcdefgh"[x] + (y + 1);
const coord = str => ({ x: "abcdefgh".indexOf(str[0]), y: str[1] - 1 });
const knight = coord('h8');
const queen = coord('d5');

const eight = [...Array(8).keys()];
const am8 = (x, y) => ((x + y) + 8) % 8;
const validQueenMoves = 
	eight.flatMap(n => [
		{ x: am8(queen.x, n), y: am8(queen.y, n)},
		{ x: am8(queen.x, n), y: am8(queen.y, -n)},
		{ x: am8(queen.x, n), y: queen.y },
		{ x: queen.x, y: am8(queen.y, n) },
	]).map(pos);

const goals = eight.flatMap(y => eight.map(x => ({x: x, y: y}))).map(pos).filter(m => !validQueenMoves.includes(m));
goals.pop();

let moves = 0;
let start = 0;
let timing = false;
const timer = $("#timer");

function getGoal() {
	return goals[goals.length - 1];
}

function validKnightMoves(source) {
	const sq = coord(source);
	return [
		{ x: 1,  y: 2},
		{ x: -1, y: 2},
		{ x: 1,  y: -2},
		{ x: -1, y: -2},
		{ x: 2,  y: 1},
		{ x: -2, y: 1},
		{ x: 2,  y: -1},
		{ x: -2, y: -1},
	]
	.map(({x, y}) => ({ x: x + sq.x, y: y + sq.y}))
	.map(pos)
	.filter(m => !validQueenMoves.includes(m));
}

function updateMoveCount() {
	moves++;
	$('#move_counter').text(moves);
}

function onDragStart(source, piece) {
	if(start != 0 && !timing)
		return false;
	startTimer();
	return piece == 'wN';
}

function onDrop(source, target) {
	if(!validKnightMoves(source).includes(target))
		return 'snapback';
	if(target == getGoal()) {
		$(`.square-${goals.pop()}`).removeClass('highlight');
		$(`.square-${getGoal()}`).addClass('highlight');
		if(goals.length === 0 && timing) {
			stopTimer();
		}
	}
	updateMoveCount();
}

function startTimer() {
	if(!timing && start === 0) // prevent timer restarting
		start = Date.now();
		timing = true;
	animateTimer();
}

function animateTimer() {
	const time = Date.now() - start; // high performant date conversion without new Date()
	timer.text(`${ Math.floor(time / 1000 / 60) }:${ (Math.floor(time / 1000 ) % 60).toString().padStart(2, '0') }.${ (time % 1000).toString().padStart(3, '0') }`);
	if(timing)
		requestAnimationFrame(animateTimer);
}

function stopTimer() {
	animateTimer(); // last timer update to keep results precise
	timing = false;
}

const board = Chessboard('the_board', {
	draggable: true,
	position: { [pos(queen)]: 'bQ', [pos(knight)]: 'wN' },
	onDragStart: onDragStart,
	onDrop: onDrop,
});

$(`.square-${getGoal()}`).addClass('highlight');
