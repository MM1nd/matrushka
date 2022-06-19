<script>
	/**
	 * @type {string}
	 */
	export let heading;
	/**
	 * @type {string}
	 */
	export let description;

	/**
	 * @type {any}
	 */
	export let interactive;
</script>

<h2 class="text-3xl font-semibold m-2">{heading}</h2>
<p class="m-2 font-serif text-justify">{description}</p>
<div class="m-2">
	<svelte:component this={interactive} />
</div>
