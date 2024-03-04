import { get, writable } from 'svelte/store';
import OBSWebSocket, { type OBSResponseTypes } from 'obs-websocket-js';

export interface ObsState {
	currentScene: string,
	nextScene?: string,
	transitionName: string,
	transitionDuration: number,
	transitionKind: 'cut_transition' | 'fade_transition',
	sceneIsTransitioning: boolean,
	scenes: {
		sceneName: string,
		sceneIndex: number
	}[],
	transitions: {
		transitionConfigurable: boolean,
		transitionFixed: boolean,
		transitionKind:	'cut_transition' | 'fade_transition',
		transitionName: string
	}[],
	sceneImages: { [ key: string ]: string }
}

export type ObsStore = Awaited<ReturnType<typeof createObsStore>>;

function sortScenes( scenes: ObsState[ 'scenes' ] ) {
	// OBS gives us reverse indexes for some odd reason
	return scenes.toSorted( ( a, b ) => a.sceneIndex - b.sceneIndex ).toReversed();
}

async function getSceneImages( obs: OBSWebSocket, sceneNames: string[] ) {
	const sourceScreenshots = await obs.callBatch(
		sceneNames.map( ( sceneName ) => ( {
			requestType: 'GetSourceScreenshot',
			requestData: {
				sourceName: sceneName,
				imageFormat: 'jpg',
				imageWidth: 640,
				imageHeight: 360
			}
		} ) )
	) as unknown as { responseData: OBSResponseTypes[ 'GetSourceScreenshot' ] }[];

	const sceneImages: ObsState[ 'sceneImages' ] = {};
	for ( let i = 0; i < sceneNames.length; i++ ) {
		sceneImages[ sceneNames[ i ] ] = sourceScreenshots[ i ].responseData.imageData;
	}
	return sceneImages;
}

function getTransitionKind( transitions: ObsState[ 'transitions' ], transitionName: string ) {
	const transition = transitions.find( ( t ) => t.transitionName === transitionName );
	return transition?.transitionKind ?? 'cut_transition';
}

async function getInitialState( obs: OBSWebSocket ) {
	// Scenes
	const { scenes, currentProgramSceneName } =
		( await obs.call( 'GetSceneList' ) ) as OBSResponseTypes[ 'GetSceneList' ];
	const { transitionName, transitionDuration } =
		( await obs.call( 'GetCurrentSceneTransition' ) ) as
			OBSResponseTypes[ 'GetCurrentSceneTransition' ];
	const { transitionCursor } =
		( await obs.call( 'GetCurrentSceneTransitionCursor' ) ) as
			OBSResponseTypes[ 'GetCurrentSceneTransitionCursor' ];
	const { transitions } =
		( await obs.call( 'GetSceneTransitionList' ) ) as
			OBSResponseTypes[ 'GetSceneTransitionList' ];

	// Previews
	const sceneNames = ( scenes as ObsState[ 'scenes' ] ).map( ( scene ) => scene.sceneName );
	const sceneImages = await getSceneImages( obs, sceneNames );
	const transitionKind = getTransitionKind(
		transitions as ObsState[ 'transitions' ],
		transitionName
	);

	return {
		currentScene: currentProgramSceneName,
		nextScene: undefined,
		transitionName,
		transitionDuration,
		transitionKind,
		sceneIsTransitioning: transitionCursor < 1,
		scenes: sortScenes( scenes as ObsState[ 'scenes' ] ),
		transitions: transitions as ObsState[ 'transitions' ],
		sceneImages
	} satisfies ObsState;
}

export async function createObsStore( url: string, password: string ) {
	let obs = new OBSWebSocket();
	const transitionListeners = new Set<() => void>();

	await obs.connect( url, password );

	const store = writable<ObsState>( await getInitialState( obs ) );
	obs.on( 'SceneListChanged', async ( { scenes } ) => {
		const sceneNames = ( scenes as ObsState[ 'scenes' ] ).map( ( scene ) => scene.sceneName );
		const sceneImages = await getSceneImages( obs, sceneNames );
		store.update( ( state ) => {
			state.scenes = sortScenes( scenes as ObsState[ 'scenes' ] );
			state.sceneImages = sceneImages;
			return state;
		} );
	} );
	obs.on( 'CurrentProgramSceneChanged', ( { sceneName } ) => {
		store.update( ( state ) => {
			state.currentScene = sceneName;
			return state;
		} );
	} );
	obs.on( 'CurrentSceneTransitionChanged', ( { transitionName } ) => {
		store.update( ( state ) => {
			state.transitionName = transitionName;
			state.transitionKind = getTransitionKind( state.transitions, transitionName );
			return state;
		} );
	} );
	obs.on( 'CurrentSceneTransitionDurationChanged', ( { transitionDuration } ) => {
		store.update( ( state ) => {
			state.transitionDuration = transitionDuration;
			return state;
		} );
	} );
	obs.on( 'SceneTransitionStarted', () => {
		store.update( ( state ) => {
			state.sceneIsTransitioning = true;
			return state;
		} );
	} );
	obs.on( 'SceneTransitionEnded', () => {
		store.update( ( state ) => {
			state.sceneIsTransitioning = false;
			transitionListeners.forEach( ( listener ) => listener() );
			transitionListeners.clear();
			return state;
		} );
	} );

	async function setNextScene( sceneName: string ) {
		store.update( ( state ) => {
			state.nextScene = sceneName;
			return state;
		} );
	}

	async function setTransition( transitionName: string ) {
		await obs.call( 'SetCurrentSceneTransition', { transitionName } );
	}

	async function setTransitionDuration( transitionDuration: number ) {
		await obs.call( 'SetCurrentSceneTransitionDuration', { transitionDuration } );
	}

	async function triggerTransition() {
		const { nextScene, currentScene, transitionDuration } = get( store );
		if ( nextScene && nextScene !== currentScene ) {
			await obs.call( 'SetCurrentProgramScene', { sceneName: nextScene } );
			return new Promise<void>( ( resolve ) => {
				transitionListeners.add( resolve );
				// In case the transition event doesn't fire, resolve after a timeout
				setTimeout( () => {
					transitionListeners.delete( resolve );
					resolve();
				}, transitionDuration + 1000 );
			} );
		}
	}

	return {
		subscribe: store.subscribe,
		setNextScene,
		setTransition,
		setTransitionDuration,
		triggerTransition
	};
}
