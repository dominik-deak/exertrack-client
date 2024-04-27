import * as SecureStore from 'expo-secure-store';
import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

/**
 * Value to convert from kilos to pounds.
 * Source: https://www.unitconverters.net/weight-and-mass/kg-to-lbs.htm
 */
const conversionVal = 2.2046226218;

type UnitPreferenceContextType = {
	unit: 'kilos' | 'pounds';
	toggleUnit: () => Promise<void>;
	kilosToPounds: (kilos: number) => number;
	poundsToKilos: (pounds: number) => number;
};

const defaultContextValue: UnitPreferenceContextType = {
	unit: 'kilos',
	toggleUnit: async () => {},
	kilosToPounds: kilos => kilos,
	poundsToKilos: pounds => pounds
};

/**
 * Context for the unit preference
 */
const UnitPreferenceContext = createContext<UnitPreferenceContextType>(defaultContextValue);

/**
 * Provider for the unit preference context
 * @param children The children elements to be wrapped by the provider
 * @returns The provider component with the children elements
 */
export default function UnitPreferenceProvider({ children }: PropsWithChildren) {
	const [unit, setUnit] = useState<'kilos' | 'pounds'>('kilos');

	useEffect(() => {
		/**
		 * Gets the user's preferred unit from secure storage
		 */
		async function getPreferredUnit() {
			const storedUnit = await SecureStore.getItemAsync('userWeightUnit');
			if (storedUnit) {
				setUnit(storedUnit as 'kilos' | 'pounds');
			}
		}

		getPreferredUnit();
	}, []);

	/**
	 * Toggles between kilos and pounds
	 */
	async function toggleUnit() {
		const newUnit = unit === 'kilos' ? 'pounds' : 'kilos';
		await SecureStore.setItemAsync('userWeightUnit', newUnit);
		setUnit(newUnit);
	}

	/**
	 * Converts kilos to pounds
	 * @param kilos weight in kilos
	 * @returns weight in pounds
	 */
	function kilosToPounds(kilos: number) {
		return Number((kilos * conversionVal).toFixed(2));
	}

	/**
	 * Converts pounds to kilos
	 * @param pounds weight in pounds
	 * @returns weight in kilos
	 */
	function poundsToKilos(pounds: number) {
		return Number((pounds / conversionVal).toFixed(2));
	}

	return (
		<UnitPreferenceContext.Provider value={{ unit, toggleUnit, kilosToPounds, poundsToKilos }}>
			{children}
		</UnitPreferenceContext.Provider>
	);
}

/**
 * Custom hook providing access to the unit preference context.
 * @return The unit preference context object, to be destructured to `{ unit, toggleUnit, convertWeight }`.
 */
export function useUnitPreference() {
	return useContext(UnitPreferenceContext);
}
