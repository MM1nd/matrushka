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
	thinking about the two challenges in comparison. These are questions that I did not myself know
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
		Hopefully you saw that the rules of the game are mostly the same in both versions of the
		challenge. This might be slightly obscured by the fact that one version asks you to go from
		alternating checkers to sorted checkers and the other version asks you to go from sorted to
		alternating checkers. However, we can make the argument that every legal move is reversible and
		there is nothing that makes one direction inherently more interesting than the other. If we
		ignore the direction, the challenges differ in the number of checkers involved and, perhaps not
		surprisingly, more checkers require more moves to be rearranged. Curiously, the total number of
		space required does not differ and is ten positions in both cases. But is this really a
		similarity? We could just as well say, that one version uses two empty spaces and the other uses
		four. Phrased like this we would count the observation as a difference. This will be the subject
		of more discussion below.
	</p>
</QuestionRevealAnswer>

<p class="m-2 font-serif text-justify">
	No matter your views on similarities and differences, we always have to consider that we are
	talking about two artificial and arbitrary challenges. There is no deeper reality to be discovered
	here. All we can hope to do is to train our ability to think precisely about the structures
	presented to us. The more precise we get, the more we will find that many details are left
	undefined in the riddle-like presentation and we will have to find suitable definitions for
	ourselves. First, a bit of nomenclature to make this easier: We will call the initial arrangement
	of checkers and empty space a starting position and the final arrangement a goal position.
	Intuitively there has to be a series of valid moves that leads from the starting position to a
	goal position. We might call this series of moves a solution. But what does this mean precisely?
	Let's explore systematically.
</p>

<p class="m-2 font-serif text-justify">
	Often heard advice is to look at small examples to get a feeling for the structure of a problem.
	This is what we will do next. If you know how to program, this might be a good time to implement a
	solver for this little problem and experiment with it. In fact, some of the images you are about
	to see are generated (needlessly) dynamically in your browser by such a solver. The implementation
	will force you to make your assumptions about the nature of the problem explicit. Look up
	breadth-first search if you need help to get started.
</p>

<QuestionRevealAnswer>
	<p slot="question">
		The two versions of the challenge, as presented, involve six and eight checkers respectively and
		so we know that there are solutions for starting with six and eight checkers. You will find that
		a solution starting with four checkers is however not possible. How can we be sure of this?
	</p>
	<div slot="answer">
		<p>
			For such a seemingly small problem, it is tempting to have a computer search the entire space
			of possible solutions. The issue with that approach is that at this point we are still not
			sure how much empty space is needed in general for a solution. If our computer has
			unsuccessfully searched the solution space to up to a million empty spaces, how do we know,
			that adding one more empty space does not suddenly make the problem solvable? You might be
			able to answer this directly but for illustration, let us consider a much simpler problem:
			four checkers and exactly two empty spaces.
		</p>
		<img
			src="dualcheckersfoura.svg"
			alt="Graph showing the structure of the four checker problem."
		/>
		<p class="indent-4">
			This version of the problem is so small that we do not even need a computer. The graph shown
			above was created entirely by hand. 'b' and 'w' denote black and white checkers respectively,
			'x' denotes an empty space. No sorted state ('bbww' or 'wwbb' surrounded by any configuration
			of 'x') is reachable from the starting position 'bbwwxx'. There are a few observations to be
			made that make the discussion easier later.
		</p>
		<p class="indent-4">
			Convince yourself that the game is symmetric with respect to mirroring. There is no
			fundamental difference between 'bwbwxx' and 'xxwbwb'. If we were considering physical checkers
			on a table, walking around the table and looking at the arrangement from the other side would
			show us the mirrored arrangement. We would not expect this to produce new solutions. Therefore
			we do not consider states reachable only through 'xxwbwb'. Similarly, switching colors will
			not lead to new solutions. [At least in first approximation, we might revisit this point
			later.] Therefore we consider 'xxbwbw' to be equivalent to 'xxwbwb'. Taken together, this also
			means that it does not matter, if the initial empty space is to the left or to the right of
			the checkers, as the solutions for either case will be symmetric to one another.
		</p>
		<p class="indent-4">
			Positions that leave one unit of empty space surrounded by checkers, e.&nbsp;g. 'bwxbwx' are
			shown here for completeness. Since we always have to move two checkers at a time, this space
			is useless, as nothing can go into it, and moves that create such space are, in a way, leading
			nowhere since they have to be undone by countermoves restoring two adjacent empty spaces. The
			only way two create such positions in the simplified problem with two empty spaces total is to
			move two checkers to one side by one position so that one of them occupies the space that used
			to be occupied by the other. From here on, we will rule such moves illegal and require that
			both newly occupied spaces were empty before the move.
		</p>
		<p class="indent-4">
			Going back from the simplified version with two empty spaces to the general version with
			arbitrary empty space, you have to somehow convince yourself that, at least with only four
			checkers in play, adding more empty space in the starting position does only produce larger
			blocks of empty space later but not new solutions. The key to this is the following
			consideration: From the starting position, splitting the checkers into two groups of two
			checkers with space in between, there is nothing interesting you can do because you cannot
			change the order within either group. This is even more true for a 1:1:2 split. So as the only
			interesting option we are left with arrangements of one and three checkers. This puts a limit
			to how we can use empty space since to keep a 1:3 split intact we always have to put the
			checkers that we are moving directly next to one of the other ones. The goal state is not
			allowed to have empty space between the checkers and the only way to rejoin the two groups of
			checkers is to effectively undo whatever moves created the gap. Note that this argument is
			very specific to having exactly four checkers.
		</p>
	</div>
