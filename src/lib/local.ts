import { writable } from 'svelte/store';

export interface LocalState {
	connectionUrl: string,
	connectionPassword: string,
	includedSceneNames: string[],
	cycleInterval: number
}

export type LocalStore = ReturnType<typeof createLocalStore>;

function getInitialLocalState() {
	return {
		connectionUrl: '',
		connectionPassword: '',
		includedSceneNames: [],
		cycleInterval: 10000
	} satisfies LocalState;
}

export function createLocalStore() {
	const localJson = localStorage.getItem( 'local' );
	const localData = localJson ? JSON.parse( localJson ) : {};
	const store = writable<LocalState>( Object.assign( getInitialLocalState(), localData ) );

	store.subscribe( ( value ) => {
		localStorage.setItem( 'local', JSON.stringify( value ) );
	} );

	function includeScene( sceneName: string ) {
		store.update( ( state ) => {
			if ( !state.includedSceneNames.includes( sceneName ) ) {
				state.includedSceneNames.push( sceneName );
			}
			return state;
		} );
	}

	function excludeScene( sceneName: string ) {
		store.update( ( state ) => {
			const index = state.includedSceneNames.indexOf( sceneName );
			if ( index !== -1 ) {
				state.includedSceneNames.splice( index, 1 );
			}
			return state;
		} );
	}

	function setCycleInterval( cycleInterval: number ) {
		store.update( ( state ) => {
			state.cycleInterval = cycleInterval;
			return state;
		} );
	}

	function setConnectionSettings( url: string, password: string ) {
		store.update( ( state ) => {
			state.connectionUrl = url;
			state.connectionPassword = password;
			return state;
		} );
	}

	return {
		subscribe: store.subscribe,
		includeScene,
		excludeScene,
		setCycleInterval,
		setConnectionSettings
	};
}
