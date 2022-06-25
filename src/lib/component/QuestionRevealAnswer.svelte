<script>
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronRight, ChevronDoubleDown, QuestionMarkCircle } from '@steeze-ui/heroicons';

	let revealed = false;

	function toggleReveal() {
		revealed = !revealed;
	}
</script>

<div class="m-2">
	<div class="flex bg-rose-50 p-1">
		<div class="flex-none"><Icon src={QuestionMarkCircle} class="block h-4 w-4 m-1" /></div>
		<div class="font-serif text-justify">
			<slot name="question" />
		</div>
	</div>
	<button
		type="button"
		class="w-full p-1 bg-rose-100 text-left"
		class:hidden={revealed}
		on:click={toggleReveal}
	>
		<Icon src={ChevronRight} class="inline-block h-4 w-4 ml-1 mb-1" />
		Reveal Answer
	</button>
	<div class="flex bg-rose-100 p-1" class:hidden={!revealed}>
		<div class="flex-none hover:cursor-pointer" on:click={toggleReveal}>
			<Icon src={ChevronDoubleDown} class="block h-4 w-4 m-1" />
		</div>
		<div class="font-serif text-justify">
			<slot name="answer" />
		</div>
	</div>
</div>