</QuestionRevealAnswer>

<QuestionRevealAnswer>
	<p slot="question">
		We know that six and eight checkers are valid starting positions while four checkers are not.
		What about other numbers? What are the underlying rules of this? What makes a starting position
		valid?
	</p>
	<div slot="answer">
		<p>
			Following the considerations above, without loss of generality we can assume that the starting
			position is the alternating state and the goal position is the sorted state. We consider
			starting positions and solutions for some more small numbers of checkers.
		</p>

		<DualCheckersDemo initial_state={['b']} />
		<p>
			The case of one single checker is arguably sorted and therefore a valid goal position. If it
			were also a valid starting position, there trivially would be a zero move solution. This
			raises the question if we want to allow zero move solutions in principle. Clearly this is an
			edge case either way but it is worthwhile thinking of arguments why it might or might not be
			valid as a starting position.
		</p>
		<DualCheckersDemo initial_state={['b', 'w']} />

		<p>
			The case of two checkers is sorted and also unambigously alternating in contrast to the case
			of one checker. If we want to accept that there is a solution at all, it also trivially has to
			be a zero move solution. There is a difference to the six and eight checker solution, which we
			have seen already, that might be to subtle to notice at first glance: In the case of six and
			eight checkers, when the starting position begins with a black checker, the goal position
			begins with a white checker and vice-versa. This is obviously not the case here. Does this
			influence your opinion on whether this is a valid starting position?
		</p>

		<DualCheckersDemo initial_state={['b', 'w', 'b', 'x', 'x']} />

		<p>
			The arguments to consider or to not consider three checkers valid are already on the table
			from considering one and two checkers. Confirm if your intuition is consistent in all three
			cases.
		</p>

		<DualCheckersDemo initial_state={['b', 'w', 'b', 'w', 'b', 'x', 'x', 'x', 'x']} />
		<p>
			Suddenly for five checkers we have more than one solution. The solutions look very similar to
			the prototypical ones for six and eight checkers. If you did not rule out odd numbers of
			checkers as a matter of principle, you will probably find these solutions acceptable. Now
			let's speed up things a little.
		</p>

		<DualCheckersDemo
			initial_state={['b', 'w', 'b', 'w', 'b', 'w', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']}
		/>

		<DualCheckersDemo
			initial_state={['b', 'w', 'b', 'w', 'b', 'w', 'b', 'x', 'x', 'x', 'x', 'x', 'x', 'x']}
		/>

		<DualCheckersDemo
			initial_state={['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w', 'x', 'x', 'x', 'x', 'x', 'x']}
		/>

		<DualCheckersDemo
			initial_state={['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w', 'b', 'x', 'x', 'x', 'x', 'x']}
		/>
		<p>
			We already knew solutions to six and eight checkers. The solution to seven checkers closes
			that gap. Making the board wider than it apparently needs to be, we can see that the solutions
			for six and nine checkers, use four empty spaces, while the solutions to five and eight
			checkers use only two. We will once again postpone the question as to why this is the case.
			Challenges with ten, eleven and twelve checkers all have solutions (not shown) which however
			scratch the limits of the ability for a naive breadth-first solver to complete in real-time.
		</p>
		<p class="indent-4">
			Looking at all the examples together, we might conjecture that all numbers of checkers above
			four are valid and dismiss the cases below four as edge cases based on some of their observed
			differences to the other ones. If you are not familiar with the concept, this might be a good
			time to consider the use of examples as proof. Is there a number of examples that would
			convince you, that really <span class="italic">any</span> number of checkers above four has as
			solution?
		</p>
	</div>
</QuestionRevealAnswer>

<QuestionRevealAnswer>
	<p slot="question">
		You will notice that in the challenges with six and eight checkers, if the starting position
		starts with a black checker, the goal position starts with a white checker and vice-versa. You
		might already have explored this observation thinking about a previous question. Why does this
		happen?
	</p>
	<p slot="answer">TBD</p>
</QuestionRevealAnswer>
