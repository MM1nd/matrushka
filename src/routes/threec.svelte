<script>
	import QuestionRevealAnswer from '$lib/component/QuestionRevealAnswer.svelte';
	import RouteLink from '$lib/component/RouteLink.svelte';
	import WipWarning from '$lib/component/WipWarning.svelte';
	import { t } from '$lib/translations';
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
