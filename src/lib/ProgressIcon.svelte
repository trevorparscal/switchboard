<script lang="ts">
	export let value: number = 0;

	const dashArray = 100;

	$: dashOffset = dashArray - ( 62 * Math.max( 0, Math.min( 1, value ) ) );
</script>

<div class="progress-icon">
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<circle
			class="progress-icon-ring"
			stroke-width="2"
			stroke-dasharray={dashArray}
			stroke-dashoffset={dashOffset}
			fill="transparent"
			r="10"
			cx="12"
			cy="12"
		/>
	</svg>
</div>

<style>
	.progress-icon {
		display: inline-flex;
		transform: rotate(-90deg);
		width: 24px;
		height: 24px;
	}
	.progress-icon-ring {
		stroke: currentColor;
		stroke-linecap: round;
	}
</style>
