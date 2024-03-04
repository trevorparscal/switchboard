import { get, writable } from 'svelte/store';
import type { ObsStore } from './obs';
import type { LocalStore } from './local';

export interface AppState {
	cycling: boolean,
	cycleProgress: number,
	cycleStarted?: number,
	selecting: boolean,
	filter: boolean
}

export type AppStore = ReturnType<typeof createAppStore>;

function getInitialAppState() {
	return {
		cycling: false,
		cycleProgress: 0,
		cycleStarted: undefined,
		selecting: false,
		filter: false
	} satisfies AppState;
}

export function createAppStore( obsStore: ObsStore, localStore: LocalStore ) {
	const store = writable<AppState>( getInitialAppState() );

	let start: number;

	async function updateProgress( time: number ) {
		const { cycling } = get( store );
		if ( !cycling ) {
			return;
		}
		if ( start === undefined ) {
			start = time;
		}

		const { cycleInterval } = get( localStore );
		store.update( ( state ) => {
			if ( state.cycleStarted === undefined ) {
				state.cycleStarted = time;
			}
			const cycleProgress = ( time - state.cycleStarted ) / cycleInterval;
			if ( state.cycleProgress >= 1 ) {
				obsStore.triggerTransition().then( () => {
					obsStore.setNextScene( chooseRandomNextScene() );
					state.cycleStarted = performance.now();
					state.cycleProgress = 0;
					requestAnimationFrame( updateProgress );
				} );
			} else {
				state.cycleProgress = cycleProgress;
				requestAnimationFrame( updateProgress );
			}
			return state;
		} );
	}

	function startCycling() {
		const { cycling } = get( store );
		if ( cycling ) {
			return;
		}
		store.update( ( state ) => {
			state.cycling = true;
			state.cycleProgress = 0;
			return state;
		} );
		requestAnimationFrame( updateProgress );
	}

	function stopCycling() {
		const { cycling } = get( store );
		if ( !cycling ) {
			return;
		}
		store.update( ( state ) => {
			state.cycling = false;
			state.cycleProgress = 0;
			return state;
		} );
	}

	function chooseRandomNextScene() {
		const { scenes, currentScene } = get( obsStore );
		const { includedSceneNames } = get( localStore );

		const sceneNames = scenes.map( ( scene ) => scene.sceneName );
		const candidates = sceneNames
			.filter( ( sceneName ) => sceneName !== currentScene )
			.filter( ( sceneName ) => includedSceneNames.includes( sceneName ) );
		return candidates[ Math.floor( Math.random() * candidates.length ) ];
	}

	function toggleSelecting() {
		store.update( ( state ) => {
			state.selecting = !state.selecting;
			return state;
		} );
	}

	function toggleFilter() {
		store.update( ( state ) => {
			state.filter = !state.filter;
			return state;
		} );
	}

	return {
		subscribe: store.subscribe,
		startCycling,
		stopCycling,
		toggleSelecting,
		toggleFilter
	};
}
