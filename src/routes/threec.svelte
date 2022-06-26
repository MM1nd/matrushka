<script>
	import QuestionRevealAnswer from '$lib/component/QuestionRevealAnswer.svelte';
	import RouteLink from '$lib/component/RouteLink.svelte';
	import WipWarning from '$lib/component/WipWarning.svelte';
	import { t } from '$lib/translations';
	import DualCheckersDemo from '$lib/component/DualCheckersDemo.svelte';
</script>

<h2 class="text-3xl font-semibold m-2">{$t('common.headings.threec')}</h2>
<WipWarning />
<p class="m-2 font-serif text-justify">
	This challenge assumes that you have already solved <RouteLink route_name="three" />
	and <RouteLink route_name="threeb" />. It is much harder and much more open ended than either of
	those challenges. We will be considering questions which, in my mind, arise naturally from
	thinking about the two challenges in comparison. These are questions that I did not myself knew
	the answer to when starting to write this page so they are a reflection of my thought process.
	This doesn't mean that this is the one correct way to think about the two challenges or that there
	is only one correct answer to these questions. I encourage you to think about questions that have
	come to your own mind after solving the two challenges and use the ones below as a guideline only.
</p>

<QuestionRevealAnswer>
	<p slot="question">
		Compare the two challenges mentioned above. What similarities and differences come to mind? Do
		all of the differences actually change the nature of the challenge?
	</p>
	<p slot="answer">
		Hopefully you saw that the rules of the game are the same in both versions of the game. This
		might be slightly obscured by the fact that one version asks you to go from alternating checkers
		to sorted checkers and the other version asks you to go from sorted to alternating checkers.
		However, we can make the argument that every legal move is reversible and there is nothing that
		makes one direction inherently more interesting than the other. If we ignore the direction, the
		challenges differ in the number of checkers involved and, perhaps not surprisingly, more
		checkers require more moves to be reordered. The total number of space required does not differ
		and is ten positions in both cases. This might spark your curiosity and will be the subject of
		another question below.
	</p>
</QuestionRevealAnswer>

<QuestionRevealAnswer>
	<p slot="question">
		The two versions of the challenge as presented involve six and eight checkers respectively. Are
		versions with fewer or more checkers possible? Is there some kind of rule to this?
	</p>
	<div slot="answer">
		<p>
			We will call the initial arrangement of checkers and empty space a starting position and the
			final arrangement the goal position. Following the considerations from the previous question,
			without loss of generality we can assume that the starting position is the alternating state
			and the goal position is the sorted state. Now we can ask ourselves what makes a starting
			position valid. Intuitively there has to be a series of valid moves that leads from the
			starting position to a goal position. We might call this series of moves a solution. But what
			does this mean precisely? Let's explore systematically.
		</p>
		<p class="indent-4">
			If you know how to program this might be a good time to implement a solver for this little
			problem and experiment with it. Look up breadth-first search if you need to. In fact, the
			images you are about to see are generated (needlessly) dynamically in your browser by such a
			solver.
		</p>

		<DualCheckersDemo initial_state={['b']}>
			<p>
				The case of one single checker is arguably sorted and therefore a valid goal position. If it
				were also a valid starting position, there trivially is a zero move solution. This raises
				the question if we want to allow zero move solutions in principle. Clearly this is an edge
				case either way but it is worthwhile thinking of arguments why it might or might not be
				valid as a starting position.
			</p>
		</DualCheckersDemo>
		<DualCheckersDemo initial_state={['b', 'w']}>
			<p>
				The case of two checkers is sorted and also unambigously alternating in contrast to the case
				of one checker. It is also trivially a zero move solution. There is a difference to the six
				and eight checker solution, which we have seen already, that might be to subtle to notice at
				first glance: In the case of six and eight checkers when the starting position begins with a
				black checker, the goal position begins with a white checker and vice-versa. This is
				obviously not the case here. What is the rule behind this?
			</p>
		</DualCheckersDemo>
		<DualCheckersDemo initial_state={['b', 'w', 'b', 'x', 'x']}>
			<p>
				The arguments to consider or not consider three checkers valid are already on the table from
				the previous two cases. Check that your intuition is consistent in all three cases. The case
				of four checkers does not have a solution regardless of your choices. Convince yourself that
				this is true. We will leave the exact reasoning for later.
			</p>
		</DualCheckersDemo>

		<DualCheckersDemo initial_state={['b', 'w', 'b', 'w', 'b', 'x', 'x']}>
			<p>
				It really seems that four checkers mark some kind of breaking point. The solution to five
				checkers looks very similar two the ones for six and eight checkers which were our
				prototype. If you did not rule out odd numbers of checkers as a matter of principle, you
				will probably find this solution acceptable.
			</p>
		</DualCheckersDemo>

		<DualCheckersDemo initial_state={['b', 'w', 'b', 'w', 'b', 'w', 'b', 'x', 'x']}>
			<p>
				We skipped six checkers, which we already know to work, and with this solution to seven
				checkers we have closed the gap to eight — our second prototype.
			</p>
		</DualCheckersDemo>

		<DualCheckersDemo
			initial_state={['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w', 'b', 'x', 'x', 'x', 'x']}
		>
			<p>
				Nine checkers, like six, require four empty spaces instead of two, to be solvable. Or so it
				seems, this might not be the only solution. Again, we postpone the question of why this is
				the case.
			</p>
		</DualCheckersDemo>
		<p class="indent-4">
			The cases of ten, eleven and twelve checkers all have solutions (not shown) which however
			scratch the limits of real-time with my naively solver. Looking at the examples, one might
			conjecture that all numbers of checkers above four are valid and dismiss the cases below four
			as edge cases. No amount of examples can prove this though. We need a better approach for
			that.
		</p>
	</div>
</QuestionRevealAnswer>

<QuestionRevealAnswer>
	<p slot="question">
		Regardless of your detailed answer to the previous question, you will find that a solution
		starting with four checkers is not possible. Why is this the case?
	</p>
	<p slot="answer">TBD</p>
</QuestionRevealAnswer>
