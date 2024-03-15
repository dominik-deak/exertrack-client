import { API } from '@/constants/config';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
// atob polyfill
// source: https://forum.codewithmosh.com/t/invalidtokenerror-invalid-token-specified-invalid-base64-for-part-2-property-atob-doesnt-exist/23609/3
import 'core-js/stable/atob';

interface TokenPayload {
	exp: number;
}

// TODO use axios interceptors instead of hook
function useTokens() {
	const [accessToken, setAccessTokenState] = useState<string | null>(null);
	const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	async function setAccessToken(token: string | null) {
		try {
			setAccessTokenState(token);
			if (token) {
				await SecureStore.setItemAsync('accessToken', token);
				// console.log('1: ' + token);
			} else {
				await SecureStore.deleteItemAsync('accessToken');
			}
		} catch (error) {
			setTokenError('Error setting token');
		}
	}

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

	useEffect(() => {
		async function loadTokens() {
			setIsLoading(true);
			try {
				const storedAccessToken = await SecureStore.getItemAsync('accessToken');
				const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

				// console.log('2: ' + storedAccessToken);
				// console.log('3: ' + storedRefreshToken);

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
