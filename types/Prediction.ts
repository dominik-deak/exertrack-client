export type Predictions = {
	[key: string]: string | null;
};

export type PreviousBestSets = {
	[exerciseId: string]: {
		weight: number;
		reps: number;
	};
};
