export type Predictions = {
	[key: string]: string;
};

export type PreviousBestSets = {
	[exerciseId: string]: {
		weight: number;
		reps: number;
	};
};
