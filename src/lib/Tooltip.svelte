<script lang="ts">
	export let text: string | undefined;
	export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
	export let size: 'small' | 'medium' | 'large' | undefined = undefined;
</script>

<span class="ui-toolTip">
	<slot />
	<span
		class="ui-toolTip-text"
		class:ui-toolTip-top={position === 'top'}
		class:ui-toolTip-bottom={position === 'bottom'}
		class:ui-toolTip-left={position === 'left'}
		class:ui-toolTip-right={position === 'right'}
		class:ui-toolTip-large={size === 'large'}
		class:ui-toolTip-small={size === 'small'}
	>
		{text}
	</span>
</span>

<style>
	.ui-toolTip {
		position: relative;
		display: inline-block;
	}
	.ui-toolTip-text {
		position: absolute;
		background-color: rgba(0,0,0,0.5);
		backdrop-filter: blur(0.25rem);
		box-shadow: 0 0 0.33rem 0 rgba(0,0,0,0.5);
		user-select: none;
		border-radius: 1rem;
		font-size: 0.75rem;
		line-height: 0.75rem;
		padding: 0.5rem 0.67rem;
		pointer-events: none;
		opacity: 0;
		white-space: nowrap;
	}
	.ui-toolTip-small {
		font-size: 0.625rem;
		line-height: 0.625rem;
		padding: 0.25rem 0.5rem;
	}
	.ui-toolTip-large {
		font-size: 1rem;
		line-height: 1rem;
		padding: 0.5rem 0.75rem;
	}
	.ui-toolTip:hover .ui-toolTip-text {
		opacity: 1;
	}
	.ui-toolTip-top {
		left: 50%;
		top: 0;
		transition: opacity 150ms ease, top 150ms ease;
		will-change: opacity, top;
		transform: translate(-50%, -100%);
	}
	.ui-toolTip-bottom {
		left: 50%;
		bottom: 0;
		transition: opacity 150ms ease, bottom 150ms ease;
		will-change: opacity, bottom;
		transform: translate(-50%, 100%);
	}
	.ui-toolTip-left {
		top: 50%;
		left: 0;
		transition: opacity 150ms ease, left 150ms ease;
		will-change: opacity, left;
		transform: translate(-100%, -50%);
	}
	.ui-toolTip-right {
		top: 50%;
		right: 0;
		transition: opacity 150ms ease, right 150ms ease;
		will-change: opacity, right;
		transform: translate(100%, -50%);
	}
	.ui-toolTip:hover .ui-toolTip-top {
		top: -0.25rem;
	}
	.ui-toolTip:hover .ui-toolTip-bottom {
		bottom: -0.25rem;
	}
	.ui-toolTip:hover .ui-toolTip-left {
		left: -0.25rem;
	}
	.ui-toolTip:hover .ui-toolTip-right {
		right: -0.25rem;
	}
</style>
