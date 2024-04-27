import { API } from '@/constants/config';
import { TokenPayload } from '@/types/Auth';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
// atob polyfill
// source: https://forum.codewithmosh.com/t/invalidtokenerror-invalid-token-specified-invalid-base64-for-part-2-property-atob-doesnt-exist/23609/3
import 'core-js/stable/atob';

/**
 * Manages tokens for authentication purposes.
 * @return Object containing access token, refresh token, loading state, token error, and functions to set access and refresh tokens and exchange tokens
 */
function useTokens() {
	const [accessToken, setAccessTokenState] = useState<string | null>(null);
	const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		/**
		 * Loads tokens from local storage and sets them in state.
		 * If the access token is expired, it will be exchanged for a new one.
		 */
		async function loadTokens() {
			setIsLoading(true);
			try {
				const storedAccessToken = await SecureStore.getItemAsync('accessToken');
				const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

				// console.log('access token:  ' + storedAccessToken);
				// console.log('refresh token: ' + storedRefreshToken);

				if (storedRefreshToken) {
					setRefreshTokenState(storedRefreshToken);
				}

				if (storedAccessToken && checkTokenValidity(storedAccessToken)) {
					setAccessTokenState(storedAccessToken);
				} else if (storedRefreshToken) {
					await exchangeTokens(storedRefreshToken);
				}
			} catch (error) {
				setTokenError('Failed to load tokens from storage.');
			}
			setIsLoading(false);
		}

		loadTokens();
	}, []);

	/**
	 * Stores an access token in state and encrypted local storage.
	 * If `token` is `null`, the token will be deleted from storage.
	 * @param token The access token to store
	 */
	async function setAccessToken(token: string | null) {
		try {
			setAccessTokenState(token);
			if (token) {
				await SecureStore.setItemAsync('accessToken', token);
			} else {
				await SecureStore.deleteItemAsync('accessToken');
			}
		} catch (error) {
			setTokenError('Error setting token');
		}
	}

	/**
	 * Stores a refresh token in state and encrypted local storage.
	 * If `token` is `null`, the token will be deleted from storage.
	 * @param token The refresh token to store
	 */
	async function setRefreshToken(token: string | null) {
		try {
			setRefreshTokenState(token);
			if (token) {
				await SecureStore.setItemAsync('refreshToken', token);
			} else {
				await SecureStore.deleteItemAsync('refreshToken');
			}
		} catch (error) {
			setTokenError('Error setting token');
		}
	}

	/**
	 * Checks if a token is valid by checking its expiration time
	 * @param token The token to check
	 * @returns `true` if the token is valid, `false` otherwise
	 */
	function checkTokenValidity(token: string) {
		try {
			const { exp } = jwtDecode<TokenPayload>(token);
			const currentTime = Date.now() / 1000;
			const margin = 300; // 5 minute margin, in case of a slow request
			return exp > currentTime + margin;
		} catch (error) {
			setTokenError('Invalid token format.');
			return false;
		}
	}

	/**
	 * Exchanges a refresh token for a new access token
	 * @param refreshToken The refresh token to exchange
	 */
	async function exchangeTokens(refreshToken: string) {
		try {
			const res = await axios.post(`${API}/auth/token`, { refreshToken });
			const newAccessToken = res.data.accessToken;
			await setAccessToken(newAccessToken);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setTokenError(error.response.data.error || 'An error occurred during token exchange.');
			} else {
				setTokenError('An unexpected error occurred.');
			}
		}
	}

	return {
		accessToken,
		refreshToken,
		isLoading,
		tokenError,
		setAccessToken,
		setRefreshToken,
		exchangeTokens
	};
}

export default useTokens;
